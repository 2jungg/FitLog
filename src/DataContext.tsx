import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Profile, WeightLog } from './models/profile';
import { DietLogGroupByDate } from './models/dietlog';
import { Workout, WorkoutCategory } from './models/workout';

interface DataContextType {
    userData: Profile;
    setUserData: (data: Profile) => void;
    dietLogData: DietLogGroupByDate;
    setDietLogData: (data: DietLogGroupByDate) => void;
    workoutData: Workout[];
    setWorkoutData: (data: Workout[]) => void;
}

const dummyWorkoutData: Workout[] = [
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

const initialWeightLogs: WeightLog[] = [
  { day: new Date('2024-07-01'), weight: 70 },
  { day: new Date('2024-07-07'), weight: 72 }
];

const DataContext = createContext<DataContextType | null>(null);

export const DataProvider: React.FC<{ children?: ReactNode}> = ({ children }) => {
    const [userData, setUserData] = useState<Profile>(new Profile('이중권님', 180, initialWeightLogs));
    const [dietLogData, setDietLogData] = useState<DietLogGroupByDate>(new DietLogGroupByDate());
    const [workoutData, setWorkoutData] = useState<Workout[]>(dummyWorkoutData);

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
