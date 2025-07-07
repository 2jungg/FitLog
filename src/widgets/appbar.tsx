import React, { useReducer, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useData } from '../DataContext';

interface AppBarProps {
    title: string;
}

const AppBar: React.FC<AppBarProps> = ({ title }) => {
    const { userData } = useData();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>FitLog</Text>
            {title !== "프로필" && <Text style={styles.name}>{userData?.username}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 78,
        backgroundColor: "#fff",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: {
        fontSize: 40,
        fontWeight: "bold",
        color: "#000",
        marginLeft: 40,
    },
    name: {
        fontSize: 15,
        color: "#000",
        textAlign: "right",
        marginTop: 5,
        marginRight: 30,
    },
});

export default AppBar;
