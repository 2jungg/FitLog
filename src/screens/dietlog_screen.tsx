import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
} from "react-native";
import { sendToGemini } from "../services/dietlog_api";
import { launchImageLibrary } from "react-native-image-picker";
import { useData } from "../DataContext";
import { util_icons } from "../../assets/icon/icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DietLogStackParamList } from "./dietlog_stack";
import { DietLog, DietLogGroupByDate, APIResponse } from "../models/dietlog";

const dummyData: DietLogGroupByDate = new DietLogGroupByDate();

dummyData.addDietLog(
    new DietLog(
        "1",
        new Date("2025-07-07T12:34:00"),
        "https://cdn.oasis.co.kr:48581/product/88871/thumb/f9653bbb-3142-4224-baf6-ec37dbdafb68.jpg",
        new APIResponse(
            "닭가슴살 샐러드와 김치볶음밥",
            {
                totScore: 85,
                protein: 5,
                fat: 2,
                carbo: 3,
                dietaryFiber: 4,
                vitMin: 5,
                sodium: 2,
            },
            "건강한 식단입니다!"
        )
    )
);

dummyData.addDietLog(
    new DietLog(
        "2",
        new Date("2025-07-07T12:56:00"),
        "https://oasisprodproduct.edge.naverncp.com/94403/detail/4_e713f898-4b47-4d73-bfcd-651691cd95e6.jpg",
        new APIResponse(
            "김치찌개",
            {
                totScore: 60,
                protein: 3,
                fat: 3,
                carbo: 3,
                dietaryFiber: 2,
                vitMin: 3,
                sodium: 5,
            },
            "나트륨이 다소 높아요."
        )
    )
);

dummyData.addDietLog(
    new DietLog(
        "3",
        new Date("2025-07-07T12:34:00"),
        "https://cdn.oasis.co.kr:48581/product/88871/thumb/f9653bbb-3142-4224-baf6-ec37dbdafb68.jpg",
        new APIResponse(
            "닭가슴살 샐러드",
            {
                totScore: 85,
                protein: 5,
                fat: 2,
                carbo: 3,
                dietaryFiber: 4,
                vitMin: 5,
                sodium: 2,
            },
            "건강한 식단입니다!"
        )
    )
);

dummyData.addDietLog(
    new DietLog(
        "4",
        new Date("2025-07-07T12:34:00"),
        "https://cdn.oasis.co.kr:48581/product/88871/thumb/f9653bbb-3142-4224-baf6-ec37dbdafb68.jpg",
        new APIResponse(
            "닭가슴살 샐러드",
            {
                totScore: 85,
                protein: 5,
                fat: 2,
                carbo: 3,
                dietaryFiber: 4,
                vitMin: 5,
                sodium: 2,
            },
            "건강한 식단입니다!"
        )
    )
);

dummyData.addDietLog(
    new DietLog(
        "7",
        new Date("2025-07-06T12:56:00"),
        "https://oasisprodproduct.edge.naverncp.com/94403/detail/4_e713f898-4b47-4d73-bfcd-651691cd95e6.jpg",
        new APIResponse(
            "김치찌개",
            {
                totScore: 60,
                protein: 3,
                fat: 3,
                carbo: 3,
                dietaryFiber: 2,
                vitMin: 3,
                sodium: 5,
            },
            "나트륨이 다소 높아요."
        )
    )
);

dummyData.addDietLog(
    new DietLog(
        "7",
        new Date("2025-07-03T12:56:00"),
        "https://oasisprodproduct.edge.naverncp.com/94403/detail/4_e713f898-4b47-4d73-bfcd-651691cd95e6.jpg",
        new APIResponse(
            "김치찌개",
            {
                totScore: 60,
                protein: 3,
                fat: 3,
                carbo: 3,
                dietaryFiber: 2,
                vitMin: 3,
                sodium: 5,
            },
            "나트륨이 다소 높아요."
        )
    )
);

dummyData.addDietLog(
    new DietLog(
        "7",
        new Date("2025-07-02T12:56:00"),
        "https://oasisprodproduct.edge.naverncp.com/94403/detail/4_e713f898-4b47-4d73-bfcd-651691cd95e6.jpg",
        new APIResponse(
            "김치찌개",
            {
                totScore: 60,
                protein: 3,
                fat: 3,
                carbo: 3,
                dietaryFiber: 2,
                vitMin: 3,
                sodium: 5,
            },
            "나트륨이 다소 높아요."
        )
    )
);

const formatDate = (date: Date): string => {
    if (!(date instanceof Date)) {
        throw new Error("Invalid date object");
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const diff = (today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24);

    if (diff === 0) {
        return "오늘";
    } else if (diff === 1) {
        return "어제";
    } else {
        return date.toLocaleDateString('ko-KR');
    }
};

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

    const navigation =
        useNavigation<NativeStackNavigationProp<DietLogStackParamList>>();
    const CamBttn = util_icons.cam;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>식단 기록</Text>
            <ScrollView style={styles.content}>
                {dummyData.isEmpty() ? (
                    <Text style={styles.text}>식단 기록이 없습니다.</Text>
                ) : (
                    Array.from(dummyData.dietLogs.entries()).map(
                        ([date, logs]) => (
                            <View key={date} style={styles.card}>
                                <Text style={styles.dateText}>
                                    {formatDate(new Date(date))}
                                </Text>
                                <View style={styles.imgCard}>
                                    {logs.map((log: DietLog) => (
                                    <View key={log.dietLogId} style={styles.imgContainer}>
                                        <Image
                                            source={{ uri: log.foodImgUrl }}
                                            style={styles.img}
                                        />
                                        <Text style={styles.imgName}>
                                            {log.responseData.foodName}
                                        </Text>
                                        <Text style={styles.imgTime}>
                                            {log.recordDate.toLocaleTimeString('ko-KR').slice(0, -3)}
                                        </Text>
                                    </View>
                                ))}
                                </View>
                            </View>
                        )
                    )
                )}
            </ScrollView>
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate("DietLogFormScreen")}
            >
                <CamBttn />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    title: {
        padding: 15,
        fontWeight: "bold",
        fontSize: 24,
        textAlign: "center",
        color: "#8285FB",
    },
    content: {
        flex: 1,
    },
    text: {
        fontSize: 16,
        color: "#000",
    },
    dateText: {
        fontSize: 14,
        color: "#333",
        marginLeft: 10,
    },
    fab: {
        position: "absolute",
        bottom: 64,
        right: 24,
        backgroundColor: "#8285FB",
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
        elevation: 6,
    },
    card: {
        backgroundColor: "#ffffff",
        padding: 15,
        shadowOffset: {
            width: 0,
            height: 1,
        },
    },
    imgCard: {
        flexDirection: "row",
        flexWrap: 'wrap',     // Allow items to wrap to the next line
        justifyContent: 'flex-start', 
    },
    imgContainer: {
        shadowColor: "#000",
        alignItems: "center",
        marginBottom: 5,
        width: "33%", // Adjust width to fit two images per row
    },
    img: {
        width: 110,
        height: 110,
        marginTop: 10,
        marginBottom: 5,
    },
    imgName: {
        textAlign: "center",
        fontSize: 14,
    },
    imgTime: {
        fontSize: 12,
        color: "#888",
    }
});

export default DietLogScreen;
