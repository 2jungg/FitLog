import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { sendToGemini } from "../services/dietlog_api";
import { launchImageLibrary } from "react-native-image-picker";
import { useData } from "../DataContext";
import { util_icons } from "../../assets/icon/icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DietLogStackParamList } from "./dietlog_stack";

const DietLogFormScreen = () => {
    const { setDietLogData } = useData();

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

    const navigation = useNavigation<NativeStackNavigationProp<DietLogStackParamList>>();
    const CamBttn = util_icons.cam;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>식단 기록 추가</Text>
            <Text style={styles.text}>다이어트 포럼 화면입니다!</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: "#fff",
        alignItems: 'center',
    },
    title:{
        padding: 15,
        fontWeight: 'bold',
        fontSize: 24,
        textAlign: 'center',
        color: '#8285FB',
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
    fab:{
        position: 'absolute',
        bottom: 64,
        right: 24,
        backgroundColor: '#8285FB',
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
    },
});

export default DietLogFormScreen;