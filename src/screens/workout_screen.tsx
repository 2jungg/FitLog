import React, { useState } from "react";
import {
    View,
    Text, 
    StyleSheet, 
    FlatList,
    Image,
    TouchableOpacity,
    Modal,
} from 'react-native';
import { Workout, WorkoutCategory} from '../models/workout';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { WorkoutStackParamList } from './workout_stack';
import { useData } from "../DataContext";



// 운동 시간 출력 (시작시간 ~ 종료시간)
function formatTimeRange(start: Date, end: Date): string {
    const sameDate=
        start.getMonth() === end.getMonth() &&
        start.getDate() === end.getDate(); 
    
    const startStr = `${formatDateWithDay(start)} ${formatTime(start)}`;
    const endStr = sameDate
        ? formatTime(end)
        : `${formatDateWithDay(end)} ${formatTime(end)}`;

    return `${startStr} ~ ${endStr}`;
}

// time -> 요일 변환 
function formatDateWithDay(date: Date): string {
    const dayNames= ['일','월','화','수','목','금','토'];
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = dayNames[date.getDay()];

    return `${month}/${day} (${dayOfWeek})`;
}

// 시간 출력 
function formatTime(date: Date): string{
    return date.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
}

export default function WorkoutScreen(){
    const navigation = useNavigation<NativeStackNavigationProp<WorkoutStackParamList>>();
    
    const { workoutData } = useData(); 

    {/*상세 운동 내용 팝업*/}
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

    const openModal = (workout: Workout) => {
        setSelectedWorkout(workout);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedWorkout(null);
    };

    return(
        /* Title */
        <View style={styles.container}>
            <Text style={styles.title}>운동 기록</Text>

            {/* Workout List */}
            <FlatList
                data={workoutData}
                keyExtractor={(item) => item.workoutId}
                renderItem={({item}) => (
                <View style={{paddingHorizontal: 8}}>
                    <TouchableOpacity style={styles.card} onPress={() => openModal(item)}>
                        <View style={styles.row}>
                            <View style={{flex: 1}}>
                                <Text style={styles.time}>{formatTimeRange(item.startTime,item.endTime)}</Text>
                                <Text style={{fontSize: 15}}>
                                    {item.workoutCategory} / 소모한 칼로리: <Text style={{fontWeight: 'bold'}}>{item.expectedCalory}kcal</Text></Text>
                            </View>
                            <Image source={{uri:item.workoutImgUrl}} style={styles.image}/>
                        </View>
                    </TouchableOpacity>
                </View>
                )}
            />

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={closeModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {selectedWorkout && (
                            <>
                                <TouchableOpacity onPress={closeModal} style={styles.modalCloseBtn}>
                                    <Text style={styles.modalCloseText}>×</Text>
                                </TouchableOpacity>
                                <Text style={styles.modalTitle}>운동 상세 정보</Text>
                                {selectedWorkout.workoutImgUrl && (
                                    <Image source={{ uri: selectedWorkout.workoutImgUrl }} style={styles.modalImage} />
                                )}
                                
                                <Text>운동 종류: {selectedWorkout.workoutCategory}</Text>
                                <Text>운동 시간: {formatTimeRange(selectedWorkout.startTime, selectedWorkout.endTime)}</Text>
                                <View style={[styles.row, {padding:20}]}>
                                    <Text style={{fontSize: 20, }}>소모한 칼로리: </Text><Text style={{fontWeight: 'bold', fontSize: 20}}>{selectedWorkout.expectedCalory}kcal</Text>
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
            {/*Floating button */}
            <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('WorkoutForm')}>
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
        </View>
    );
}


const styles= StyleSheet.create({
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
    card:{
        backgroundColor:'#fff',
        padding: 15,
        borderRadius: 12,
        marginVertical: 8,
        elevation: 10,
        width: 320,
        height: 70,
    },
    time:{
        fontSize: 12,
        padding: 3,
    },
    row:{
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    image:{
        width: 45,
        height: 45,
        borderRadius: 24,
        marginLeft: 8,
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
    fabText:{
        color: '#fff',
        fontSize: 35,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalImage: {
        width: 200,
        height: 200,
        marginVertical: 10,
        borderRadius: 10,
    },
    modalCloseBtn: {
        position: 'absolute',
        top: 10,
        right: 20,
        zIndex: 1,
    },
    modalCloseText: {
        fontSize: 25
    }
});