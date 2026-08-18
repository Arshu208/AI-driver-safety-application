import { generateAuthenticationOptions, generateRegistrationOptions, verifyAuthenticationResponse, verifyRegistrationResponse } from '@simplewebauthn/server';
import Driver from '../models/Driver';

const rpName = 'RideSafe AI';
const rpID = process.env.WEBAUTHN_RP_ID || 'localhost';
const expectedOrigin = process.env.WEBAUTHN_ORIGIN || 'http://localhost:5173';
const challenges = new Map<string, string>();

const toBase64 = (value: Uint8Array) => Buffer.from(value).toString('base64');
const fromBase64 = (value: string) => new Uint8Array(Buffer.from(value, 'base64'));

export async function registrationOptions(userId: string) {
  const user = await Driver.findById(userId);
  if (!user) throw new Error('Account not found');
  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userName: user.phone,
    userDisplayName: user.name,
    userID: Buffer.from(user.id),
    attestationType: 'none',
    excludeCredentials: (user.passkeys || []).map((credential) => ({ id: credential.credentialID })),
    authenticatorSelection: { residentKey: 'preferred', userVerification: 'required' },
  });
  challenges.set(`register:${userId}`, options.challenge);
  return options;
}

export async function verifyRegistration(userId: string, response: any) {
  const expectedChallenge = challenges.get(`register:${userId}`);
  if (!expectedChallenge) throw new Error('Face Lock registration expired');
  const verification = await verifyRegistrationResponse({ response, expectedChallenge, expectedOrigin, expectedRPID: rpID });
  if (!verification.verified || !verification.registrationInfo) throw new Error('Face Lock registration failed');
  const { credential } = verification.registrationInfo;
  await Driver.findByIdAndUpdate(userId, {
    $push: { passkeys: { credentialID: credential.id, publicKey: toBase64(credential.publicKey), counter: credential.counter } },
    $set: { faceLockEnabled: true },
  });
  challenges.delete(`register:${userId}`);
  return { verified: true };
}

export async function authenticationOptions(phone: string) {
  const user = await Driver.findOne({ phone });
  if (!user || !user.passkeys?.length) throw new Error('No Face Lock is enrolled for this account');
  const options = await generateAuthenticationOptions({
    rpID,
    userVerification: 'required',
    allowCredentials: user.passkeys.map((credential) => ({ id: credential.credentialID })),
  });
  challenges.set(`login:${phone}`, options.challenge);
  return options;
}

export async function verifyAuthentication(phone: string, response: any) {
  const user = await Driver.findOne({ phone });
  const expectedChallenge = challenges.get(`login:${phone}`);
  if (!user || !expectedChallenge) throw new Error('Face Lock login expired');
  const passkey = user.passkeys?.find((credential) => credential.credentialID === response.id);
  if (!passkey) throw new Error('Face Lock credential not recognized');
  const verification = await verifyAuthenticationResponse({
    response,
    expectedChallenge,
    expectedOrigin,
    expectedRPID: rpID,
    credential: { id: passkey.credentialID, publicKey: fromBase64(passkey.publicKey), counter: passkey.counter },
  });
  if (!verification.verified) throw new Error('Face Lock verification failed');
  passkey.counter = verification.authenticationInfo.newCounter;
  await user.save();
  challenges.delete(`login:${phone}`);
  return user;
}
