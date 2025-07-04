enum FoodCategory {
    KOREAN = "한식",
    CHINESE = "중식",
    JAPANESE = "일식",
    WESTERN = "양식",
}

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
    category: FoodCategory;
    foodScore: FoodScore;
    comment: string;
}

class APIResponse implements IResponse {
    constructor (
        public category: FoodCategory,
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

class DietLog implements IDietLog {
    constructor (
        public dietLogId: string,
        public recordDate: Date,
        public foodImgUrl: string,
        public responseData: APIResponse,
    ) {}
}