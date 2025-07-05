import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Profile } from './models/profile';
import { DietLog } from './models/dietlog';
import { Workout } from './models/workout';

interface DataContextType {
    userData: Profile | null;
    setUserData: (data: Profile | null) => void;
    dietLogData: DietLog[];
    setDietLogData: (data: DietLog[]) => void;
    workoutData: Workout[];
    setWorkoutData: (data: Workout[]) => void;
}

const DataContext = createContext<DataContextType | null>(null);

export const DataProvider: React.FC<{ children?: ReactNode}> = ({ children }) => {
    const [userData, setUserData] = useState<Profile | null>(null);
    const [dietLogData, setDietLogData] = useState<DietLog[]>([]);
    const [workoutData, setWorkoutData] = useState<Workout[]>([]);

    return (
        <DataContext.Provider value={{ userData, setUserData, dietLogData, setDietLogData, workoutData, setWorkoutData }}>
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
