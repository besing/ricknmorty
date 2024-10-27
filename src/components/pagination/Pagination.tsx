import styled from 'styled-components';
import { Button } from 'react-aria-components';

import type { CharactersListResponse } from '../../types/characters';

const StyledButton = styled(Button)`
	color: ${props => props.theme.textColor};
	background: ${props => props.theme.buttonBackground};
	border: 1px solid ${props => props.theme.borderColor};
	border-radius: 4px;
	appearance: none;
	vertical-align: middle;
	font-size: 1rem;
	text-align: center;
	margin: 0;
	outline: none;
	padding: 6px 10px;
	text-decoration: none;

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

const PaginationContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 1rem;
	margin-top: 1rem;
`;

const PageLabel = styled.span`
	font-size: 1rem;
	color: ${props => props.theme.textColor};
`;

interface PaginationProps {
	data: CharactersListResponse;
	handleUrlChange: (url: string) => void;
}

const Pagination = ({ data, handleUrlChange }: PaginationProps) => {
	const { info } = data;
	const currentPage = data.info.prev ? parseInt(new URL(data.info.prev).searchParams.get('page') || '1') + 1 : 1;

	return (
		<PaginationContainer>
			<StyledButton isDisabled={!info.prev} onPress={() => handleUrlChange(info.prev)}>
				Previous
			</StyledButton>
			<PageLabel>
				Page {currentPage} of {info.pages}
			</PageLabel>
			<StyledButton isDisabled={!info.next} onPress={() => handleUrlChange(info.next)}>
				Next
			</StyledButton>
		</PaginationContainer>
	);
};

export { StyledButton, Pagination };
