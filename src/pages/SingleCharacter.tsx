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
			<BackButton onClick={() => navigate(-1)}>← Back to Overview</BackButton>
			<Card>
				<ImageSection>
					<CharacterImage src={character.image} alt={character.name} />
					<StatusBadge $status={character.status}>{character.status}</StatusBadge>
				</ImageSection>

				<ContentSection>
					<Title>{character.name}</Title>
					<InfoGrid>
						<InfoItem>
							<Label>Species</Label>
							<Value>{character.species}</Value>
						</InfoItem>
						<InfoItem>
							<Label>Type</Label>
							<Value>{character.type || 'N/A'}</Value>
						</InfoItem>
						<InfoItem>
							<Label>Gender</Label>
							<Value>{character.gender}</Value>
						</InfoItem>
						<InfoItem>
							<Label>Origin</Label>
							<Value>{character.origin.name}</Value>
						</InfoItem>
						<InfoItem>
							<Label>Location</Label>
							<Value>{character.location.name}</Value>
						</InfoItem>
					</InfoGrid>

					<EpisodesSection>
						<Label>Episodes</Label>
						<EpisodesGrid>
							{character.episode.map(ep => (
								<Pill key={ep}>{getEpisodeId(ep)}</Pill>
							))}
						</EpisodesGrid>
					</EpisodesSection>
				</ContentSection>
			</Card>
		</Wrapper>
	);
};

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 2rem;
	max-width: 800px;
	margin: 0 auto;
`;

const Card = styled.div`
	position: relative;
	background-color: ${({ theme }) => theme.overlayBackground};
	border: 1px solid ${({ theme }) => theme.borderColor};
	border-radius: 8px;
	width: 300px;
	overflow: hidden;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ImageSection = styled.div`
	position: relative;
	width: 100%;
	height: 300px;
`;

const CharacterImage = styled.img`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	object-fit: contain;
`;

const StatusBadge = styled.div<{ $status: string }>`
	position: absolute;
	top: 1rem;
	right: 1rem;
	padding: 0.5rem 1rem;
	border-radius: 16px;
	font-weight: 500;
	font-size: 0.875rem;
	background: ${({ $status, theme }) =>
		$status === 'Alive' ? theme.highlightBackground : $status === 'Dead' ? theme.red400 : theme.gray400};
	color: white;
`;

const ContentSection = styled.div`
	padding: 1.5rem;
`;

const Title = styled.h1`
	margin: 0 0 1.5rem 0;
	font-size: 1.5rem;
	font-weight: 600;
	color: ${({ theme }) => theme.textColor};
`;

const InfoGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	gap: 1.5rem;
	margin-bottom: 2rem;
`;

const InfoItem = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
`;

const Label = styled.span`
	font-size: 0.875rem;
	color: ${({ theme }) => theme.textColorBase};
	font-weight: 500;
`;

const Value = styled.span`
	color: ${({ theme }) => theme.textColor};
	font-size: 1rem;
`;

const EpisodesSection = styled.div`
	border-top: 1px solid ${({ theme }) => theme.borderColor};
	padding-top: 1.5rem;
	margin-top: 1.5rem;
`;

const EpisodesGrid = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
	margin-top: 0.75rem;
`;

const BackButton = styled.button`
	align-self: flex-start;
	color: ${({ theme }) => theme.textColor};
	text-decoration: none;
	margin-bottom: 1rem;
	background: none;
	border: none;
	cursor: pointer;
	padding: 0;
	font: inherit;
	font-weight: 500;

	&:hover {
		color: ${({ theme }) => theme.textColorHover};
	}
`;

export default SingleCharacter;
