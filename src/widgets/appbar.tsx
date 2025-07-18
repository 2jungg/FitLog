import React, { useReducer, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useData } from '../DataContext';
import { Image } from "react-native";

interface AppBarProps {
    title: string;
}

const AppBar: React.FC<AppBarProps> = ({ title }) => {
    const { userData } = useData();
    return (
        
        <View style={styles.appBar}>
            <Image source={require('../../assets/logo/FitLog_change.png')} style={styles.logo}/>
            {title !== "프로필" && <Text style={styles.name}>{userData?.username} 님</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    appBar: {
        height: 60,
        backgroundColor: "#fff",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderTopWidth: 0,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 10,
    },
    logo: {
        width: 100,
        height: 50,
        marginLeft: 20,
        alignItems: 'center',
    },
    name: {
        fontSize: 15,
        color: "#000",
        marginRight: 30,
    },
});

export default AppBar;
