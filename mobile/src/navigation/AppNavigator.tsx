import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { MaterialIcons, FontAwesome5, Entypo, Feather } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import MonitoringScreen from '../screens/MonitoringScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TripHistoryScreen from '../screens/TripHistoryScreen';
import NavigationScreen from '../screens/NavigationScreen';
import RestPlacesScreen from '../screens/RestPlacesScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#0ea5e9',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: { backgroundColor: '#ffffff', borderTopColor: '#e2e8f0' },
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Home') return <MaterialIcons name="home" size={size} color={color} />;
          if (route.name === 'Monitor') return <FontAwesome5 name="eye" size={size} color={color} />;
          if (route.name === 'Navigation') return <MaterialIcons name="navigation" size={size} color={color} />;
          if (route.name === 'Reports') return <Entypo name="bar-graph" size={size} color={color} />;
          if (route.name === 'Support') return <Feather name="phone-call" size={size} color={color} />;
          if (route.name === 'Profile') return <MaterialIcons name="person" size={size} color={color} />;
          return null;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Monitor" component={MonitoringScreen} />
      <Tab.Screen name="Navigation" component={NavigationScreen} />
      <Tab.Screen name="Reports" component={TripHistoryScreen} />
      <Tab.Screen name="Support" component={RestPlacesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f8fc',
  },
});
