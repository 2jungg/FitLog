import React from "react";
import { View, Text, StyleSheet } from "react-native";

const WorkoutScreen = () => {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.text}>워크아웃 화면입니다!</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    text: {
        fontSize: 16,
        color: "#000",
    },
});

export default WorkoutScreen;
