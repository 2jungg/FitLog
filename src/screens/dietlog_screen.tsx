import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    Modal,
} from "react-native";
import { sendToGemini } from "../services/dietlog_api";
import { launchImageLibrary } from "react-native-image-picker";
import { useData } from "../DataContext";
import { util_icons } from "../../assets/icon/icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DietLogStackParamList } from "./dietlog_stack";
import { DietLog, DietLogGroupByDate, APIResponse } from "../models/dietlog";

const formatDate = (date: Date): string => {
    if (!(date instanceof Date)) {
        throw new Error("Invalid date object");
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const target = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    );

    const diff = (today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24);

    if (diff === 0) {
        return "오늘";
    } else if (diff === 1) {
        return "어제";
    } else {
        return date.toLocaleDateString("ko-KR");
    }
};

const formatStar = (score: number): string => {
    if (score < 0 || score > 5) {
        throw new Error("Score must be between 0 and 100");
    }

    const fullStars = score;
    const emptyStars = 5 - fullStars;

    return "★".repeat(fullStars) + "☆".repeat(emptyStars);
};

const DietLogScreen = () => {
    const { dietLogData, deleteDietLog } = useData();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDietLog, setselectedDietLog] = useState<DietLog | null>(
        null
    );
    const openModal = (_dietLog: DietLog) => {
        setselectedDietLog(_dietLog);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setselectedDietLog(null);
    };

    const navigation =
        useNavigation<NativeStackNavigationProp<DietLogStackParamList>>();
    const CamBttn = util_icons.cam;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>식단 기록</Text>
            <ScrollView style={styles.content}>
                {dietLogData.isEmpty() ? (
                    <View style={styles.card}>
                        <Text style={{ margin: 20 }}> 식단 기록이 없습니다. </Text>
                    </View>
                ) : (
                    Array.from(dietLogData.dietLogs.entries())
                        .sort(([a], [b]) => b.localeCompare(a)) // Descending order by date string
                        .map(([date, logs]) => (
                            <View key={date} style={styles.card}>
                                <Text style={styles.dateText}>
                                    {formatDate(new Date(date))}
                                </Text>
                                <View style={styles.imgCard}>
                                    {logs.sort((a, b) =>
                                                b.recordDate.getTime() -
                                                a.recordDate.getTime())
                                        .map((log: DietLog) => (
                                        <View
                                            key={log.dietLogId}
                                            style={styles.imgContainer}
                                        >
                                            <TouchableOpacity
                                                onPress={() => openModal(log)}
                                            >
                                                <Image
                                                    source={{
                                                        uri: log.foodImgUrl,
                                                    }}
                                                    style={styles.img}
                                                />
                                            </TouchableOpacity>
                                            <Text style={styles.imgName}>
                                                {log.responseData.foodName}
                                            </Text>
                                            <Text style={styles.imgTime}>
                                                {log.recordDate
                                                    .toLocaleTimeString("ko-KR")
                                                    .slice(0, -3)}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )
                    )
                )}
            </ScrollView>
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={closeModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {selectedDietLog && (
                            <>
                                <View style={styles.modalbar}>
                                    <TouchableOpacity
                                        //style={styles.delBtnText}
                                        onPress={() => {
                                            deleteDietLog(selectedDietLog.dietLogId);
                                            closeModal();
                                        }}
                                    >
                                        <Text>삭제</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={closeModal}
                                        //style={styles.modalCloseBtn}
                                    >
                                        <Text style={styles.modalCloseText}>×</Text>
                                    </TouchableOpacity>

                                </View>
                                <Text style={styles.modalTitle}>
                                    {selectedDietLog.responseData.foodName}
                                </Text>
                                {selectedDietLog.foodImgUrl && (
                                    <Image
                                        source={{
                                            uri: selectedDietLog.foodImgUrl,
                                        }}
                                        style={styles.modalImage}
                                    />
                                )}
                                <Text style={styles.modalDate}>
                                    {formatDate(selectedDietLog.recordDate)}{" "}
                                    {selectedDietLog.recordDate
                                        .toLocaleTimeString("ko-KR")
                                        .slice(0, -3)}
                                </Text>
                                <Text style={styles.subScore}>
                                    탄수화물:{" "}
                                    {formatStar(
                                        selectedDietLog.responseData.foodScore
                                            .carbo
                                    )}
                                </Text>
                                <Text style={styles.subScore}>
                                    단백질:{" "}
                                    {formatStar(
                                        selectedDietLog.responseData.foodScore
                                            .protein
                                    )}
                                </Text>
                                <Text style={styles.subScore}>
                                    지방:{" "}
                                    {formatStar(
                                        selectedDietLog.responseData.foodScore
                                            .fat
                                    )}
                                </Text>
                                <Text style={styles.subScore}>
                                    식이섬유:{" "}
                                    {formatStar(
                                        selectedDietLog.responseData.foodScore
                                            .dietaryFiber
                                    )}
                                </Text>
                                <Text style={styles.subScore}>
                                    비타민/미네랄:{" "}
                                    {formatStar(
                                        selectedDietLog.responseData.foodScore
                                            .vitMin
                                    )}
                                </Text>
                                <Text style={styles.subScore}>
                                    나트륨:{" "}
                                    {formatStar(
                                        selectedDietLog.responseData.foodScore
                                            .sodium
                                    )}
                                </Text>
                                <Text style={styles.totScore}>
                                    총점:{" "}
                                    <Text style={{ fontWeight: "bold" }}>
                                        {
                                            selectedDietLog.responseData
                                                .foodScore.totScore
                                        }
                                        점
                                    </Text>
                                </Text>
                                <View style={styles.commentBox}>
                                    <Text style={styles.commentText}>
                                        {selectedDietLog.responseData.comment ||
                                            "코멘트가 없습니다."}
                                    </Text>
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
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
        fontWeight: "bold"
    },
    fab:{
        position: 'absolute',
        bottom: 40,
        right: 24,
        backgroundColor: '#8285FB',
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
    },
    card: {
        backgroundColor: "#ffffff",
        padding: 10,
        shadowOffset: {
            width: 0,
            height: 1,
        },
    },
    imgCard: {
        flexDirection: "row",
        flexWrap: "wrap", // Allow items to wrap to the next line
        justifyContent: "flex-start",
    },
    imgContainer: {
        shadowColor: "#000",
        alignItems: "center",
        
        width: "33%", // Adjust width to fit two images per row
    },
    img: {
        width: 110,
        height: 110,
        marginTop: 10,    
        marginBottom: 5,
        marginHorizontal: 5
    },
    imgName: {
        textAlign: "center",
        fontSize: 14,
    },
    imgTime: {
        fontSize: 12,
        color: "#888",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        width: "80%",
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 12,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    modalImage: {
        width: 200,
        height: 200,
        marginVertical: 10,
        borderRadius: 10,
    },
    modalCloseText: {
        fontSize: 25,
    },
    delBtnText: {
        fontSize: 5,
        color: "#333",
        textAlign: "left",
    },
    subScore: {
        fontSize: 14,
        color: "#333",
        marginBottom: 2,
    },
    modalDate: {
        fontSize: 16,
        color: "#666",
        marginBottom: 20,
    },
    totScore: {
        fontSize: 25,
        margin: 15,
    },
    commentBox: {
        backgroundColor: "#f0f0f0",
        borderRadius: 8,
        marginTop: 5,
        width: "90%",
        alignItems: "center",
        paddingVertical: 15,
        marginBottom: 5,
    },
    commentText: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#8285FB",
        textAlign: "center",
        paddingHorizontal: 10,
    },
    modalbar:{
        flexDirection: "row",
        justifyContent: "space-between",
        width: "90%",
        alignItems: "center",
    }
});

export default DietLogScreen;
