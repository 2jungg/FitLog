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
    dietLogs: Map<string, DietLog[]>;
    addDietLog(dietLog: DietLog): void;
    isEmpty(): boolean;
}

export class DietLogGroupByDate implements DietLogsGroupByDate {
    dietLogs: Map<string, DietLog[]> = new Map();

    addDietLog(dietLog: DietLog): void {
        const dateKey = dietLog.recordDate.toISOString().split('T')[0];
        if (!this.dietLogs.has(dateKey)) {
            this.dietLogs.set(dateKey, []);
        }
        this.dietLogs.get(dateKey)?.push(dietLog);
    }

    isEmpty(): boolean {
        return this.dietLogs.size === 0;
    }
}
