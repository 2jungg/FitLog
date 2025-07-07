import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Profile } from './models/profile';
import { DietLogGroupByDate } from './models/dietlog';
import { Workout } from './models/workout';

interface DataContextType {
    userData: Profile;
    setUserData: (data: Profile) => void;
    dietLogData: DietLogGroupByDate;
    setDietLogData: (data: DietLogGroupByDate) => void;
    workoutData: Workout[];
    setWorkoutData: (data: Workout[]) => void;
}

const DataContext = createContext<DataContextType | null>(null);

export const DataProvider: React.FC<{ children?: ReactNode}> = ({ children }) => {
    const [userData, setUserData] = useState<Profile>(new Profile('이중권님', 180, []));
    const [dietLogData, setDietLogData] = useState<DietLogGroupByDate>(new DietLogGroupByDate());
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
