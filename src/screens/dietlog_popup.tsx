import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const DietLogPopup = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>다이어트 로그 팝업입니다!</Text>
            <TouchableOpacity onPress={() => console.log('Button Pressed')}>
                <Text style={styles.text}>버튼</Text>
            </TouchableOpacity>
            <Text style={styles.text}>다이어트 로그 팝업 내용이 여기에 표시됩니다.</Text>
            <Text style={styles.text}>추가적인 정보나 기능을 여기에 추가할 수 있습니다.</Text>
            <Text style={styles.text}>예: 음식 사진 업로드, 칼로리 계산 등</Text>
            <Text style={styles.text}>팝업을 닫으려면 화면을 터치하세요.</Text>
            <Text style={styles.text}>또는 뒤로 가기 버튼을 눌러주세요.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    text: {
        fontSize: 18,
        color: '#333',
    },
});