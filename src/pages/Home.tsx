import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import useSWR from 'swr';
import { FullPageLoadingSpinner } from '../components/LoadingSpinner';
import { Pagination } from '../components/Pagination';
import { CharactersTable } from '../components/CharactersTable';
import { CharactersFilter } from '../components/CharactersFilter';
import Logo from '../components/Logo';

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
	const { page } = useParams();
	const navigate = useNavigate();
	const currentPage = page ? parseInt(page) : 1;

	useEffect(() => {
		setFetchUrl(`${defaultApiUrl}?page=${currentPage}`);
	}, [currentPage]);

	const [fetchUrl, setFetchUrl] = useState(`${defaultApiUrl}?page=${currentPage}`);
	const [tempFilters, setTempFilters] = useState<FilterState>({});
	const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
		column: undefined,
		direction: undefined
	});

	// The API request (will be re-triggered when pagination or filter selection change)
	const { data: characters, error, isLoading } = useSWR<CharactersListResponse>(fetchUrl, fetcher);

	// TODO: Make empty results or errors look nicer (inside table view) + show e.g. filters panel OR back-button
	const handlePageChange = (newUrl: string) => {
		const pageNumber = new URL(newUrl).searchParams.get('page') || '1';
		navigate(pageNumber === '1' ? '/' : `/${pageNumber}`);
		setFetchUrl(newUrl);
	};

	if (error) return <div>Failed to load</div>;
	if (!characters || isLoading) return <FullPageLoadingSpinner />;

	// We have this extra logic here to allow resetting the manual sort order to the default case (by ID asc.)
	const handleSortChange = (e: SortDescriptor) => {
		if (sortDescriptor.direction === 'descending') {
			setSortDescriptor({ column: 'id', direction: 'ascending' });
		} else {
			setSortDescriptor(e);
		}
	};

	const charactersWithLocationName = characters.results.map(character => ({
		...character,
		locationName: character.location.name
	}));

	const sortedCharacters = sortDescriptor.column
		? charactersWithLocationName.sort((a, b) => {
				const isAscending = sortDescriptor.direction === 'ascending';
				const column = sortDescriptor.column as keyof Character; // Type assertion necessary here
				let compare = a[column] < b[column] ? -1 : 1;

				return isAscending ? compare : -compare;
		  })
		: charactersWithLocationName;

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
				<Logo />
				<StyledPageTitle>Rick & Morty's Interdimensional Index</StyledPageTitle>
				<CharactersTable
					sortDescriptor={sortDescriptor}
					handleSortChange={handleSortChange}
					sortedCharacters={sortedCharacters}
				/>

				<StyledTableLowerControls>
					<Pagination data={characters} handleUrlChange={handlePageChange} />
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
	padding: 2rem 0;
`;

const StyledTableWrapper = styled.div`
	width: 800px;
	max-width: 100%;
`;

const StyledTableLowerControls = styled.div`
	display: flex;
	flex-direction: column;
	align-items: stretch;
	gap: 1rem;
	margin-top: 1rem;
	justify-content: space-between;

	@media (min-width: 500px) {
		flex-direction: row;
		align-items: center;
	}
`;

const StyledPageTitle = styled.h1`
	font-size: 2.3rem;
	font-weight: 700;
	text-align: center;
	font-family: 'RubikWetPaint';
	background: linear-gradient(180deg, ${({ theme }) => theme.purple400} 0%, ${({ theme }) => theme.gray600} 80%);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
`;

export default Home;
