import React, { useState } from "react";
import {
    View,
    ScrollView,
    Pressable,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Modal,
} from "react-native";
import CustomAlert from "./dietlog_popup";
import { sendToGemini } from "../services/dietlog_api";
import { launchCamera, launchImageLibrary, Asset } from "react-native-image-picker";
import { request, PERMISSIONS, RESULTS } from "react-native-permissions";
import { Platform } from "react-native";
import { useData } from "../DataContext";
import { util_icons } from "../../assets/icon/icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DietLogStackParamList } from "./dietlog_stack";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { DietLog, DietLogGroupByDate } from "../models/dietlog";
import uuid from "react-native-uuid";

const DietLogFormScreen = () => {
    const { dietLogData, addDietLog } = useData();
    const navigation = useNavigation<NativeStackNavigationProp<DietLogStackParamList>>();
    const [foodTime, setFoodTime] = useState(new Date());
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [isDataLoading, setIsDataLoading] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState("");
    const [alertMessage, setAlertMessage] = useState("");

    const showAlert = (title: string, message: string) => {
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertVisible(true);
    };

    const handleConfirmTime = (selectedDate: Date) => {
        setFoodTime(selectedDate);
        setShowTimePicker(false);
    };
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [base64Image, setBase64Image] = useState<string | null>(null);
    const [mimeType, setMimeType] = useState<string | null>(null);
    const ImgBttn = util_icons.empty_img;

    const [showImagePickerModal, setShowImagePickerModal] = useState(false);

    const requestCameraPermission = async () => {
        if (Platform.OS === 'android') {
            const result = await request(PERMISSIONS.ANDROID.CAMERA);
            return result === RESULTS.GRANTED;
        }
        return true;
    };

    const requestStoragePermission = async () => {
        if (Platform.OS === 'android') {
            const result = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
            return result === RESULTS.GRANTED;
        }
        return true;
    };

    const handleCamera = async () => {
        const granted = await requestCameraPermission();
        if (!granted) {
            showAlert("권한 필요", "카메라 접근 권한이 필요합니다.");
            return;
        }
        try {
            const result = await launchCamera({ mediaType: "photo", includeBase64: true });
            if (result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                if (asset.base64 && asset.type) {
                    setImageUrl(`data:${asset.type};base64,${asset.base64}`);
                    setBase64Image(asset.base64);
                    setMimeType(asset.type);
                } else if (asset.uri) {
                    setImageUrl(asset.uri);
                }
            }
        } catch (error) {
            console.error("카메라 에러:", error);
        }
        setShowImagePickerModal(false);
    };

    const handleGallery = async () => {
        const granted = await requestStoragePermission();
        if (!granted) {
            showAlert("권한 필요", "갤러리 접근 권한이 필요합니다.");
            return;
        }
        try {
            const result = await launchImageLibrary({ mediaType: "photo", includeBase64: true });
            if (result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                if (asset.base64 && asset.type) {
                    setImageUrl(`data:${asset.type};base64,${asset.base64}`);
                    setBase64Image(asset.base64);
                    setMimeType(asset.type);
                } else if (asset.uri) {
                    setImageUrl(asset.uri);
                }
            }
        } catch (error) {
            console.error("갤러리 에러:", error);
        }
        setShowImagePickerModal(false);
    };
    return (
        <View style={styles.container}>
            <Text style={styles.title}>식단 기록 추가</Text>
            <ScrollView contentContainerStyle={styles.scrollcontainer}>
                {/*시작 날짜와 시작 시간*/}
                <Text style={styles.formtext}>식사 시간</Text>
                <Pressable
                    style={styles.input}
                    onPress={() => setShowTimePicker(true)}
                >
                    <Text>{foodTime.toLocaleString()}</Text>
                </Pressable>
                {showTimePicker && (
                    <DateTimePickerModal
                        isVisible={showTimePicker}
                        mode="datetime"
                        date={foodTime}
                        onConfirm={handleConfirmTime}
                        onCancel={() => setShowTimePicker(false)}
                        locale="ko_KR"
                        is24Hour={true}
                        timeZoneName={"Asia/Seoul"}
                    />
                )}

                {/*음식 사진*/}
                <Text style={styles.formtext}>음식 사진</Text>
                <TouchableOpacity style={styles.imginput} onPress={() => setShowImagePickerModal(true)}>
                    {imageUrl ? (
                        <Image
                            source={{ uri: imageUrl }}
                            style={styles.imginput}
                        />
                    ) : (
                        <ImgBttn />
                    )}
                </TouchableOpacity>
                {isDataLoading && (
                    <Text style={styles.text}>음식 분석 중...</Text>
                )}
            </ScrollView>

            <View style={styles.row}>
                {/*닫기 버튼*/}
                <TouchableOpacity style={styles.button1}>
                    <Text
                        style={styles.buttonText1}
                        onPress={() => navigation.navigate("DietLog")}
                    >
                        닫기
                    </Text>
                </TouchableOpacity>
                {/*완료 버튼*/}
                <TouchableOpacity
                    style={styles.button2}
                    onPress={() => {
                        if (!imageUrl || !base64Image || !mimeType) {
                            showAlert("알림", "음식 사진을 선택해주세요.");
                            return;
                        }
                        if (!foodTime) {
                            showAlert("알림", "식사 시간을 선택해주세요.");
                            return;
                        }
                        setIsDataLoading(true);
                        sendToGemini(base64Image, mimeType)
                            .then((response) => {
                                const newLog = new DietLog(
                                    "DL_" + uuid.v4() as string,
                                    foodTime,
                                    imageUrl,
                                    response
                                );
                                addDietLog(newLog);
                                console.log("식단 정보 저장 완료:", dietLogData);
                                navigation.navigate("DietLog");
                            })
                            .catch((error) => {
                                console.error(error);
                                showAlert("오류", "식단 정보를 저장하는 중 오류가 발생했습니다.");
                            });
                    }}
                >
                    <Text style={styles.buttonText2}>완료</Text>
                </TouchableOpacity>
            </View>
            <Modal
                visible={showImagePickerModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowImagePickerModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <TouchableOpacity style={styles.modalOption} onPress={handleCamera}>
                            <Text style={styles.modalOptionText}>📷 카메라로 찍기</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalOption} onPress={handleGallery}>
                            <Text style={styles.modalOptionText}>🖼 갤러리에서 불러오기</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.modalCancel}
                            onPress={() => setShowImagePickerModal(false)}
                        >
                            <Text style={styles.modalCancelText}>취소</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <CustomAlert
                visible={alertVisible}
                title={alertTitle}
                message={alertMessage}
                onClose={() => setAlertVisible(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",    
    },
    title: {
        marginTop: 15,
        fontWeight: "bold",
        fontSize: 24,
        textAlign: "center",
        color: "#8285FB",
    },
    content: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
    },
    text: {
        marginTop: 10,
        fontSize: 16,
        color: "#000",

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
    scrollcontainer: {
        paddingVertical: 20,
        alignItems: "center",
        backgroundColor: "#f5f5f5",
    },
    formtext: {
        fontSize: 17,
        width: 320,
        padding: 8,
        fontWeight: 'bold',
        color: 'black',
    },
    input: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 8,
        marginBottom: 12,
        width: 320,
        height: 35,
        alignSelf: "center",
        borderRadius: 12,
        backgroundColor: "#fff",
    },
    exerciseListContainer: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        marginHorizontal: 20,
        padding: 8,
        maxHeight: 100,
        width: 320,
    },
    exerciseItem: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: "#ddd",
    },
    imginput: {
        borderWidth: 1,
        borderColor: "#ccc",
        width: 320,
        height: 250,
        alignSelf: "center",
        borderRadius: 12,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 16,
    },
    button1: {
        width: 160,
        height: 40,
        backgroundColor: "#d9d9d9",
        borderRadius: 12,
        alignSelf: "center",
        padding: 10,
    },
    button2: {
        width: 160,
        height: 40,
        backgroundColor: "#8285FB",
        borderRadius: 12,
        alignSelf: "center",
        padding: 10,
    },
    buttonText1: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 15,
        color: 'black',
    },
    buttonText2: {
        textAlign: "center",
        color: "#fff",
        fontWeight: "bold",
        fontSize: 15,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalBox: {
        width: 280,
        backgroundColor: "#fff",
        borderRadius: 12,
        paddingVertical: 10,
        alignItems: "center",
        elevation: 10,
    },
    modalOption: {
        paddingVertical: 12,
        width: "100%",
        alignItems: "center",
        borderBottomWidth: 0.5,
        borderBottomColor: "#ddd",
    },
    modalOptionText: {
        fontSize: 16,
        color: "black",
    },
    modalCancel: {
        //marginTop: 10,
        paddingVertical: 12,
        width: "100%",
        alignItems: "center",
    },
    modalCancelText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FF5555",
    },
});

export default DietLogFormScreen;
