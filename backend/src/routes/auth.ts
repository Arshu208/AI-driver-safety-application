import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Driver from '../models/Driver';
import { getSocketIo } from '../websocket';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { authenticationOptions, registrationOptions, verifyAuthentication, verifyRegistration } from '../services/faceLock';

const router = express.Router();

router.post('/face-lock/register/options', async (req, res) => {
  try { res.json(await registrationOptions(req.body.userId)); }
  catch (error: any) { res.status(400).json({ message: error.message }); }
});

router.post('/face-lock/register/verify', async (req, res) => {
  try { res.json(await verifyRegistration(req.body.userId, req.body.response)); }
  catch (error: any) { res.status(400).json({ message: error.message }); }
});

router.post('/face-lock/login/options', async (req, res) => {
  try { res.json(await authenticationOptions(req.body.phone)); }
  catch (error: any) { res.status(400).json({ message: error.message }); }
});

router.post('/face-lock/login/verify', async (req, res) => {
  try {
    const user = await verifyAuthentication(req.body.phone, req.body.response);
    const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET || 'secret123', { expiresIn: '5 days' });
    res.json({ token, user: { id: user.id, name: user.name, phone: user.phone, email: user.email, vehicleNumber: user.vehicleNumber, emergencyContact: user.emergencyContact, safetyScore: user.safetyScore, role: 'DRIVER' } });
  } catch (error: any) { res.status(401).json({ message: error.message }); }
});

// @route POST /api/auth/register
// @desc Register a new driver
router.post('/register', async (req, res) => {
  try {
    const { name, phone, email, password, vehicleNumber, emergencyContact } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({ message: 'Name, phone, and password are required' });
    }
    
    // Check if user already exists
    let user = await Driver.findOne({ phone });
    if (user) {
      return res.status(400).json({ message: 'Driver already exists with this phone number' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create driver
    user = new Driver({
      name,
      phone,
      email,
      password: hashedPassword,
      vehicleNumber,
      emergencyContact,
      safetyScore: 100 // default
    });
    
    await user.save();
    
    // Create JWT
    const payload = {
      user: {
        id: user.id
      }
    };
    
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'secret123',
      { expiresIn: '5 days' },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token,
          user: {
            id: user.id,
            name: user.name,
            phone: user.phone,
            email: user.email,
            vehicleNumber: user.vehicleNumber,
            emergencyContact: user.emergencyContact,
            safetyScore: user.safetyScore,
            role: 'DRIVER'
          }
        });
      }
    );
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route POST /api/auth/login
// @desc Authenticate driver & get token
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: 'Phone and password are required' });
    }
    
    // Check if user exists
    let user = await Driver.findOne({ phone });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password || '');
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Create JWT
    const payload = {
      user: {
        id: user.id
      }
    };
    
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'secret123',
      { expiresIn: '5 days' },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token,
          user: {
            id: user.id,
            name: user.name,
            phone: user.phone,
            email: user.email,
            vehicleNumber: user.vehicleNumber,
            emergencyContact: user.emergencyContact,
            safetyScore: user.safetyScore,
            role: 'DRIVER'
          }
        });
      }
    );
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update profile - authenticated
router.post('/profile', requireAuth, async (req: AuthRequest, res) => {
  try {
    const updates = req.body;
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const user = await Driver.findByIdAndUpdate(userId, updates, { new: true }).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Emit realtime update
    const io = getSocketIo();
    if (io) {
      try {
        console.log('Emitting profile:updated for user', userId);
        io.emit('profile:updated', { userId, user });
        console.log('Emitted profile:updated to sockets. Connected clients:', (io.sockets ? io.sockets.sockets.size : 'unknown'));
      } catch (e) {
        console.error('Failed to emit profile update', e);
      }
    }

    res.json({ user });
  } catch (error: any) {
    console.error('Profile update failed', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

export default router;
