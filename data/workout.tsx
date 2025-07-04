enum WorkoutCategory {
    StrengthTraining = "근력 운동",
    Running = "달리기",
    Yoga_Pila = "요가/필라테스",
    Sports = "구기 종목",
    MartialArts = "무술",
    Rehabilitation = "재활 운동",
    Bodyweight = "맨몸 운동",
    CrossFit = "크로스핏",
    Swimming = "수영",
    Other = "기타"
}

interface workout {
    workoutId: string;      // use UUID
    recordDate: Date;
    workoutCategory: WorkoutCategory;
    startTime: Date;
    endTime: Date;
    expectedCalory: number;
}