import { useState } from 'react';
import useSWR from 'swr';
import { FullPageLoadingSpinner } from '../components/loading-spinner/LoadingSpinner';
import { Pagination } from '../components/pagination/Pagination';
import {
	StyledTable,
	StyledTableHeader,
	StyledColumn,
	StyledRow,
	StyledCell,
	StyledTableBody
} from '../components/table/Table';

import type { Character, CharactersListResponse } from '../types/characters';

const fetcher = (url: string) => fetch(url).then(res => res.json());
const defaultFetchUrl = 'https://rickandmortyapi.com/api/character';

const Home = () => {
	const [fetchUrl, setFetchUrl] = useState(defaultFetchUrl);

	const { data, error, isLoading } = useSWR<CharactersListResponse>(fetchUrl, fetcher);

	if (error) return <div>Failed to load</div>;
	if (!data || isLoading) return <FullPageLoadingSpinner />;

	const characters = data.results;

	// TODO: Add prefetching (https://swr.vercel.app/docs/prefetching)
	// TODO: necessary to add React Aria Routing on top? (https://react-spectrum.adobe.com/react-aria/routing.html)

	return (
		<>
			<StyledTable aria-label="Characters from Rick and Morty">
				<StyledTableHeader>
					<StyledColumn>Image</StyledColumn>
					<StyledColumn isRowHeader allowsSorting>
						Name
					</StyledColumn>
					<StyledColumn allowsSorting>Species</StyledColumn>
					<StyledColumn>Origin</StyledColumn>
				</StyledTableHeader>
				<StyledTableBody>
					{characters.map((character: Character) => (
						<StyledRow href={`/character/${character.id}`} key={character.id}>
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
