import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ProfileScreen from "./screens/profile_screen";
import WorkoutScreen from "./screens/workout_screen";
import DietLogScreen from "./screens/dietlog_screen";
import { SafeAreaProvider } from "react-native-safe-area-context";

const Tab = createBottomTabNavigator();

function MainNavigator() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="운동" component={WorkoutScreen} />
            <Tab.Screen name="식단" component={DietLogScreen} />
            <Tab.Screen name="프로필" component={ProfileScreen} />
        </Tab.Navigator>
    );
}

function App() {
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <MainNavigator />
            </NavigationContainer>
        </SafeAreaProvider>
    );
}

export default App;
