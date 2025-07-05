import React from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
} from 'react-native';

import {
  useNavigation,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { WorkoutStackParamList } from './workout_stack';


export default function WorkoutFormScreen(){
    //const navigation = useNavigation<NativeStackNavigationProp<WorkoutStackParamList>>();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>운동 기록 추가</Text>
            <Text style={styles.formtext}>시작 시간</Text>
            <TextInput style={styles.input}/>
            <Text style={styles.formtext}>종료 시간</Text>
            <TextInput style={styles.input}/>
            <Text style={styles.formtext}>운동 종류</Text>
            <TextInput style={styles.input}/>
            <Text style={styles.formtext}>운동 사진</Text>
            <TextInput style={styles.input}/>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>완료</Text> 
            </TouchableOpacity>
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
    formtext:{
        fontSize: 17, 
        width: 320,
        marginLeft: 18,
        padding: 8,
    },
    input:{
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
    button:{
        width: 320,
        height: 40,
        backgroundColor: '#8285FB',
        borderRadius: 12,
        alignSelf: 'center',
        padding: 10
    }, 
    buttonText:{
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
    }
})