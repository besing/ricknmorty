import styled from 'styled-components';
import { Table, TableHeader, Column, Row, Cell, TableBody, SortDescriptor } from 'react-aria-components';
import { useState } from 'react';

import { Character } from '../types/characters';

interface CharactersTableProps {
	sortDescriptor: SortDescriptor;
	handleSortChange: (e: SortDescriptor) => void;
	sortedCharacters: Character[];
}

// TODO: Sort order enable for all columns
const CharactersTable = ({ sortDescriptor, handleSortChange, sortedCharacters }: CharactersTableProps) => {
	const ColumnSortIcon = (
		<span aria-hidden="true" className="sort-indicator">
			{sortDescriptor?.direction === 'ascending' ? '▲' : '▼'}
		</span>
	);

	const [countOfImagesLoaded, setCountOfImagesLoaded] = useState(0);

	return (
		<StyledTableWrapper>
			<StyledTable
				sortDescriptor={sortDescriptor}
				onSortChange={handleSortChange}
				aria-label="Characters from Rick and Morty"
			>
				<StyledTableHeader>
					<StyledColumn isHidden allowsSorting>
						ID
					</StyledColumn>
					<StyledColumn isColumnTitleHidden>Image</StyledColumn>
					<StyledColumn isRowHeader allowsSorting id="name">
						Name
						{ColumnSortIcon}
					</StyledColumn>
					<StyledColumn allowsSorting id="species" className="hide-on-s">
						Species
						{ColumnSortIcon}
					</StyledColumn>
					<StyledColumn className="hide-on-m">Gender</StyledColumn>
					<StyledColumn className="hide-on-m">Alive</StyledColumn>
					<StyledColumn className="hide-on-l">Location</StyledColumn>
				</StyledTableHeader>
				<StyledTableBody>
					{sortedCharacters.map((character: Character) => (
						<StyledRow href={`/character/${character.id}`} key={character.id}>
							<StyledCell isHidden>{character.id}</StyledCell>
							<StyledCell>
								<StyledAvatarWrapper>
									<PlaceholderAvatar />
									<StyledAvatar
										onLoad={() => setCountOfImagesLoaded(prev => prev + 1)}
										src={character.image}
										alt={character.name}
										$isVisible={countOfImagesLoaded >= sortedCharacters.length}
									/>
								</StyledAvatarWrapper>
							</StyledCell>
							<StyledCell>{character.name}</StyledCell>
							<StyledCell className="hide-on-s">{character.species}</StyledCell>
							<StyledCell className="hide-on-m">{character.gender}</StyledCell>
							<StyledCell className="hide-on-m">{character.status}</StyledCell>
							<StyledCell className="hide-on-l">{character.location.name}</StyledCell>
						</StyledRow>
					))}
				</StyledTableBody>
			</StyledTable>
		</StyledTableWrapper>
	);
};

const StyledTableWrapper = styled.div`
	width: 100%;
	border: 1px solid ${props => props.theme.borderColor};
	border-radius: 6px;
	overflow: hidden;
`;

const StyledTable = styled(Table)`
	width: 100%;
	padding: 0.286rem;
	border-radius: 6px; */
	background: ${props => props.theme.overlayBackground};
	outline: none;
	border-spacing: 0;
	min-height: 100px;
	align-self: start;
	word-break: break-word;
	forced-color-adjust: none;
	border-collapse: collapse;

	&[data-focus-visible] {
		outline: 2px solid ${props => props.theme.focusRingColor};
		outline-offset: -1px;
	}

	.hide-on-s {
		display: none;

		@media (min-width: 400px) {
			display: table-cell;
		}
	}

	.hide-on-m {
		display: none;

		@media (min-width: 650px) {
			display: table-cell;
		}
	}

	.hide-on-l {
		display: none;

		@media (min-width: 800px) {
			display: table-cell;
		}
	}
`;

const StyledTableHeader = styled(TableHeader)`
	color: ${props => props.theme.textColor};
	height: 50px;

	&:after {
		content: '';
		display: table-row;
		height: 2px;
	}

	& tr:last-child .react-aria-Column {
		border-bottom: 1px solid ${props => props.theme.borderColor};
		cursor: default;
	}
`;

const StyledColumn = styled(Column)<{ isHidden?: boolean; isColumnTitleHidden?: boolean }>`
	padding: 4px 8px;
	text-align: left;
	outline: none;
	display: ${props => (props.isHidden ? 'none' : 'table-cell')};
	visibility: ${props => (props.isColumnTitleHidden ? 'hidden' : 'visible')};
	&[data-focus-visible] {
		outline: 2px solid ${props => props.theme.focusRingColor};
		outline-offset: -2px;
	}

	.sort-indicator {
		padding: 0 6px;
	}

	&:nth-child(4),
	&:nth-child(5),
	&:nth-child(6) {
		min-width: 100px;
	}

	&:not([data-sort-direction]) .sort-indicator {
		visibility: hidden;
	}

	&[data-hovered] {
		cursor: pointer;
	}
`;

const styledTableCssVars = {
	radiusTop: '6px',
	radiusBottom: '6px',
	radius: '6px 6px 6px 6px'
};

const StyledRow = styled(Row)`
	border-radius: ${styledTableCssVars.radius};
	clip-path: inset(0 round ${styledTableCssVars.radius});
	outline: none;
	cursor: default;
	color: ${props => props.theme.textColor};
	position: relative;
	transform: scale(1);

	&[data-focus-visible] {
		outline: 2px solid ${props => props.theme.focusRingColor};
		outline-offset: -2px;
	}

	&[data-pressed] {
		background: ${props => props.theme.gray100};
	}

	&[data-selected] {
		background: ${props => props.theme.highlightBackground};
		color: ${props => props.theme.highlightForeground};
		--focus-ring-color: ${props => props.theme.highlightForeground};

		&[data-focus-visible],
		.react-aria-Cell[data-focus-visible] {
			outline-offset: -4px;
		}
	}

	&[data-disabled] {
		color: ${props => props.theme.textColorDisabled};
	}

	&[data-href] {
		cursor: pointer;
	}

	&[data-hovered] {
		background: ${props => props.theme.highlightBackground};
		color: ${props => props.theme.highlightForeground};
		cursor: pointer;
	}

	&:not(:last-child) {
		border-bottom: 1px solid ${props => props.theme.tableSeparatorColor};
	}
`;

const StyledCell = styled(Cell)<{ isHidden?: boolean }>`
	position: relative;
	height: 42px;
	padding: 0 8px;
	text-align: left;
	outline: none;
	transform: translateZ(0);
	display: ${props => (props.isHidden ? 'none' : 'table-cell')};

	&[data-focus-visible] {
		outline: 2px solid ${props => props.theme.focusRingColor};
		outline-offset: -2px;
	}
`;

const StyledTableBody = styled(TableBody)`
	&[data-empty] {
		text-align: center;
		font-style: italic;
	}
`;

const StyledAvatarWrapper = styled.div`
	position: absolute;
	top: 0;
	left: 0;
`;

const PlaceholderAvatar = styled.div`
	position: absolute;
	top: 3px;
	left: 16px;
	border-radius: 50%;
	height: 36px;
	width: 36px;
	background: ${props => props.theme.gray100};
`;

const StyledAvatar = styled.img<{ $isVisible: boolean }>`
	position: absolute;
	top: 3px;
	left: 16px;
	height: 36px;
	width: 36px;
	object-fit: cover;
	display: block;
	border-radius: 50%;
	visibility: ${props => (props.$isVisible ? 'visible' : 'hidden')};
`;

export { CharactersTable };
