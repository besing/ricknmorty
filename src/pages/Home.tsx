import { useState } from 'react';
import styled from 'styled-components';
import useSWR from 'swr';
import { FullPageLoadingSpinner } from '../components/LoadingSpinner';
import { Pagination } from '../components/Pagination';
import { CharactersTable } from '../components/CharactersTable';
import { CharactersFilter } from '../components/CharactersFilter';

import type { SortDescriptor } from 'react-aria-components';
import type { Character, CharactersListResponse } from '../types/characters';

export interface FilterState {
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

				<StyledTableLowerControls>
					<Pagination data={data} handleUrlChange={setFetchUrl} />
					<CharactersFilter
						tempFilters={tempFilters}
						setTempFilters={setTempFilters}
						handleApplyFilters={handleApplyFilters}
					/>
				</StyledTableLowerControls>
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

const StyledTableLowerControls = styled.div`
	display: flex;
	align-items: center;
	gap: 1rem;
	margin-top: 1rem;
	justify-content: space-between;
`;

export default Home;
