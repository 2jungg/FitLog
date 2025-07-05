import React from "react";
import { NavigationContainer, useRoute } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ProfileScreen from "./screens/profile_screen";
import WorkoutScreen from "./screens/workout_screen";
import DietLogScreen from "./screens/dietlog_screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { icons } from "../assets/icon/icons";

const Tab = createBottomTabNavigator();

function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, size }) => {
                    let IconComponent;

                    if (route.name === "운동") {
                        IconComponent = focused ? icons.workout.color : icons.workout.black;
                    } else if (route.name === "식단") {
                        IconComponent = focused ? icons.diet.color : icons.diet.black;
                    } else if (route.name === "프로필") {
                        IconComponent = focused ? icons.profile.color : icons.profile.black;
                    }

                    if (!IconComponent) {
                        return null;
                    }

                    return <IconComponent width={size} height={size} />;
                },
                tabBarActiveTintColor: "tomato",
                tabBarInactiveTintColor: "gray",
            })}
        >
            <Tab.Screen name="운동" component={WorkoutScreen} />
            <Tab.Screen name="식단" component={DietLogScreen} />
            <Tab.Screen name="프로필" component={ProfileScreen} />
        </Tab.Navigator>
    );
}

function MainNavigator() {
    return (
        <TabNavigator />
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
