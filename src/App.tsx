/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from "react";
import {
    StatusBar,
    StyleSheet,
    useColorScheme,
    View,
    Button,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { sendToGemini } from "./services/dietlog_api";
import "../models/dietlog";
import { NavigationContainer } from "@react-navigation/native";

function App() {
    const isDarkMode = useColorScheme() === "dark";

    const handlePress = async () => {
        try {
            const result = await launchImageLibrary({
                mediaType: "photo",
                includeBase64: true,
            });

            if (result.didCancel) {
                console.log("User cancelled image picker");
            } else if (result.errorCode) {
                console.log("ImagePicker Error: ", result.errorMessage);
            } else if (result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                if (asset.base64 && asset.type) {
                    const response = await sendToGemini(
                        asset.base64,
                        asset.type
                    );
                    console.log("Gemini API Response:", response);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };
    
    return (
        <NavigationContainer>
            <View style={styles.container}>
                <StatusBar
                    barStyle={isDarkMode ? "light-content" : "dark-content"}
                    backgroundColor={isDarkMode ? "#000" : "#fff"}
                />
                <Button title="이미지 선택 및 분석" onPress={handlePress} />
            </View>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default App;
