import { GoogleGenerativeAI } from '@google/generative-ai';
import Config from 'react-native-config';
import '../models/dietlog';

const apiKey = Config.GEMINI_API_KEY;
if (!apiKey) {
	throw new Error('GEMINI_API_KEY가 .env 파일에 설정되지 않았습니다.');
}
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
const promptText = `Analyze the provided image, which contains a food item.
Based on the image, extract the following information and return it in a JSON format.

{
  "foodName": "string",
  "foodScore": {
    "totScore": "number",
    "protein": "number",
    "fat": "number",
    "carbo": "number",
    "dietaryFiber": "number",
    "vitMin": "number",
    "sodium": "number"
  },
  "comment": "string",
}

Here are the specific requirements for each field:

1.  **foodName**:
    * Determine the most appropriate food name. *
    * The name should be Korean. *

2.  **totScore**:
    * An overall health score for the food, ranging from 0 to 100.
    * This score should reflect the general nutritional balance and healthiness of the meal depicted.

3.  **foodScore**:
    * This object contains detailed nutritional scores.
    * All scores within 'foodScore' (protein, fat, carbo, dietaryFiber, vitMin, sodium) must be numbers.
    * The range for each of these detailed scores is **1 to 5**, with increments of **1**.
        * Higher scores indicate better nutritional value.
        * vitMin means vitamin and mineral.

4.	**comment**:
	* Leave some comment about the food and evaluate in one or two sentence with cute emoticons. *
	* All your comment or should be **Korean** *
Ensure the response is **only** a valid JSON object, without any additional text or markdown outside the JSON structure.
`;

export const sendToGemini = async (
	base64Image: string,
	mimeType: string,
): Promise<APIResponse> => {
	if (!base64Image || !promptText) {
		throw new Error('이미지와 프롬프트를 모두 제공해야 합니다.');
	}

	try {
		const imagePart = {
			inlineData: {
				data: base64Image,
				mimeType: mimeType,
			},
		};

		console.log('Gemini API로 콘텐츠 전송 중...');
		const result = await model.generateContent([promptText, imagePart]);

		const response = result.response;
		const text = response.text();
		const responseData: APIResponse = JSON.parse(text);

		return responseData;
	} catch (error) {
		console.error('Gemini API 호출 오류:', error);
		throw new Error(
			'Gemini API 호출 중 문제가 발생했습니다: ' + (error as Error).message,
		);
	}
};
