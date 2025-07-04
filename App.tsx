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
import './services/dietlog_api';
import { sendToGemini } from './services/dietlog_api';
import './models/dietlog';

function App() {
	const isDarkMode = useColorScheme() === 'dark';

	return (
		<View style={styles.container}>
			<Button
				onPress={() => {
					console.log("button clicked!");
				}}
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
