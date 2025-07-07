import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface AppBarProps {
    title: string;
}

const AppBar: React.FC<AppBarProps> = ({ title }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>FitLog</Text>
            {title !== "프로필" && <Text style={styles.name}>이중권님</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 70 ,
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
