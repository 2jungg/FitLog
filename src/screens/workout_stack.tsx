// screens/WorkoutStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WorkoutScreen from './workout_screen';
import WorkoutFormScreen from './workout_form_screen';

export type WorkoutStackParamList = {
  Workout: undefined;
  WorkoutForm: undefined;
};

const Stack = createNativeStackNavigator<WorkoutStackParamList>();

export default function WorkoutStack() {
  return (
    <Stack.Navigator initialRouteName="Workout">
      <Stack.Screen name="Workout" component={WorkoutScreen} options={{headerShown:false}}/>
      <Stack.Screen name="WorkoutForm" component={WorkoutFormScreen} options={{headerShown:false}}/>
    </Stack.Navigator>
  );
}
