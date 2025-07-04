import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ProfileScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>프로필 화면입니다!</Text>
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

export default ProfileScreen;
