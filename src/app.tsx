import { ThemeProvider, createGlobalStyle } from 'styled-components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SingleCharacter from './pages/SingleCharacter';

const colors = {
	backgroundColor: '#f8f8f8',
	gray50: '#ffffff',
	gray100: '#d0d0d0',
	gray200: '#afafaf',
	gray300: '#8f8f8f',
	gray400: '#717171',
	gray500: '#555555',
	gray600: '#393939',
	purple100: '#d5c9fa',
	purple200: '#b8a3f6',
	purple300: '#997cf2',
	purple400: '#7a54ef',
	purple500: '#582ddc',
	purple600: '#3c1e95',
	red100: '#f7c4ba',
	red200: '#f29887',
	red300: '#eb664d',
	red400: '#de2300',
	red500: '#a81b00',
	red600: '#731200'
};

const semanticColors = {
	tableSeparatorColor: colors.gray200,
	borderColor: colors.gray300,
	borderColorHover: colors.gray400,
	borderColorPressed: colors.gray400,
	borderColorDisabled: colors.gray100,
	overlayBackground: colors.gray50,
	focusRingColor: colors.purple400,
	textColor: colors.gray600,
	textColorBase: colors.gray500,
	textColorHover: colors.gray600,
	textColorDisabled: colors.gray200,
	textColorPlaceholder: colors.gray400,
	highlightBackground: colors.purple300,
	highlightForeground: 'white',
	buttonBackground: colors.gray50,
	buttonBackgroundPressed: colors.backgroundColor
};

const theme = {
	...colors,
	...semanticColors
};

const GlobalStyle = createGlobalStyle`
	body {
		font-family: BlinkMacSystemFont, Roboto, 'Open Sans', 'Helvetica Neue', sans-serif;
		font-size: 16px;
		line-height: 1.5;
		background: ${colors.backgroundColor};
	}
`;

const App = () => (
	<ThemeProvider theme={theme}>
		<GlobalStyle />
		<Router>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/:page" element={<Home />} />
				<Route path="/character/:id" element={<SingleCharacter />} />
			</Routes>
		</Router>
	</ThemeProvider>
);

export default App;
