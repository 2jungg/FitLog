import React, {useEffect, useState} from "react";
import { 
    View, 
    Text, 
    StyleSheet,
    TouchableOpacity,
    TextInput, 
    Dimensions,
    Alert,
    Image,
} from "react-native";

import { useData } from "../DataContext";
import { util_icons } from "../../assets/icon/icons";
import { LineChart } from 'react-native-chart-kit';
import { Profile, WeightLog } from "../models/profile";
import ProfileModal from "./profile_modal";

interface MarkerData {
    x: number;
    y: number;
    value: number;
    visible: boolean;
    index: number;
}

export default function ProfileScreen(){
    
    const { userData, updateUserData } = useData();
    const ProfileBttn = util_icons.profile;
    const [isModalVisible, setModalVisible] = useState(false);
    const [marker, setMarker] = useState<MarkerData>({ x: 0, y: 0, value: 0, visible: false, index: -1 });

    {/*몸무게 변화 기록*/}
    const [activeTab, setActiveTab] = useState<'weight' | 'BMI'>('weight');
    const screenWidth = Dimensions.get('window').width;

    //날짜와 몸무게 추출
    const sortedLogs = [...(userData?.weightLogs ?? [])].sort((a, b) => a.day.getTime() - b.day.getTime());

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

        const today = new Date();
        const newLog: WeightLog = {
            day: today,
            weight: numericWeight,
            bmi: parseFloat(bmi.replace(/[^0-9.]/g, ''))
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
                userData.myGoal,
                userData.profileImage
            );

        updateUserData(updatedUser);

        if (logsChanged) {
        Alert.alert("등록 완료", "오늘의 신체 데이터가 등록되었습니다.");
        }  else {
        Alert.alert("중복 등록", "이미 오늘 등록한 데이터가 있습니다.");
        }}
      };
    
    const handleSaveProfile = (newUsername: string, newMyGoal: string, newProfileImage: string) => {
        if (!userData) return;
        const updatedUser = new Profile(
            newUsername,
            userData.height,
            userData.weightLogs,
            newMyGoal,
            newProfileImage
        );
        updateUserData(updatedUser);
        setModalVisible(false);
    };

    const profileImages: { [key: string]: any } = {
        '../../assets/profile_img/img_1.webp': require('../../assets/profile_img/img_1.webp'),
        '../../assets/profile_img/img_2.webp': require('../../assets/profile_img/img_2.webp'),
        '../../assets/profile_img/img_3.webp': require('../../assets/profile_img/img_3.webp'),
        '../../assets/profile_img/img_4.webp': require('../../assets/profile_img/img_4.webp'),
        '../../assets/profile_img/img_5.webp': require('../../assets/profile_img/img_5.webp'),
        '../../assets/profile_img/img_6.webp': require('../../assets/profile_img/img_6.webp'),
        '../../assets/profile_img/img_7.webp': require('../../assets/profile_img/img_7.webp'),
        '../../assets/profile_img/img_8.webp': require('../../assets/profile_img/img_8.webp'),
        '../../assets/profile_img/img_9.webp': require('../../assets/profile_img/img_9.webp'),
        
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
                <View style={styles.row1}>
                    {userData?.profileImage ? (
                        <Image source={profileImages[userData.profileImage]} style={styles.profileImage} />
                    ) : (
                        <ProfileBttn width={80} height={100}/>
                    )}
                    <View style={styles.profile}>
                        <Text style={styles.name}>{userData?.username ?? "이름 없음"} 님</Text>
                        <Text style={{color: '#575757', fontSize: 10}}>나의 다짐</Text>
                        <Text style={{color: 'black'}}>{userData?.myGoal}</Text>
                    </View>
                </View>
            </TouchableOpacity>
            <ProfileModal
                visible={isModalVisible}
                onClose={() => setModalVisible(false)}
                onSave={handleSaveProfile}
                initialUsername={userData?.username ?? ""}
                initialMyGoal={userData?.myGoal ?? ""}
                initialProfileImage={userData?.profileImage}
                modalHeight={650}
            />
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
            
            {/*리스트/그래프 버튼*/}
            <View style={{ flexDirection: 'row', marginHorizontal:20}}>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'weight' && styles.activeTab]}
                    onPress={() => {
                        setMarker(prev => ({ ...prev, visible: false, index: -1 }));
                        setActiveTab('weight');
                    }}
                >
                <Text style={activeTab === 'weight' ? styles.activeText : styles.inactiveText}>몸무게</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'BMI' && styles.activeTab2]}
                    onPress={() => {
                        setMarker(prev => ({ ...prev, visible: false, index: -1 }));
                        setActiveTab('BMI');
                    }}
                >
                    <Text style={activeTab === 'BMI' ? styles.activeText : styles.inactiveText}>BMI</Text>
                </TouchableOpacity>
            </View>
            {/*그래프 그리기*/}
            {(!userData?.weightLogs || userData.weightLogs.length === 0) ? (
                <View style={styles.noDataContainer}>
                    <Text style={styles.noDataText}>
                        {activeTab === 'weight' ? '기록된 몸무게 데이터가 없습니다.' : '기록된 BMI 데이터가 없습니다.'}
                    </Text>
                </View>
            ) : (
                <View style={{ alignItems: 'center' }}>
                    {activeTab === 'weight' && (() => {
                        const labels = sortedLogs.map(log => log.day.toLocaleDateString('ko-KR').slice(5));
                        const weights = sortedLogs.map(log => log.weight);
                        const minWeight = Math.min(...weights);
                        const maxWeight = Math.max(...weights);
                        const realDataset = {
                            data: weights,
                            color: (opacity = 1) => `rgba(130, 133, 251, ${opacity})`,
                        };
                        const paddingDataset = {
                            data: [minWeight - (maxWeight - minWeight) * 0.2, maxWeight + (maxWeight - minWeight) * 0.2],
                            withDots: false,
                            color: () => `rgba(0, 0, 0, 0)`,
                        };
                        return (
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
                                    propsForDots: { r: '5' },
                                }}
                                style={{ marginVertical: 8, borderRadius: 16, alignSelf: 'center' }}
                                getDotColor={() => '#8285fb'}
                                verticalLabelRotation={-15}
                                onDataPointClick={({ value, x, y, index, dataset }) => {
                                    if (dataset.withDots === false) {
                                        setMarker(prev => ({ ...prev, visible: false, index: -1 }));
                                        return;
                                    }
                                    setMarker(prev => {
                                        if (prev.visible && prev.index === index) {
                                            return { ...prev, visible: false, index: -1 };
                                        }
                                        return { x, y, value, visible: true, index };
                                    });
                                }}
                            />
                        );
                    })()}
                    {activeTab === 'BMI' && (() => {
                        const labels = sortedLogs.map(log => log.day.toLocaleDateString('ko-KR').slice(5));
                        const bmiValues = sortedLogs.map(log => log.bmi);
                        const minBmi = Math.min(...bmiValues);
                        const maxBmi = Math.max(...bmiValues);
                        const realDatasetForBMI = {
                            data: bmiValues,
                            color: (opacity = 1) => `rgba(251, 133, 130, ${opacity})`,
                        };
                        const paddingDatasetForBMI = {
                            data: [minBmi - 0.2, maxBmi + 0.2],
                            withDots: false,
                            color: () => `rgba(0, 0, 0, 0)`,
                        };
                        return (
                            <LineChart
                                data={{
                                    labels: labels,
                                    datasets: [realDatasetForBMI, paddingDatasetForBMI],
                                }}
                                width={screenWidth - 30}
                                height={220}
                                fromZero={false}
                                withShadow={false}
                                yAxisSuffix=""
                                yAxisInterval={1}
                                segments={5}
                                chartConfig={{
                                    backgroundColor: '#fff',
                                    backgroundGradientFrom: '#fff',
                                    backgroundGradientTo: '#fff',
                                    decimalPlaces: 1,
                                    color: (opacity = 1) => `rgba(251, 133, 130, ${opacity})`,
                                    labelColor: () => '#333',
                                    propsForDots: { r: '5' },
                                }}
                                style={{ marginVertical: 8, borderRadius: 16, alignSelf: 'center' }}
                                getDotColor={() => '#fb8582'}
                                verticalLabelRotation={-15}
                                onDataPointClick={({ value, x, y, index, dataset }) => {
                                    if (dataset.withDots === false) {
                                        setMarker(prev => ({ ...prev, visible: false, index: -1 }));
                                        return;
                                    }
                                    setMarker(prev => {
                                        if (prev.visible && prev.index === index) {
                                            return { ...prev, visible: false, index: -1 };
                                        }
                                        return { x, y, value, visible: true, index };
                                    });
                                }}
                            />
                        );
                    })()}
                    {marker.visible && (
                        <View style={[styles.marker, { left: marker.x - 25, top: marker.y - 40 }]}>
                            <Text style={styles.markerText}>
                                {activeTab === 'weight' ? `${marker.value.toFixed(1)}kg` : marker.value.toFixed(1)}
                            </Text>
                        </View>
                    )}
                </View>
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
        marginTop: 15,
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
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'black',
    },
    button: {
        width: 310,
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
        color: 'black',
    },
    index: {
        fontSize: 15,
        marginBottom: 7,
        color: 'black',
    },
    changeText: {
        marginTop: 15,
        marginBottom: 15,
        fontWeight: "bold",
        textAlign: 'center',
        fontSize: 18,
        color: 'black',
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
    activeTab2: {
        backgroundColor: '#ffdfd9',
    },
    activeText: {
        fontWeight: 'bold',
        color: '#000',
    },
    inactiveText: {
        color: '#aaa',
    },
    noDataContainer: {
        height: 220,
        alignItems: 'center',
        justifyContent: 'center',
    },
    noDataText: {
        color: '#aaa',
        fontSize: 16,
    },
    marker: {
        position: 'absolute',
        backgroundColor: 'black',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        elevation: 5,
    },
    markerText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
