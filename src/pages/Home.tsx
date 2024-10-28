import { useState } from 'react';
import {
	Button,
	Dialog,
	DialogTrigger,
	Input,
	Label,
	ListBox,
	ListBoxItem,
	OverlayArrow,
	Popover,
	Select,
	SelectValue,
	TextField
} from 'react-aria-components';
import styled, { keyframes } from 'styled-components';
import useSWR from 'swr';
import { StyledButton } from '../components/Button';
import { FullPageLoadingSpinner } from '../components/LoadingSpinner';
import { Pagination } from '../components/Pagination';
import { CharactersTable } from '../components/Table';
import { ReactComponent as OverlayArrowIcon } from '../icons/overlay-arrow-icon.svg';

import type { SortDescriptor } from 'react-aria-components';
import type { Character, CharactersListResponse } from '../types/characters';

interface FilterState {
	name?: string;
	status?: 'alive' | 'dead' | 'unknown';
}

const fetcher = async (url: string) => {
	const res = await fetch(url);
	if (!res.ok) throw new Error('Failed to fetch');

	return res.json();
};

const defaultApiUrl = 'https://rickandmortyapi.com/api/character';

const Home = () => {
	const [fetchUrl, setFetchUrl] = useState(defaultApiUrl);
	const [tempFilters, setTempFilters] = useState<FilterState>({});
	const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
		column: undefined,
		direction: undefined
	});

	// The API request (will be re-triggered when pagination or filter selection change)
	const { data, error, isLoading } = useSWR<CharactersListResponse>(fetchUrl, fetcher);

	// TODO: Make empty results or errors look nicer (inside table view) + show e.g. filters panel OR back-button
	if (error) return <div>Failed to load</div>;
	if (!data || isLoading) return <FullPageLoadingSpinner />;

	// We have this extra logic here to allow resetting the manual sort order to the default case (by ID asc.)
	const handleSortChange = (e: SortDescriptor) => {
		if (sortDescriptor.direction === 'descending') {
			setSortDescriptor({ column: 'id', direction: 'ascending' });
		} else {
			setSortDescriptor(e);
		}
	};

	const sortedCharacters = sortDescriptor.column
		? data.results.sort((a, b) => {
				const isAscending = sortDescriptor.direction === 'ascending';
				const column = sortDescriptor.column as keyof Character; // Type assertion necessary here
				let compare = a[column] < b[column] ? -1 : 1;

				return isAscending ? compare : -compare;
		  })
		: data.results;

	// TODO: Add prefetching (https://swr.vercel.app/docs/prefetching)
	// TODO: necessary to add React Aria Routing on top? (https://react-spectrum.adobe.com/react-aria/routing.html)

	const handleApplyFilters = () => {
		const params = new URLSearchParams();
		if (tempFilters.name) params.append('name', tempFilters.name);
		if (tempFilters.status) params.append('status', tempFilters.status);

		setFetchUrl(`${defaultApiUrl}?${params.toString()}`);
	};

	return (
		<StyledPageWrapper>
			<StyledTableWrapper>
				<CharactersTable
					sortDescriptor={sortDescriptor}
					handleSortChange={handleSortChange}
					sortedCharacters={sortedCharacters}
				/>

				<StyledControlsWrapper>
					<Pagination data={data} handleUrlChange={setFetchUrl} />
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
												status:
													selected === 'all' ? undefined : (selected as FilterState['status'])
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
				</StyledControlsWrapper>
			</StyledTableWrapper>
		</StyledPageWrapper>
	);
};

const StyledPageWrapper = styled.div`
	display: flex;
	justify-content: center;
	padding-top: 2rem;
`;

const StyledTableWrapper = styled.div`
	width: 800px;
	max-width: 100%;
`;

const StyledControlsWrapper = styled.div`
	display: flex;
	align-items: center;
	gap: 1rem;
	margin-top: 1rem;
	justify-content: space-between;
`;

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

export default Home;
