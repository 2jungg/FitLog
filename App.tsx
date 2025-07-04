/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import {
	StatusBar,
	StyleSheet,
	useColorScheme,
	View,
	Button,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { sendToGemini } from './services/dietlog_api';
import './models/dietlog';

function App() {
	const isDarkMode = useColorScheme() === 'dark';

	const handlePress = async () => {
		try {
			const result = await launchImageLibrary({
				mediaType: 'photo',
				includeBase64: true,
			});

			if (result.didCancel) {
				console.log('User cancelled image picker');
			} else if (result.errorCode) {
				console.log('ImagePicker Error: ', result.errorMessage);
			} else if (result.assets && result.assets.length > 0) {
				const asset = result.assets[0];
				if (asset.base64 && asset.type) {
					const response = await sendToGemini(asset.base64, asset.type);
					console.log('Gemini API Response:', response);
				}
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<View style={styles.container}>
			<Button
				onPress={handlePress}
				title="Button"
				color="#841584"
				accessibilityLabel="Learn more about this purple button"
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});

export default App;
