// screens/WorkoutStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DietLogScreen from './dietlog_screen';

const Stack = createNativeStackNavigator();

export default function DietLogStack() {
  return (
    <Stack.Navigator initialRouteName="DietLog">
      <Stack.Screen name="DietLog" component={DietLogScreen} options={{headerShown:false}}/>
      <Stack.Screen name='DietLogForm' component={DietLogScreen} options={{headerShown:false}}/>
    </Stack.Navigator>
  );
}
