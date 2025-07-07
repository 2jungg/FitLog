export interface WeightLog {
    day: Date;
    weight: number;     // kg unit
}

interface IProfile {
    username: string;
    height: number;     // cm unit
    weightLogs: Array<WeightLog>;
    myGoal: string;
    addWeightLog(_weightlog: WeightLog): void;
    checkWeightLogExists(_weightlog: WeightLog): boolean;
}

export class Profile implements IProfile {
    constructor (
        public username: string,
        public height: number,
        public weightLogs: Array<WeightLog>,
        public myGoal: string
    ) {}
    
    addWeightLog(_weightlog: WeightLog): void {
        if(!this.checkWeightLogExists(_weightlog)) {
            this.weightLogs.push(_weightlog);
            console.log("성공적으로 몸무게가 기록되었습니다.")
            return;
        }
        console.error("해당 날짜에 몸무게 기록이 이미 존재합니다.");
    }
    
    checkWeightLogExists(_weightlog: WeightLog): boolean {
        for (const wL of this.weightLogs) {
            if (wL.day.getDate() == _weightlog.day.getDate()) {
                return true;
            }
        }
        return false;
    }
}
