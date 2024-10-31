import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { SortDescriptor } from 'react-aria-components';
import styled from 'styled-components';
import useSWR from 'swr';
import { Pagination } from '../components/Pagination';
import { CharactersTable } from '../components/CharactersTable';
import { CharactersFilter } from '../components/CharactersFilter';
import Logo from '../components/Logo';
import { handleApplyFilters, handlePageChange } from '../utils';

import type { Character, CharactersListResponse } from '../types';

export interface FilterState {
	name?: string;
	status?: 'alive' | 'dead' | 'unknown';
}

let tableData: Character[] = [];

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

	const [fetchUrl, setFetchUrl] = useState(`${defaultApiUrl}?page=${currentPage}`);
	const [tempFilters, setTempFilters] = useState<FilterState>({});
	const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
		column: undefined,
		direction: undefined
	});

	const handleFilters = () => {
		handleApplyFilters(tempFilters, currentPage, navigate, setFetchUrl, defaultApiUrl);
	};

	const handleUrl = (newUrl: string) => {
		handlePageChange(newUrl, tempFilters, navigate, setFetchUrl);
	};

	// Initialize from URL params on mount and when URL changes
	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const nameParam = urlParams.get('name');
		const statusParam = urlParams.get('status') as FilterState['status'];
		const pageParam = urlParams.get('page');

		// Update filters state from URL
		setTempFilters({
			name: nameParam || undefined,
			status: statusParam || undefined
		});

		// Construct fetch URL with all parameters
		const params = new URLSearchParams();
		if (nameParam) params.append('name', nameParam);
		if (statusParam) params.append('status', statusParam);
		if (pageParam && pageParam !== '1') params.append('page', pageParam);

		setFetchUrl(`${defaultApiUrl}?${params.toString()}`);
	}, []);

	const {
		data: characters,
		error: apiError,
		isLoading: apiIsLoading
	} = useSWR<CharactersListResponse>(fetchUrl, fetcher);

	// We have this extra logic here to allow resetting the manual sort order to the default case (by ID asc.)
	const handleSortChange = (e: SortDescriptor) => {
		if (sortDescriptor.direction === 'descending') {
			setSortDescriptor({ column: 'id', direction: 'ascending' });
		} else {
			setSortDescriptor(e);
		}
	};

	const charactersWithLocationName = characters
		? characters.results.map(character => ({
				...character,
				locationName: character.location.name
		  }))
		: tableData;

	const sortedCharacters = sortDescriptor.column
		? charactersWithLocationName.sort((a, b) => {
				const isAscending = sortDescriptor.direction === 'ascending';
				const column = sortDescriptor.column as keyof Character; // Type assertion necessary here
				let compare = a[column] < b[column] ? -1 : 1;

				return isAscending ? compare : -compare;
		  })
		: charactersWithLocationName;

	return (
		<StyledPageWrapper>
			<StyledTableWrapper>
				<Logo />
				<StyledPageTitle>Rick & Morty's Interdimensional Index</StyledPageTitle>
				<CharactersTable
					sortDescriptor={sortDescriptor}
					handleSortChange={handleSortChange}
					sortedCharacters={sortedCharacters}
					apiIsLoading={apiIsLoading}
					apiError={apiError}
					hasFiltersApplied={Object.keys(tempFilters).length > 0}
				/>

				<StyledTableLowerControls>
					{characters && <Pagination data={characters} handleUrlChange={handleUrl} />}
					<CharactersFilter
						tempFilters={tempFilters}
						setTempFilters={setTempFilters}
						handleApplyFilters={handleFilters}
					/>
				</StyledTableLowerControls>
			</StyledTableWrapper>
		</StyledPageWrapper>
	);
};

const StyledPageWrapper = styled.div`
	display: flex;
	justify-content: center;
	padding: 2rem 1rem;
`;

const StyledTableWrapper = styled.div`
	width: 900px;
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
	font-size: 1.8rem;
	font-weight: 700;
	text-align: center;
	font-family: 'RubikWetPaint';
	background: linear-gradient(180deg, ${({ theme }) => theme.purple400} 0%, ${({ theme }) => theme.gray600} 80%);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;

	@media (min-width: 500px) {
		font-size: 2.3rem;
	}
`;

export default Home;
