import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    Pressable, 
    ScrollView, 
    Modal
} from 'react-native';

import {
  useNavigation,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { WorkoutStackParamList } from './workout_stack';
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { request, PERMISSIONS, RESULTS } from "react-native-permissions";
import { Platform } from "react-native";
import { useData } from "../DataContext";
import { Workout, WorkoutCategory } from "../models/workout";
import { Profile, WeightLog } from "../models/profile";
import { util_icons } from "../../assets/icon/icons";

import DateTimePickerModal from "react-native-modal-datetime-picker";
import uuid from "react-native-uuid";

export default function WorkoutFormScreen(){
    const navigation = useNavigation<NativeStackNavigationProp<WorkoutStackParamList>>();
    
    const {userData, workoutData, addWorkout}  = useData();

    {/*시간 설정 변수*/}
    const [startTime, setStartTime] = useState(new Date());
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [endTime, setEndTime] = useState(new Date());
    const [showEndPicker, setShowEndPicker] = useState(false);

    const handleConfirmStart = (selectedDate: Date) => {
        setStartTime(selectedDate);
        setShowStartPicker(false);
    }

    const handleConfirmEnd = (selectedDate: Date) => {
        setEndTime(selectedDate);
        setShowEndPicker(false);
    }

    {/*운동 종류 변수*/}
    const [selectedExercise, setSelectedExercise] = useState('');
    const [showExerciseList, setShowExerciseList] = useState(false);

    const exerciseOptions= [
        "근력 운동", "달리기", "필라테스", "구기 종목", "무술", 
        "재활 운동", "맨몸 운동", "크로스핏", "수영", "기타"
    ]

    {/*칼로리 계산을 위한 변수*/}
    const MET_VALUES: Record<string, number> = {
        '근력 운동': 6.0,
        '달리기': 8.0,
        '필라테스': 3.0,
        '구기 종목': 6.5,
        '무술': 10.0,
        '재활 운동': 3.5,
        '맨몸 운동': 5.0,
        '크로스핏': 8.0,
        '수영': 7.0,
    };

    const normalize = (text: string) => {
        return text.replace(/[^\p{L}\p{N}]/gu, '').trim();
    };

    const getWorkoutCategoryFromLabel = (label: string): WorkoutCategory => {
        const entries = Object.entries(WorkoutCategory)
            .filter(([key, value]) => typeof value === 'string') // 중요!!
            .map(([key, value]) => [key, value as string] as [keyof typeof WorkoutCategory, string]);
        
        const normalizedLabel = normalize(label);

        const found = entries.find(([_, value]) => {
            return normalize(value) === normalizedLabel;
        });
        return found ? WorkoutCategory[found[0]] : WorkoutCategory.Other;
    };


    {/*칼로리 계산 변수*/}
    const calculateCalories = (
        start: Date,
        end: Date,
        exercise: string,
        weight: number
    ): number => {
        const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
        const durationHours = durationMinutes / 60;
        const MET = MET_VALUES[normalize(exercise)] ?? 4.0;
        const cal = MET * weight * durationHours;

        console.log("met: ", MET);
        console.log("cal: ", cal);
        return Math.round(cal);
    };

    {/*이미지 저장*/}
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
            // 권한 거부 시 사용자에게 알림
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

    {/*운동 종료 시 가장 가까운 날짜의 몸무게 찾기*/}
    const getNearestWeight = (weightLogs: WeightLog[], targetDate: Date): number | null => {
        if (!weightLogs || weightLogs.length === 0) return null;

        let nearest = weightLogs[0];
        let minDiff = Math.abs(targetDate.getTime() - nearest.day.getTime());

        for (let i = 1; i < weightLogs.length; i++) {
            const diff = Math.abs(targetDate.getTime() - weightLogs[i].day.getTime());
            if (diff < minDiff) {
            nearest = weightLogs[i];
            minDiff = diff;
            }
        }

        return nearest.weight;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>운동 기록 추가</Text>

            <ScrollView contentContainerStyle={styles.scrollcontainer}>
            {/*시작 날짜와 시작 시간*/}
            <Text style={styles.formtext}>시작 시간</Text>
            <Pressable style={styles.input} onPress={() => setShowStartPicker(true)}>
                <Text>
                    {startTime.toLocaleString()}
                </Text>
            </Pressable>
            {showStartPicker && (
                <DateTimePickerModal
                    isVisible={showStartPicker}
                    mode="datetime"
                    date={startTime}
                    onConfirm={handleConfirmStart}
                    onCancel={(() => setShowStartPicker(false))}
                    locale='ko_KR'
                    is24Hour={true}
                />
            )}

            {/*종료 날짜 시간*/}
            <Text style={styles.formtext}>종료 시간</Text>
            <Pressable style={styles.input} onPress={() => setShowEndPicker(true)}>
                <Text>
                    {endTime.toLocaleString()}
                </Text>
            </Pressable>
            {showEndPicker && (
                <DateTimePickerModal
                    isVisible={showEndPicker}
                    mode="datetime"
                    date={endTime}
                    onConfirm={handleConfirmEnd}
                    onCancel={(() => setShowEndPicker(false))}
                    locale='ko_KR'
                    is24Hour={true}
                />
            )}

            {/*운동 종류*/}
            <Text style={styles.formtext}>운동 종류</Text>
            <Pressable style={styles.input} onPress={() => setShowExerciseList(prev => !prev)}>
                <Text>{selectedExercise || "선택 안함"}</Text><Text>▼</Text>
            </Pressable>
            {showExerciseList && (
                <ScrollView style={styles.exerciseListContainer} nestedScrollEnabled={true}>
                    {exerciseOptions.map((item, index) => (
                        <Pressable
                            key={index}
                            style={styles.exerciseItem}
                            onPress={() => {
                                setSelectedExercise(item);
                                setShowExerciseList(false);
                            }}
                        >
                            <Text style={{color: 'black'}}>{item}</Text>
                        </Pressable>
                    ))}
                </ScrollView>
            )}
            
            {/*운동 사진*/}
            <Text style={styles.formtext}>운동 사진</Text>
            <TouchableOpacity style={styles.imginput} onPress={() => setShowImagePickerModal(true)}>
            {imageUrl ? (
                <Image source={{uri: imageUrl}} 
                       style={styles.imginput}/>
            ):(
                <ImgBttn/>
            )}
            </TouchableOpacity>
            </ScrollView>

           
            <View style={styles.row}>
                 {/*닫기 버튼*/}
                <TouchableOpacity style={styles.button1}>
                    <Text style={styles.buttonText1} onPress={() => navigation.navigate('Workout')}>닫기</Text> 
                </TouchableOpacity>
                 {/*완료 버튼*/}
                <TouchableOpacity 
                    style={styles.button2}
                    onPress={() => {
                        const targetWeight = getNearestWeight(userData?.weightLogs || [], startTime) || 65; // 기본값 65

                        const expectedCalory = calculateCalories(new Date(startTime), new Date(endTime), normalize(selectedExercise), targetWeight);
                        const workoutId = "DL_" + uuid.v4() as string;

                        const workoutCategory = getWorkoutCategoryFromLabel(selectedExercise);

                        const newWorkout = new Workout(
                            workoutId,
                            workoutCategory,
                            startTime,
                            endTime,
                            expectedCalory,
                            imageUrl ?? ''
                        );
                        
                        console.log(newWorkout.workoutCategory);

                        // 기존 workoutdata에 추가
                        addWorkout(newWorkout);
                        
                        navigation.navigate('Workout'); 
                    }}>

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
        </View>
        
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: "#f5f5f5",
    },
    title :{
        padding: 15,
        fontWeight: 'bold',
        fontSize: 24,
        textAlign: 'center',
        color: '#8285FB',
    },
    scrollcontainer:{
        paddingVertical: 10,
        alignItems: 'center',
        backgroundColor: '#f5f5f5'
    },
    formtext:{
        fontSize: 17, 
        width: 320,
        padding: 8,
        fontWeight:'bold',
        color: 'black',
    },
    input:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginBottom: 12,
        width: 320,
        height: 35,
        alignSelf: 'center',
        borderRadius: 12,
        backgroundColor: '#fff',
    },
    exerciseListContainer:{
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        marginHorizontal: 20,
        padding: 8,
        maxHeight: 100,
        width: 320,
    },
    exerciseItem:{
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: '#ddd',
    },
    imginput: {
        borderWidth: 1,
        borderColor: '#ccc',
        width: 320  ,
        height: 320,
        alignSelf: 'center',
        borderRadius: 12,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    row:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16
    },
    button1:{
        width: 160,
        height: 40,
        backgroundColor: '#d9d9d9',
        borderRadius: 12,
        alignSelf: 'center',
        padding: 10,
    }, 
    button2:{
        width: 160,
        height: 40,
        backgroundColor: '#8285FB',
        borderRadius: 12,
        alignSelf: 'center',
        padding: 10
    }, 
    buttonText1:{
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 15,
        color: 'black',
    },
    buttonText2:{
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold',
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
})
