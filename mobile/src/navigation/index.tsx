import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ApplicationsListScreen from '../screens/ApplicationsListScreen';
import ApplicationFormScreen from '../screens/ApplicationFormScreen';
import ApplicationDetailScreen from '../screens/ApplicationDetailScreen';
import { AuthStackParamList, AppStackParamList } from '../types/navigation';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();

function AuthStackNavigator() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
      <AuthStack.Screen name="Register" component={RegisterScreen} options={{ title: 'Register' }} />
    </AuthStack.Navigator>
  );
}

function AppStackNavigator() {
  return (
    <AppStack.Navigator>
      <AppStack.Screen
        name="ApplicationsList"
        component={ApplicationsListScreen}
        options={{ title: 'Applications' }}
      />
      <AppStack.Screen
        name="ApplicationDetail"
        component={ApplicationDetailScreen}
        options={{ title: 'Application Details' }}
      />
      <AppStack.Screen
        name="ApplicationForm"
        component={ApplicationFormScreen}
        options={({ route }) => ({
          title: route.params?.application ? 'Edit Application' : 'Add Application',
        })}
      />
    </AppStack.Navigator>
  );
}

export function RootNavigator() {
  const { token } = useAuth();

  return (
    <NavigationContainer>
      {token ? <AppStackNavigator /> : <AuthStackNavigator />}
    </NavigationContainer>
  );
}

