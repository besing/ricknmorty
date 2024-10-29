import styled from 'styled-components';
import { StyledButton } from './Button';

import type { CharactersListResponse } from '../types/characters';

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

const PaginationContainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 1rem;
`;

const PageLabel = styled.span`
	font-size: 1rem;
	color: ${props => props.theme.textColor};
`;

export { Pagination };
