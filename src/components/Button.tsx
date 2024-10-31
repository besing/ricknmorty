import styled from 'styled-components';
import { Button } from 'react-aria-components';

const StyledButton = styled(Button)`
	color: ${props => props.theme.textColor};
	background: ${props => props.theme.buttonBackground};
	border: 1px solid ${props => props.theme.borderColor};
	border-radius: 4px;
	height: 2.5rem;
	display: flex;
	align-items: center;
	vertical-align: middle;
	font-size: 1rem;
	text-align: center;
	margin: 0;
	margin-left: auto;
	outline: none;
	padding: 0.5rem 1rem;
	text-decoration: none;
	font-family: inherit;

	&[data-hovered] {
		cursor: pointer;
	}

	&[data-pressed] {
		box-shadow: inset 0 1px 2px rgb(0 0 0 / 0.1);
		background: ${props => props.theme.buttonBackgroundPressed};
		border-color: ${props => props.theme.borderColorPressed};
	}

	&[data-focus-visible] {
		outline: 2px solid ${props => props.theme.focusRingColor};
		outline-offset: -1px;
	}

	&[data-disabled] {
		opacity: 0.5;
		cursor: not-allowed;
	}
`;

export { StyledButton };
