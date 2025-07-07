import { MMKV } from 'react-native-mmkv';
import { Profile } from '../models/profile';
import { DietLog, DietLogGroupByDate } from '../models/dietlog';
import { Workout } from '../models/workout';

// 1. MMKV 저장소 인스턴스 생성
export const storage = new MMKV();

// 2. 데이터 저장을 위한 키 정의
const PROFILE_KEY = 'profile';
const DIETLOGS_KEY = 'dietlogs';
const WORKOUTS_KEY = 'workouts';

// --- Profile CRUD ---

// Create & Update (Profile은 보통 하나이므로 C와 U를 합칩니다)
export const saveProfile = (profile: Profile) => {
  storage.set(PROFILE_KEY, JSON.stringify(profile));
};

// Read
export const getProfile = (): Profile | null => {
  const profileJson = storage.getString(PROFILE_KEY);
  if (profileJson) {
    // JSON.parse 후 클래스 인스턴스로 다시 만들어주면, 클래스 메서드를 사용할 수 있습니다.
    const plainProfile = JSON.parse(profileJson);
    // Date 객체들이 문자열로 저장되었을 수 있으므로, 다시 Date 객체로 변환해줍니다.
    const weightLogs = plainProfile.weightLogs.map((log: any) => ({
      ...log,
      day: new Date(log.day),
    }));
    return new Profile(plainProfile.username, plainProfile.height, weightLogs);
  }
  return null;
};

// Delete
export const deleteProfile = () => {
  storage.delete(PROFILE_KEY);
};


// --- DietLog CRUD ---

// Read (All) -> DietLogGroupByDate 객체로 변환하여 반환
export const getAllDietLogsAsGroup = (): DietLogGroupByDate => {
  const logsJson = storage.getString(DIETLOGS_KEY);
  const newGroup = new DietLogGroupByDate();
  if (logsJson) {
    const plainLogs: DietLog[] = JSON.parse(logsJson);
    // Date 객체 복원 및 그룹화
    plainLogs.forEach((log: any) => {
      newGroup.addDietLog({ ...log, recordDate: new Date(log.recordDate) });
    });
  }
  return newGroup;
};

// Create/Update/Delete는 전체 로그 배열을 저장하는 방식으로 단순화
export const saveAllDietLogs = (allLogs: DietLog[]) => {
  storage.set(DIETLOGS_KEY, JSON.stringify(allLogs));
};


// --- Workout CRUD ---

// Read (All)
export const getAllWorkouts = (): Workout[] => {
    const workoutsJson = storage.getString(WORKOUTS_KEY);
    if (workoutsJson) {
        const plainWorkouts = JSON.parse(workoutsJson);
        // Date 객체 복원
        return plainWorkouts.map((workout: any) => ({
            ...workout,
            startTime: new Date(workout.startTime),
            endTime: new Date(workout.endTime),
        }));
    }
    return [];
};

// Create
export const addWorkout = (newWorkout: Workout) => {
    const allWorkouts = getAllWorkouts();
    allWorkouts.unshift(newWorkout);
    storage.set(WORKOUTS_KEY, JSON.stringify(allWorkouts));
};

// Update
export const updateWorkout = (updatedWorkout: Workout) => {
    let allWorkouts = getAllWorkouts();
    const workoutIndex = allWorkouts.findIndex(w => w.workoutId === updatedWorkout.workoutId);
    if (workoutIndex !== -1) {
        allWorkouts[workoutIndex] = updatedWorkout;
        storage.set(WORKOUTS_KEY, JSON.stringify(allWorkouts));
    }
};

// Delete
export const deleteWorkout = (workoutId: string) => {
    let allWorkouts = getAllWorkouts();
    const filteredWorkouts = allWorkouts.filter(w => w.workoutId !== workoutId);
    storage.set(WORKOUTS_KEY, JSON.stringify(filteredWorkouts));
};
