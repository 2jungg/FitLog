import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Profile } from './models/profile';
import { DietLog, DietLogGroupByDate } from './models/dietlog';
import { Workout } from './models/workout';
import * as db from './services/db_service';

interface DataContextType {
    userData: Profile | null;
    dietLogData: DietLogGroupByDate;
    workoutData: Workout[];
    loading: boolean;
    updateUserData: (newProfileData: Profile) => void;
    addDietLog: (newDietLog: DietLog) => void;
    deleteDietLog: (dietLogId: string) => void;
    addWorkout: (newWorkout: Workout) => void;
    updateWorkout: (updatedWorkout: Workout) => void;
    deleteWorkout: (workoutId: string) => void;
}

const DataContext = createContext<DataContextType | null>(null);

export const DataProvider: React.FC<{ children?: ReactNode}> = ({ children }) => {
    const [userData, setUserData] = useState<Profile | null>(new Profile('이중권님', 180, [], 'BMI'));
    const [dietLogData, setDietLogData] = useState<DietLogGroupByDate>(new DietLogGroupByDate());
    const [workoutData, setWorkoutData] = useState<Workout[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const profile = await db.getProfile();
            if (!profile) {
                // 프로필이 없으면 기본 프로필 생성 및 저장
                const defaultProfile = new Profile('이중권', 180, [], "BMI 정상으로 가보자!!");
                await db.saveProfile(defaultProfile);
                setUserData(defaultProfile);
            } else {
                setUserData(profile);
            }
            const dietLogs = await db.getAllDietLogsAsGroup();
            setDietLogData(dietLogs);
            const workouts = await db.getAllWorkouts();
            setWorkoutData(workouts);

            setLoading(false);
            console.log(dietLogs.dietLogs); // 디버깅용
        };
        loadData();
    }, []);

    const handleUpdateUserData = async (newProfileData: Profile) => {
        setUserData(newProfileData);
        await db.saveProfile(newProfileData);
    };

    const handleAddDietLog = async (newDietLog: DietLog) => {
        const newData = new DietLogGroupByDate();
        newData.dietLogs = new Map(dietLogData.dietLogs);
        newData.addDietLog(newDietLog);
        
        setDietLogData(newData);
        
        const allLogs: DietLog[] = Array.from(newData.dietLogs.values()).flat();
        await db.saveAllDietLogs(allLogs);
    };

    const handleDeleteDietLog = async (dietLogId: string) => {
        const newDietLogData = new DietLogGroupByDate();
        
        dietLogData.dietLogs.forEach((logs, date) => {
            const filteredLogs = logs.filter(log => log.dietLogId !== dietLogId);
            if (filteredLogs.length > 0) {
                newDietLogData.dietLogs.set(date, filteredLogs);
            }
        });

        setDietLogData(newDietLogData);

        const allLogs: DietLog[] = Array.from(newDietLogData.dietLogs.values()).flat();
        await db.saveAllDietLogs(allLogs);
    };

    const handleAddWorkout = async (newWorkout: Workout) => {
        const newWorkouts = [newWorkout, ...workoutData];
        setWorkoutData(newWorkouts);
        await db.addWorkout(newWorkout); // db_service의 addWorkout은 내부적으로 전체를 다시 저장합니다.
    };

    const handleUpdateWorkout = async (updatedWorkout: Workout) => {
        const newWorkouts = workoutData.map(w => w.workoutId === updatedWorkout.workoutId ? updatedWorkout : w);
        setWorkoutData(newWorkouts);
        await db.updateWorkout(updatedWorkout);
    };

    const handleDeleteWorkout = async (workoutId: string) => {
        const newWorkouts = workoutData.filter(w => w.workoutId !== workoutId);
        setWorkoutData(newWorkouts);
        await db.deleteWorkout(workoutId);
    };

    const value = {
        userData,
        dietLogData,
        workoutData,
        loading,
        updateUserData: handleUpdateUserData,
        addDietLog: handleAddDietLog,
        deleteDietLog: handleDeleteDietLog,
        addWorkout: handleAddWorkout,
        updateWorkout: handleUpdateWorkout,
        deleteWorkout: handleDeleteWorkout,
    };

    if (loading) {
        return null;
    }

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === null) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
