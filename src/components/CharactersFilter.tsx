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
						<h3>Filter Characters</h3>
						<TextField>
							<StyledLabel>Name</StyledLabel>
							<Input
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
							<Button>
								<SelectValue />
								<span aria-hidden>▾</span>
							</Button>
							<Popover>
								<ListBox>
									<ListBoxItem id="all">Any</ListBoxItem>
									<ListBoxItem id="alive">alive</ListBoxItem>
									<ListBoxItem id="dead">dead</ListBoxItem>
									<ListBoxItem id="unknown">unknown</ListBoxItem>
								</ListBox>
							</Popover>
						</Select>
						<StyledButtonGroup>
							<Button onPress={handleApplyFilters}>Apply Filters</Button>
						</StyledButtonGroup>
					</StyledFilterContent>
				</StyledDialog>
			</StyledPopover>
		</DialogTrigger>
	);
};

const StyledDialog = styled(Dialog)`
	&:focus-visible {
		outline: none;
	}
`;

const StyledFilterContent = styled.div`
	padding: 1rem;
	display: flex;
	flex-direction: column;
	gap: 1rem;
	min-width: 250px;

	h3 {
		margin: 0;
		margin-bottom: 0.5rem;
	}
`;

const StyledLabel = styled(Label)`
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
`;

const StyledButtonGroup = styled.div`
	display: flex;
	justify-content: flex-end;
	gap: 0.5rem;
	margin-top: 1rem;
`;

const StyledFilterIcon = styled.span`
	margin-right: 0.5rem;
`;

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

const StyledPopover = styled(Popover)`
	border: 1px solid ${props => props.theme.borderColor};
	box-shadow: 0 8px 20px rgba(0 0 0 / 0.1);
	border-radius: 6px;
	background: ${props => props.theme.overlayBackground};
	color: ${props => props.theme.textColor};
	outline: none;

	.react-aria-OverlayArrow svg {
		display: block;
		fill: ${props => props.theme.overlayBackground};
		stroke: ${props => props.theme.borderColor};
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

export { CharactersFilter };
