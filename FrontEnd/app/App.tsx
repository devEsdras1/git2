import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/LoginScreen';
import PedidosScreen from './src/PedidosScreen';

export type RootStackParamList = {
  Login: undefined;
  Pedidos: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Pedidos" component={PedidosScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
