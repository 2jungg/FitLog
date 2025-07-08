import React, {useEffect, useState} from "react";
import { 
    View, 
    Text, 
    StyleSheet,
    TouchableOpacity,
    TextInput, 
    Dimensions,
    Alert,
} from "react-native";

import { useData } from "../DataContext";
import { util_icons } from "../../assets/icon/icons";
import { LineChart } from 'react-native-chart-kit';
import { Profile, WeightLog } from "../models/profile";

export default function ProfileScreen(){
    
    const { userData, setUserData } = useData();
    const ProfileBttn = util_icons.profile;   

    {/*몸무게 변화 기록*/}
    const [activeTab, setActiveTab] = useState<'weight' | 'BMI'>('weight');
    const screenWidth = Dimensions.get('window').width;

    //날짜와 몸무게 추출
    const sortedLogs = [...(userData?.weightLogs ?? [])].sort((a, b) => a.day.getTime() - b.day.getTime());
    const labels = sortedLogs.map(log => log.day.toLocaleDateString('ko-KR').slice(5));
    const weights = sortedLogs.map(log => log.weight);
    const bmiValues = sortedLogs.map(log => log.bmi);

    // i) 몸무게 그래프 관련 
    const minWeight = Math.min(...weights);
    const maxWeight = Math.max(...weights);

    // 진짜 데이터
    const realDataset = {
        data: weights,
        color: (opacity = 1) => `rgba(130, 133, 251, ${opacity})`, // 보이는 선
        withDots: true,
    };

    // 가짜 데이터: 범위 확보용
    const paddingDataset = {
    data: [minWeight - 10, maxWeight + 10],
    withDots: false, // 점 표시 X
    color: () => `rgba(0, 0, 0, 0)`, // 선도 안 보이게
    };
    
    // ii) BMI 그래프 관련
    const minBmi = Math.min(...bmiValues);
    const maxBmi = Math.max(...bmiValues);

    const bmiDataset = {
        data: bmiValues,
        color: (opacity = 1) => `rgba(130, 133, 251, ${opacity})`,
    };

    const bmiPaddingDataset = {
        data: [minBmi - 2, maxBmi + 2],
        withDots: false,
        color: () => `rgba(0, 0, 0, 0)`,
    };

    // 최근 신체 데이터 출력
    const [height, setHeight] = useState(userData?.height?.toString() + "cm" || "000cm");
    const [weight, setWeight] = useState("00kg");
    const [bmi, setBmi] = useState('00.0'); 

    // 최신 몸무게로 초기화 
    useEffect(() => {
        if (userData?.weightLogs && userData.weightLogs.length > 0) {
            const sortedLogs = [...userData.weightLogs].sort((a, b) => b.day.getTime() - a.day.getTime());
            const latestWeight = sortedLogs[0].weight;
            setWeight(latestWeight.toString() + "kg");
        }
    }, [userData]);

    // 단위 자동 출력
    const handleHeightChange = (text: string) => {
        const numeric = text.replace(/[^0-9]/g, ''); // 숫자만
        setHeight(numeric + "cm");
    };

    const handleWeightChange = (text: string) => {
        const numeric = text.replace(/[^0-9.]/g, ''); // 소수점 포함 숫자만
        setWeight(numeric + "kg");
    };

    // 키나 몸무게 바뀌면 BMI 자동 계산
    useEffect(() => {
        const numericHeight = parseFloat(height.replace(/[^0-9.]/g, ''));
        const numericWeight = parseFloat(weight.replace(/[^0-9.]/g, ''));
        
        if (numericHeight && numericWeight) {
            const bmiValue = numericWeight / ((numericHeight / 100) ** 2);
            setBmi(bmiValue.toFixed(1));
        }
    }, [height, weight]);

    //신체 데이터 등록 
    const handleRegisterBodyData = () => {
        if (!userData) return;


        const numericHeight = parseInt(height.replace(/[^0-9]/g, ''));
        const numericWeight = parseFloat(weight.replace(/[^0-9.]/g, ''));
        const numericBmi = parseFloat(bmi.replace(/[^0-9.]/g, ''));   

        const today = new Date();
        const newLog: WeightLog = {
            day: today,
            weight: numericWeight,
            bmi: numericBmi
        };        

        // 기존 weight log와 비교하여 중복 여부 판단
        const exists = userData.checkWeightLogExists(newLog);
        const updatedLogs = exists
            ? userData.weightLogs
            : [...userData.weightLogs, newLog];

        const heightChanged = numericHeight !== userData.height;
        const logsChanged = !exists;

        // 하나라도 변경되었을 경우에만 Profile 갱신
        if (heightChanged || logsChanged) {
            const updatedUser = new Profile(
                userData.username,
                numericHeight,
                updatedLogs,
                userData.myGoal
            );

        setUserData(updatedUser);

        if (logsChanged) {
        Alert.alert("등록 완료", "오늘의 신체 데이터가 등록되었습니다.");
        }  else {
        Alert.alert("중복 등록", "이미 오늘 등록한 데이터가 있습니다.");
        }}
      };

    return (
        <View style={styles.container}>
            <View style={styles.row1}>
                <ProfileBttn width={80} height={80}/>
                <View style={styles.profile}>
                    <Text style={styles.name}>{userData?.username ?? "이름 없음"} 님</Text>
                    <Text style={{color: '#575757', fontSize: 10}}>나의 다짐</Text>
                    <Text>{userData?.myGoal}</Text>
                </View>
            </View>
            <View style={styles.row2}>
                <View style={styles.column}>
                    <Text style={styles.index}>키</Text>
                    <TextInput style={styles.buttonInput} onChangeText={handleHeightChange} value={height}></TextInput>
                </View>
                <View style={styles.column}>
                    <Text style={styles.index}>몸무게</Text>
                    <TextInput style={styles.buttonInput} onChangeText={handleWeightChange} value={weight}></TextInput>
                </View>
                <View style={styles.column}>
                    <Text style={styles.index}>BMI</Text>
                    <TextInput style={styles.buttonInput} editable={false} value={bmi}></TextInput>
                </View>                                
            </View>
            <TouchableOpacity style={styles.button} onPress={handleRegisterBodyData}>
                <Text style={styles.buttonText}>신체 데이터 등록</Text>
            </TouchableOpacity>

            {/*몸무게 변화*/}
            <Text style={styles.changeText}>{userData?.username} 님의 건강 그래프</Text>
            
            {/*몸무게 or BMI 버튼*/}
            <View style={{ flexDirection: 'row', marginHorizontal:20}}>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'weight' && styles.activeTab]}
                    onPress={() => setActiveTab('weight')}
                >
                <Text style={activeTab === 'weight' ? styles.activeText : styles.inactiveText}>몸무게</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'BMI' && styles.activeTab]}
                    onPress={() => setActiveTab('BMI')}
                >
                    <Text style={activeTab === 'BMI' ? styles.activeText : styles.inactiveText}>BMI</Text>
                </TouchableOpacity>
            </View>

            {/*i) 몸무게 그래프 그리기*/}
            {activeTab === 'weight' && userData?.weightLogs && (
            <LineChart
                data={{
                    labels: labels,
                    datasets: [realDataset, paddingDataset],
                }}
                width={screenWidth - 30}
                height={220}
                fromZero={false}
                withShadow={false}
                yAxisSuffix="kg"
                yAxisInterval={1}
                segments={5}
                chartConfig={{
                    backgroundColor: '#fff',
                    backgroundGradientFrom: '#fff',
                    backgroundGradientTo: '#fff',
                    decimalPlaces: 1,
                    color: (opacity = 1) => `rgba(130, 133, 251, ${opacity})`,
                    labelColor: () => '#333',
                    propsForDots: {
                    r: '7',
                    strokeWidth: 2,
                    stroke: '#fff',
                    },
                }}
                style={{
                    marginVertical: 8,
                    borderRadius: 16,
                    alignSelf: 'center',
                    backgroundColor: 'transparent',
                }}
                getDotColor={() => '#8285fb'}
                verticalLabelRotation={-15}
                />
            )}
            {/*ii) bmi 그래프 그리기*/}
            {activeTab === 'BMI' && userData?.weightLogs && (
            <LineChart
                data={{
                    labels: labels,
                    datasets: [bmiDataset, bmiPaddingDataset],
                }}
                width={screenWidth - 30}
                height={220}
                fromZero={false}
                withShadow={false}
                yAxisInterval={1}
                segments={5} // y축 선 개수
                chartConfig={{
                    backgroundColor: '#fff',
                    backgroundGradientFrom: '#fff',
                    backgroundGradientTo: '#fff',
                    decimalPlaces: 1,
                    color: (opacity = 1) => `rgba(130, 133, 251, ${opacity})`,
                    labelColor: () => '#333',
                    propsForDots: {
                        r: '5',
                    },
                }}
                style={{
                    marginVertical: 8,
                    borderRadius: 16,
                    alignSelf: 'center',
                    backgroundColor: 'transparent',
                }}
                getDotColor={()=>'#8285fb'}
                verticalLabelRotation={-15}
                />
            )}
        </View>
    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    row1: {
        marginTop: 10,
        flexDirection: 'row',
        marginLeft: 40,
        marginBottom: 10
    },
    row2: {
        flexDirection: 'row',
        justifyContent: 'space-between', 
        marginLeft: 25,
        marginRight: 25,
        marginBottom: 10
    },
    column: {
        flexDirection: 'column',
        alignItems: 'center',
        marginRight: 5
    },
    profile:{
        justifyContent: 'center',
        marginLeft: 30
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10
    },
    button: {
        width: 320,
        height: 40,
        backgroundColor: '#8285FB',
        borderRadius: 12,
        alignSelf: 'center',
        padding: 5,
        justifyContent: 'center'
    },
    buttonText:{
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 15,
    }, 
    buttonInput: {
        backgroundColor: '#f5f5f5',
        height: 40,
        width: 100,
        borderRadius: 10,
        padding: 10,  
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    index: {
        fontSize: 15,
        marginBottom: 7,
    },
    changeText: {
        marginTop: 15,
        marginBottom: 15,
        fontWeight: "bold",
        textAlign: 'center',
        fontSize: 18,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 10,
        backgroundColor: '#eee',
        alignItems: 'center',
        borderRadius: 8,
        marginHorizontal: 5,
    },
    activeTab: {
        backgroundColor: '#cecfff',
    },
    activeText: {
        fontWeight: 'bold',
        color: '#000',
    },
    inactiveText: {
        color: '#aaa',
    },
});