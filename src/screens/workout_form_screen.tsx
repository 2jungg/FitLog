import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    Pressable, 
    Platform,
    FlatList, 
    ScrollView
} from 'react-native';

import {
  useNavigation,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { WorkoutStackParamList } from './workout_stack';
import { launchImageLibrary } from "react-native-image-picker";

import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function WorkoutFormScreen(){
    const navigation = useNavigation<NativeStackNavigationProp<WorkoutStackParamList>>();
    
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
        "근력 운동", "달리기", "요가/필라테스", "구기 종목", "무술", 
        "재활 운동", "맨몸 운동", "크로스핏", "수영", "기타"
    ]


    {/*이미지 저장*/}
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const handlePress = async () => {
        try {
            const result = await launchImageLibrary({
                mediaType: "photo",
                includeBase64: true,
            });
            
            if (result.assets && result.assets.length > 0){
                const asset = result.assets[0];
                let imageUrl = "";


                if (asset.base64 && asset.type){
                    imageUrl = `data:${asset.type};base64,${asset.base64}`;
                } else if (asset.uri){
                    imageUrl = asset.uri;
                }
                setImageUrl(imageUrl);
            }

        } catch (error) {
            console.error(error);
        }

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
                            <Text>{item}</Text>
                        </Pressable>
                    ))}
                </ScrollView>
            )}
            
            {/*운동 사진*/}
            <Text style={styles.formtext}>운동 사진</Text>
            <TouchableOpacity style={styles.imageinput} onPress={handlePress}>
            {imageUrl ? (
                <Image source={{uri: imageUrl}} 
                       style={styles.imageinput}/>
            ):(
                <Text style={{fontSize: 50, textAlign: 'center'}}>📷</Text>
            )}
            </TouchableOpacity>


            </ScrollView>

            {/*완료 버튼*/}
            <View style={styles.row}>
                <TouchableOpacity style={styles.button1}>
                    <Text style={styles.buttonText1} onPress={() => navigation.navigate('Workout')}>닫기</Text> 
                </TouchableOpacity>
                <TouchableOpacity style={styles.button2}>
                    <Text style={styles.buttonText2}>완료</Text> 
                </TouchableOpacity>
            </View>
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
        paddingVertical: 20,
        alignItems: 'center',
        backgroundColor: '#f5f5f5'
    },
    formtext:{
        fontSize: 17, 
        width: 320,
        padding: 8,
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
    imageinput: {
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 12,
        width: 320,
        height: 320,
        alignSelf: 'center',
        borderRadius: 12,
        backgroundColor: '#fff',
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
    },
    buttonText2:{
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
    }
})