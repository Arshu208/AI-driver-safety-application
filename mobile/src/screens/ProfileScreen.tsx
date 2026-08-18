import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { colors, styles } from '../theme';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Driver Profile</Text>
      <Text style={styles.subtitle}>Manage your RideSafe account and keep it synced with the backend.</Text>

      <View style={[styles.card, { marginTop: 16 }]}> 
        <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12 }}>Personal details</Text>
        <Text style={{ color: colors.muted }}>Name: {user?.name}</Text>
        <Text style={{ color: colors.muted, marginTop: 6 }}>Phone: {user?.phone}</Text>
        <Text style={{ color: colors.muted, marginTop: 6 }}>Email: {user?.email || 'Not set'}</Text>
        <Text style={{ color: colors.muted, marginTop: 6 }}>Vehicle: {user?.vehicleNumber || 'Not set'}</Text>
        <Text style={{ color: colors.muted, marginTop: 6 }}>Emergency contact: {user?.emergencyContact || 'Not set'}</Text>
        <Text style={{ color: colors.muted, marginTop: 6 }}>Safety score: {user?.safetyScore ?? '—'}</Text>
      </View>

      <TouchableOpacity style={[styles.button, { marginTop: 20, backgroundColor: colors.danger }]} onPress={signOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
