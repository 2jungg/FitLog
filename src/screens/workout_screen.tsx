import React from "react";
import {
    View,
    Text, 
    StyleSheet, 
    FlatList,
    Image,
    TouchableOpacity,
} from 'react-native';
import { Workout, WorkoutCategory} from '../models/workout';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { WorkoutStackParamList } from './workout_stack';



const dummyData: Workout[] = [
    new Workout(
        '1',
        WorkoutCategory.StrengthTraining,
        new Date('2025-07-04T16:00:00'),
        new Date('2025-07-04T18:00:00'),
        300,
        'https://m.health.chosun.com/site/data/img_dir/2024/10/16/2024101602160_0.jpg'
    ),
    new Workout(
        '2',
        WorkoutCategory.Running,
        new Date('2025-07-04T23:30:00'),
        new Date('2025-07-05T1:00:00'),
        300,
        'https://m.health.chosun.com/site/data/img_dir/2024/10/16/2024101602160_0.jpg'
    ),
];

// 운동 시간 출력 (시작시간 ~ 종료시간)
function formatTimeRange(start: Date, end: Date): string {
    const sameDate=
        start.getFullYear() === end.getFullYear() &&
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

    return(
        /* Title */
        <View style={styles.container}>
            <Text style={styles.title}>운동 기록</Text>

            {/* Workout List */}
            <FlatList
                data={dummyData}
                keyExtractor={(item) => item.workoutId}
                renderItem={({item}) => (
                <View style={{paddingHorizontal: 8}}>
                    <TouchableOpacity style={styles.card}>
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
    fabText:{
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    }
})