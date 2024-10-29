import {
	DialogTrigger,
	Dialog,
	Button,
	Popover,
	ListBox,
	ListBoxItem,
	Select,
	TextField,
	Input,
	Label,
	OverlayArrow,
	SelectValue
} from 'react-aria-components';
import styled, { keyframes } from 'styled-components';
import { StyledButton } from './Button';
import { ReactComponent as OverlayArrowIcon } from '../icons/overlay-arrow-icon.svg';

import type { FilterState } from '../pages/Home';

interface CharactersFilterProps {
	tempFilters: FilterState;
	setTempFilters: React.Dispatch<React.SetStateAction<FilterState>>;
	handleApplyFilters: () => void;
}

const CharactersFilter = ({ tempFilters, setTempFilters, handleApplyFilters }: CharactersFilterProps) => {
	return (
		<DialogTrigger>
			<StyledButton>
				<StyledFilterIcon aria-hidden>🔍</StyledFilterIcon>
				Filters
			</StyledButton>
			<StyledPopover>
				<OverlayArrow>
					<OverlayArrowIcon />
				</OverlayArrow>
				{/* The Dialog component serves as a modal layer in combination with the Popover */}
				<StyledDialog>
					<StyledFilterContent>
						<Title>Filter Characters</Title>
						<TextField>
							<StyledLabel>Name</StyledLabel>
							<StyledInput
								value={tempFilters.name || ''}
								onChange={e =>
									setTempFilters(prev => ({
										...prev,
										name: e.target.value
									}))
								}
							/>
						</TextField>
						<Select
							selectedKey={tempFilters.status}
							defaultSelectedKey="all"
							onSelectionChange={selected =>
								setTempFilters(prev => ({
									...prev,
									status: selected === 'all' ? undefined : (selected as FilterState['status'])
								}))
							}
						>
							<StyledLabel>Status</StyledLabel>
							<StyledSelectButton>
								<SelectValue />
								<span aria-hidden>▾</span>
							</StyledSelectButton>
							<StyledSelectPopover>
								<StyledListBox>
									<StyledListBoxItem id="all">Any</StyledListBoxItem>
									<StyledListBoxItem id="alive">Alive</StyledListBoxItem>
									<StyledListBoxItem id="dead">Dead</StyledListBoxItem>
									<StyledListBoxItem id="unknown">Unknown</StyledListBoxItem>
								</StyledListBox>
							</StyledSelectPopover>
						</Select>
						<StyledButtonGroup>
							<StyledApplyButton onPress={handleApplyFilters}>Apply Filters</StyledApplyButton>
						</StyledButtonGroup>
					</StyledFilterContent>
				</StyledDialog>
			</StyledPopover>
		</DialogTrigger>
	);
};

const slideAnimation = keyframes`
	from {
		transform: var(--origin);
		opacity: 0;
	}

	to {
		transform: translateY(0);
		opacity: 1;
	}
`;

const Title = styled.h3`
	margin: 0;
	margin-bottom: 0.5rem;
	font-size: 1.125rem;
	font-weight: 600;
	color: ${({ theme }) => theme.textColor};
`;

const StyledInput = styled(Input)`
	padding: 0.5rem;
	border: 1px solid ${({ theme }) => theme.borderColor};
	border-radius: 4px;
	font-size: 0.875rem;
	width: 100%;
	box-sizing: border-box;

	&:hover {
		border-color: ${({ theme }) => theme.borderColorHover};
	}

	&:focus {
		outline: none;
		border-color: ${({ theme }) => theme.focusRingColor};
	}
`;

const StyledSelectButton = styled(Button)`
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	padding: 0.5rem;
	border: 1px solid ${({ theme }) => theme.borderColor};
	border-radius: 4px;
	background: white;
	font-size: 0.875rem;
	cursor: pointer;

	&:hover {
		border-color: ${({ theme }) => theme.borderColorHover};
	}
`;

const StyledSelectPopover = styled(Popover)`
	border: 1px solid ${({ theme }) => theme.borderColor};
	border-radius: 4px;
	background: white;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	outline: none;
	min-width: 120px;
`;

const StyledDialog = styled(Dialog)`
	&:focus-visible {
		outline: none;
	}
`;

const StyledListBox = styled(ListBox)`
	padding: 0.25rem;
	outline: none;
`;

const StyledListBoxItem = styled(ListBoxItem)`
	padding: 0.375rem 0.5rem;
	margin: 0.125rem;
	border-radius: 3px;
	cursor: pointer;
	outline: none;
	font-size: 0.8125rem;

	&[data-focused] {
		background: ${({ theme }) => theme.backgroundColor};
	}

	&[data-selected] {
		background: ${({ theme }) => theme.highlightBackground};
		color: ${({ theme }) => theme.highlightForeground};
	}
`;

const StyledPopover = styled(Popover)`
	border: 1px solid ${({ theme }) => theme.borderColor};
	box-shadow: 0 8px 20px rgba(0 0 0 / 0.1);
	border-radius: 6px;
	background: white;
	color: ${({ theme }) => theme.textColor};
	outline: none;

	.react-aria-OverlayArrow svg {
		display: block;
		fill: white;
		stroke: ${({ theme }) => theme.borderColor};
		stroke-width: 1px;
	}

	&[data-placement='top'] {
		--origin: translateY(8px);
		&:has(.react-aria-OverlayArrow) {
			margin-bottom: 6px;
		}
	}

	&[data-entering] {
		animation: ${slideAnimation} 200ms;
	}

	&[data-exiting] {
		animation: ${slideAnimation} 200ms reverse ease-in;
	}
`;

const StyledLabel = styled(Label)`
	display: block;
	margin-bottom: 0.5rem;
	font-size: 0.875rem;
	font-weight: 500;
	color: ${({ theme }) => theme.textColorBase};
`;

const StyledFilterContent = styled.div`
	padding: 1.25rem;
	display: flex;
	flex-direction: column;
	gap: 1.25rem;
	min-width: 280px;
`;

const StyledButtonGroup = styled.div`
	display: flex;
	justify-content: flex-end;
	gap: 0.5rem;
	margin-top: 0.5rem;
`;

const StyledApplyButton = styled(Button)`
	padding: 0.5rem 1rem;
	background: ${({ theme }) => theme.highlightBackground};
	color: ${({ theme }) => theme.highlightForeground};
	border: none;
	border-radius: 4px;
	font-weight: 500;
	cursor: pointer;

	&:hover {
		background: ${({ theme }) => theme.purple400};
	}

	&:active {
		background: ${({ theme }) => theme.purple500};
	}
`;

const StyledFilterIcon = styled.span`
	margin-right: 0.5rem;
`;

export { CharactersFilter };
