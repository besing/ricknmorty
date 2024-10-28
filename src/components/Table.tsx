import styled from 'styled-components';
import { Table, TableHeader, Column, Row, Cell, TableBody } from 'react-aria-components';

const StyledTable = styled(Table)`
	padding: 0.286rem;
	border: 1px solid ${props => props.theme.borderColor};
	border-radius: 6px;
	background: ${props => props.theme.overlayBackground};
	outline: none;
	border-spacing: 0;
	min-height: 100px;
	align-self: start;
	max-width: 100%;
	word-break: break-word;
	forced-color-adjust: none;
	border-collapse: collapse;

	&[data-focus-visible] {
		outline: 2px solid ${props => props.theme.focusRingColor};
		outline-offset: -1px;
	}
`;

const StyledTableHeader = styled(TableHeader)`
	color: ${props => props.theme.textColor};

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

const StyledColumn = styled(Column)<{ isHidden?: boolean }>`
	padding: 4px 8px;
	text-align: left;
	outline: none;
	display: ${props => (props.isHidden ? 'none' : 'table-cell')};

	&[data-focus-visible] {
		outline: 2px solid ${props => props.theme.focusRingColor};
		outline-offset: -2px;
	}

	.sort-indicator {
		padding: 0 6px;
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
	padding: 4px 8px;
	text-align: left;
	outline: none;
	transform: translateZ(0);
	display: ${props => (props.isHidden ? 'none' : 'table-cell')};

	&[data-focus-visible] {
		outline: 2px solid ${props => props.theme.focusRingColor};
		outline-offset: -2px;
	}

	&:first-child {
		border-radius: ${styledTableCssVars.radiusTop} 0 0 ${styledTableCssVars.radiusBottom};
	}

	&:last-child {
		border-radius: 0 ${styledTableCssVars.radiusTop} ${styledTableCssVars.radiusBottom} 0;
	}

	img {
		height: 30px;
		width: 30px;
		object-fit: cover;
		display: block;
	}
`;

const StyledTableBody = styled(TableBody)`
	&[data-empty] {
		text-align: center;
		font-style: italic;
	}
`;

export { StyledTable, StyledTableHeader, StyledColumn, StyledRow, StyledCell, StyledTableBody };
