import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import { sendToGemini } from "../services/dietlog_api";
import { launchImageLibrary } from "react-native-image-picker";
import { useData } from "../DataContext";
import { util_icons } from "../../assets/icon/icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DietLogStackParamList } from "./dietlog_stack";
import { DietLog } from "../models/dietlog";
import { APIResponse } from "../models/dietlog";

const dummyData: DietLog[] = [
    new DietLog(
        '1',
        new Date('2023-10-01'),
        'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.hankyung.com%2Farticle%2F2024031383791&psig=AOvVaw2GZVtwxsVHtU7uN0G6eNBZ&ust=1751803593367000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCLCB9YjXpY4DFQAAAAAdAAAAABAE',
        new APIResponse(
            'Apple',
            {
                totScore: 85,
                protein: 4,
                fat: 1,
                carbo: 3,
                dietaryFiber: 3,
                vitMin: 3,
                sodium: 1
            },
            '사과는 비타민과 미네랄이 풍부한 음식이죠.'
        ),
    ),
    new DietLog(
        '2',
        new Date('2023-10-01'),
        'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.hankyung.com%2Farticle%2F2024031383791&psig=AOvVaw2GZVtwxsVHtU7uN0G6eNBZ&ust=1751803593367000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCLCB9YjXpY4DFQAAAAAdAAAAABAE',
        new APIResponse(
            'Apple',
            {
                totScore: 85,
                protein: 4,
                fat: 1,
                carbo: 3,
                dietaryFiber: 3,
                vitMin: 3,
                sodium: 1
            },
            '사과는 비타민과 미네랄이 풍부한 음식이죠.'
        ),
    ),
    new DietLog(
        '3',
        new Date('2023-10-01'),
        'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.hankyung.com%2Farticle%2F2024031383791&psig=AOvVaw2GZVtwxsVHtU7uN0G6eNBZ&ust=1751803593367000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCLCB9YjXpY4DFQAAAAAdAAAAABAE',
        new APIResponse(
            'Apple',
            {
                totScore: 85,
                protein: 4,
                fat: 1,
                carbo: 3,
                dietaryFiber: 3,
                vitMin: 3,
                sodium: 1
            },
            '사과는 비타민과 미네랄이 풍부한 음식이죠.'
        ),
    ),
    new DietLog(
        '4',
        new Date('2023-10-01'),
        'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.hankyung.com%2Farticle%2F2024031383791&psig=AOvVaw2GZVtwxsVHtU7uN0G6eNBZ&ust=1751803593367000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCLCB9YjXpY4DFQAAAAAdAAAAABAE',
        new APIResponse(
            'Apple',
            {
                totScore: 85,
                protein: 4,
                fat: 1,
                carbo: 3,
                dietaryFiber: 3,
                vitMin: 3,
                sodium: 1
            },
            '사과는 비타민과 미네랄이 풍부한 음식이죠.'
        ),
    ),
    new DietLog(
        '5',
        new Date('2023-10-01'),
        'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.hankyung.com%2Farticle%2F2024031383791&psig=AOvVaw2GZVtwxsVHtU7uN0G6eNBZ&ust=1751803593367000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCLCB9YjXpY4DFQAAAAAdAAAAABAE',
        new APIResponse(
            'Apple',
            {
                totScore: 85,
                protein: 4,
                fat: 1,
                carbo: 3,
                dietaryFiber: 3,
                vitMin: 3,
                sodium: 1
            },
            '사과는 비타민과 미네랄이 풍부한 음식이죠.'
        ),
    ),
    new DietLog(
        '6',
        new Date('2023-10-01'),
        'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.hankyung.com%2Farticle%2F2024031383791&psig=AOvVaw2GZVtwxsVHtU7uN0G6eNBZ&ust=1751803593367000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCLCB9YjXpY4DFQAAAAAdAAAAABAE',
        new APIResponse(
            'Apple',
            {
                totScore: 85,
                protein: 4,
                fat: 1,
                carbo: 3,
                dietaryFiber: 3,
                vitMin: 3,
                sodium: 1
            },
            '사과는 비타민과 미네랄이 풍부한 음식이죠.'
        ),
    ),
];


const DietLogScreen = () => {
    const { dietLogData } = useData();

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
            <Text style={styles.title}>식단 기록</Text>
            <ScrollView style={styles.content}>
                {dummyData.length > 0 ? (
                    dummyData.map((log) => (
                        <View key={log.dietLogId} style={{ marginBottom: 20 }}>
                            <Image
                                source={{ uri: log.foodImgUrl }}
                                style={{ width: 100, height: 100, borderRadius: 10 }}
                            />
                            <Text style={styles.text}>{log.responseData.foodName}</Text>
                            <Text style={styles.text}>{log.recordDate.toDateString()}</Text>
                            <Text style={styles.text}>Score: {log.responseData.foodScore.totScore}</Text>
                            <Text style={styles.text}>{log.responseData.comment}</Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.text}>식단 기록이 없습니다.</Text>
                )}
            </ScrollView>
            <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('DietLogFormScreen')}>
                <CamBttn />
            </TouchableOpacity>
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

export default DietLogScreen;