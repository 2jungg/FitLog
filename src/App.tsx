import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import ProfileScreen from "./screens/profile_screen";
import WorkoutStack from "./screens/workout_stack";
import DietLogStack from "./screens/dietlog_stack";
import AppBar from "./widgets/appbar";

import { SafeAreaProvider } from "react-native-safe-area-context";

import { tab_icons } from "../assets/icon/icons";
import { View, StyleSheet } from "react-native";
import { DataProvider } from "./DataContext";

const Tab = createBottomTabNavigator();

function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                header: () => <AppBar title={route.name} />,
                tabBarShowLabel: false,
                tabBartab_iconstyle: styles.tabBarIcon,
                tabBarStyle: styles.tabBar,
                tabBarIcon: ({ focused }) => {
                    let IconComponent;

                    if (route.name === "운동") {
                        IconComponent = focused
                            ? tab_icons.workout.color
                            : tab_icons.workout.black;
                    } else if (route.name === "식단") {
                        IconComponent = focused
                            ? tab_icons.diet.color
                            : tab_icons.diet.black;
                    } else if (route.name === "프로필") {
                        IconComponent = focused
                            ? tab_icons.profile.color
                            : tab_icons.profile.black;
                    }

                    if (!IconComponent) {
                        return null;
                    }

                    return <View style={styles.tabBarIconContainer}>
                        <IconComponent />
                    </View>;
                },
                tabBarActiveTintColor: "tomato",
                tabBarInactiveTintColor: "gray",
            })}
        >
            <Tab.Screen name="운동" component={WorkoutStack} />
            <Tab.Screen name="식단" component={DietLogStack} />
            <Tab.Screen name="프로필" component={ProfileScreen} />
        </Tab.Navigator>
    );
}

function MainNavigator() {
    return <TabNavigator />;
}

function App() {
    return (
        <SafeAreaProvider>
            <DataProvider>
                <NavigationContainer>
                    <MainNavigator />
                </NavigationContainer>
            </DataProvider>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    tabBarIcon: {
        width: 24,
        height: 24,
        alignContent: "center",
        justifyContent: "center",
        marginTop: 20,
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10,
    },
    tabBar: {
        height: 78,
        backgroundColor: "#fff",
        borderTopWidth: 0,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 10,
    },
    tabBarIconContainer: {
        paddingTop: 20,
    },
});

export default App;
