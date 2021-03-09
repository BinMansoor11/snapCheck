import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import {
  Drawer_navigation,
  Settings,
  Splash,
  Login,
  SignUp,
  Admin,
} from './screens';
import BottomTab from './BottomTab';

import { useSelector } from 'react-redux';

const Stack = createStackNavigator();

export default function MyStack(props) {
  const authState = useSelector((state) => state.auth);
  const { user } = authState;

  return (
    <Stack.Navigator
      headerMode="none"
      initialRouteName={user == '' ? 'Login' : 'Drawer_navigation'}>
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Admin" component={Admin} />
      <Stack.Screen name="Drawer_navigation" component={Drawer_navigation} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="BottomTab" component={BottomTab} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Login" component={Login} />
    </Stack.Navigator>
  );
}
