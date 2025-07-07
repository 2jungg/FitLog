interface FoodScore {
    // max score: 100
    totScore: number;

    // score range: 1-5
    protein: number;
    fat: number;
    carbo: number;
    dietaryFiber: number;
    vitMin: number;
    sodium: number;
}

interface IResponse {
    foodName: string;
    foodScore: FoodScore;
    comment: string;
}

export class APIResponse implements IResponse {
    constructor (
        public foodName: string,
        public foodScore: FoodScore,
        public comment: string,
    ) {}
}

interface IDietLog {
    dietLogId: string;      // use UUID
    recordDate: Date;
    foodImgUrl: string;
    responseData: APIResponse;
}

export class DietLog implements IDietLog {
    constructor (
        public dietLogId: string,
        public recordDate: Date,
        public foodImgUrl: string,
        public responseData: APIResponse,
    ) {}
}

interface DietLogsGroupByDate {
    dietLogs: Map<Date, DietLog[]>;
    addDietLog(dietLog: DietLog): void;
}

export class DietLogGroupByDate implements DietLogsGroupByDate {
    dietLogs: Map<Date, DietLog[]> = new Map();

    addDietLog(dietLog: DietLog): void {
        const dateKey = dietLog.recordDate
        if (!this.dietLogs.has(dateKey)) {
            this.dietLogs.set(dateKey, []);
        }
        this.dietLogs.get(dateKey)?.push(dietLog);
    }
}