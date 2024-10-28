import { useState } from 'react';
import useSWR from 'swr';
import { FullPageLoadingSpinner } from '../components/LoadingSpinner';
import { Pagination } from '../components/Pagination';
import {
	StyledTable,
	StyledTableHeader,
	StyledColumn,
	StyledRow,
	StyledCell,
	StyledTableBody
} from '../components/Table';

import type { SortDescriptor } from 'react-aria-components';
import type { Character, CharactersListResponse } from '../types/characters';

const fetcher = (url: string) => fetch(url).then(res => res.json());
const defaultFetchUrl = 'https://rickandmortyapi.com/api/character';

const Home = () => {
	const [fetchUrl, setFetchUrl] = useState(defaultFetchUrl);
	const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
		column: undefined,
		direction: undefined
	});

	const { data, error, isLoading } = useSWR<CharactersListResponse>(fetchUrl, fetcher);

	if (error) return <div>Failed to load</div>;
	if (!data || isLoading) return <FullPageLoadingSpinner />;

	const characters = data.results;

	const sortIcon = (
		<span aria-hidden="true" className="sort-indicator">
			{sortDescriptor?.direction === 'ascending' ? '▲' : '▼'}
		</span>
	);

	// We have this extra logic here to allow resetting the manual sort order to the default case (by ID asc.)
	const handleSortChange = (e: SortDescriptor) => {
		if (sortDescriptor.direction === 'descending') {
			setSortDescriptor({ column: 'id', direction: 'ascending' });
		} else {
			setSortDescriptor(e);
		}
	};

	const sortedCharacters = sortDescriptor.column
		? characters.sort((a, b) => {
				const isAscending = sortDescriptor.direction === 'ascending';
				// // Type assertion necessary here
				const column = sortDescriptor.column as keyof Character;
				let compare = a[column] < b[column] ? -1 : 1;

				return isAscending ? compare : -compare;
		  })
		: characters;

	// TODO: Add prefetching (https://swr.vercel.app/docs/prefetching)
	// TODO: necessary to add React Aria Routing on top? (https://react-spectrum.adobe.com/react-aria/routing.html)

	return (
		<>
			<StyledTable
				sortDescriptor={sortDescriptor}
				onSortChange={handleSortChange}
				aria-label="Characters from Rick and Morty"
			>
				<StyledTableHeader>
					<StyledColumn isHidden allowsSorting>
						ID
					</StyledColumn>
					<StyledColumn>Image</StyledColumn>
					<StyledColumn isRowHeader allowsSorting id="name">
						Name
						{sortIcon}
					</StyledColumn>
					<StyledColumn allowsSorting id="species">
						Species
						{sortIcon}
					</StyledColumn>
					<StyledColumn>Origin</StyledColumn>
				</StyledTableHeader>
				<StyledTableBody>
					{sortedCharacters.map((character: Character) => (
						<StyledRow href={`/character/${character.id}`} key={character.id}>
							<StyledCell isHidden>{character.id}</StyledCell>
							<StyledCell>
								<img src={character.image} alt={character.name} />
							</StyledCell>
							<StyledCell>{character.name}</StyledCell>
							<StyledCell>{character.species}</StyledCell>
							<StyledCell>{character.origin.name}</StyledCell>
						</StyledRow>
					))}
				</StyledTableBody>
			</StyledTable>
			<Pagination data={data} handleUrlChange={setFetchUrl} />
		</>
	);
};

export default Home;
