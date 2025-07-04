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

interface IDietLog {
    dietLogId: string;      // use UUID
    recordDate: Date;
    category: FoodCategory;
    foodImgUrl: string;
    foodScore: FoodScore;
}

class DietLog implements IDietLog {
    constructor (
        public dietLogId: string,
        public recordDate: Date,
        public category: FoodCategory,
        public foodImgUrl: string,
        public foodScore: FoodScore,
    ) {}
}