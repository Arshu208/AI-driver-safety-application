import { useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { colors, styles } from '../theme';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signUp } = useAuth();

  const handleSignup = async () => {
    setLoading(true);
    setError('');
    try {
      await signUp({ name, phone, email, password, vehicleNumber, emergencyContact });
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Create RideSafe Account</Text>
      <Text style={styles.subtitle}>Sign up once to use the same backend and data as the web app.</Text>

      <TextInput style={styles.input} placeholder="Full name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Phone number" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
      <TextInput style={styles.input} placeholder="Email (optional)" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <TextInput style={styles.input} placeholder="Vehicle number" value={vehicleNumber} onChangeText={setVehicleNumber} />
      <TextInput style={styles.input} placeholder="Emergency contact" keyboardType="phone-pad" value={emergencyContact} onChangeText={setEmergencyContact} />

      {error ? <Text style={{ color: colors.danger, marginVertical: 8 }}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}
