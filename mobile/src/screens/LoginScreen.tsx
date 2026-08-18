import { useState } from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { colors, styles } from '../theme';

export default function LoginScreen({ navigation }: { navigation: any }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await signIn(phone.trim(), password);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.title}>RideSafe Sign In</Text>
        <Text style={styles.subtitle}>Use your registered phone and password to continue.</Text>

        <TextInput
          style={styles.input}
          placeholder="Phone number"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {error ? <Text style={{ color: colors.danger, marginVertical: 8 }}>{error}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign In</Text>}
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 16 }}>
          <Text style={{ color: colors.muted }}>Don’t have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={{ color: colors.primary, marginLeft: 6, fontWeight: '700' }}>Create one</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
