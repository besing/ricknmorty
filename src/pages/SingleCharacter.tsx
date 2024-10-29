import { useParams, Link, useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import styled from 'styled-components';
import { FullPageLoadingSpinner } from '../components/LoadingSpinner';
import Pill from '../components/Pill';

import type { Character } from '../types/characters';

const fetcher = (url: string) => fetch(url).then(res => res.json());
const apiBaseUrl = 'https://rickandmortyapi.com/api/character';

const SingleCharacter = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { data: character, error, isLoading } = useSWR<Character>(`${apiBaseUrl}/${id}`, fetcher);

	if (error) return <div>Failed to load character</div>;
	if (!character || isLoading) return <FullPageLoadingSpinner />;

	const getEpisodeId = (url: string) => {
		const parts = url.split('/');
		return parts[parts.length - 1];
	};

	return (
		<Wrapper>
			<Content>
				<BackButton onClick={() => navigate(-1)}>← Back to Overview</BackButton>
				<img src={character.image} alt={character.name} />
				<InfoSection>
					<h1>{character.name}</h1>
					<p>Status: {character.status}</p>
					<p>Species: {character.species}</p>
					<p>Type: {character.type || 'N/A'}</p>
					<p>Gender: {character.gender}</p>
					<p>Origin: {character.origin.name}</p>
					<p>Location: {character.location.name}</p>

					<h2>Episodes:</h2>
					<EpisodesGrid>
						{character.episode.map(ep => (
							<Pill key={ep}>{getEpisodeId(ep)}</Pill>
						))}
					</EpisodesGrid>
				</InfoSection>
			</Content>
		</Wrapper>
	);
};

const Wrapper = styled.div`
	display: flex;
	justify-content: center;
	padding: 2rem;
`;

const Content = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1rem;
	max-width: 800px;
	width: 100%;
`;

const InfoSection = styled.div`
	text-align: left;
	width: 100%;

	h1,
	h2 {
		margin: 1rem 0;
	}

	p {
		margin: 0.5rem 0;
	}

	ul {
		margin: 0.5rem 0;
		padding-left: 1.5rem;
	}
`;

const BackButton = styled.button`
	align-self: flex-start;
	color: inherit;
	text-decoration: none;
	margin-bottom: 1rem;
	background: none;
	border: none;
	cursor: pointer;
	padding: 0;
	font: inherit;

	&:hover {
		text-decoration: underline;
	}
`;

const EpisodesGrid = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
	margin: 1rem 0;
`;

export default SingleCharacter;
