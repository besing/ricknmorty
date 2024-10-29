import { useParams, Link } from 'react-router-dom';
import useSWR from 'swr';
import { FullPageLoadingSpinner } from '../components/LoadingSpinner';
import styled from 'styled-components';

interface Character {
	id: number;
	name: string;
	status: string;
	species: string;
	type: string;
	gender: string;
	origin: {
		name: string;
		url: string;
	};
	location: {
		name: string;
		url: string;
	};
	image: string;
	episode: string[];
	url: string;
	created: string;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

const SingleCharacter = () => {
	const { id } = useParams();
	const {
		data: character,
		error,
		isLoading
	} = useSWR<Character>(`https://rickandmortyapi.com/api/character/${id}`, fetcher);

	if (error) return <div>Failed to load character</div>;
	if (!character || isLoading) return <FullPageLoadingSpinner />;

	return (
		<Wrapper>
			<Content>
				<BackLink to="/">← Back to Home</BackLink>
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
					<ul>
						{character.episode.map((ep, index) => (
							<li key={ep}>
								Episode {index + 1}: {ep}
							</li>
						))}
					</ul>

					<MetaSection>
						<h2>Additional Information:</h2>
						<p>
							Character URL:{' '}
							<a href={character.url} target="_blank" rel="noopener noreferrer">
								{character.url}
							</a>
						</p>
						<p>Created: {new Date(character.created).toLocaleDateString()}</p>
					</MetaSection>
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

const MetaSection = styled.div`
	margin-top: 2rem;
	padding-top: 1rem;
	border-top: 1px solid #ccc;
`;

const BackLink = styled(Link)`
	align-self: flex-start;
	color: inherit;
	text-decoration: none;
	margin-bottom: 1rem;

	&:hover {
		text-decoration: underline;
	}
`;

export default SingleCharacter;
