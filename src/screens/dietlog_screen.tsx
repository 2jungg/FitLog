import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { sendToGemini } from "../services/dietlog_api";
import { launchImageLibrary } from "react-native-image-picker";

const DietLogScreen = () => {
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
        <View style={styles.container}>
            <Text style={styles.text}>다이어트 로그 화면입니다!</Text>
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

export default DietLogScreen;