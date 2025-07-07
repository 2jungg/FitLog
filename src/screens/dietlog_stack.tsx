// screens/WorkoutStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DietLogScreen from './dietlog_screen';
import DietLogFormScreen from './dietlog_form_screen';

export type DietLogStackParamList = {
  DietLog: undefined;
  DietLogFormScreen: undefined;
};

const Stack = createNativeStackNavigator<DietLogStackParamList>();

export default function DietLogStack() {
  return (
    <Stack.Navigator initialRouteName="DietLog">
      <Stack.Screen name="DietLog" component={DietLogScreen} options={{headerShown:false}}/>
      <Stack.Screen name='DietLogFormScreen' component={DietLogFormScreen} options={{headerShown:false}}/>
    </Stack.Navigator>
  );
}
