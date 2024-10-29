import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Logo = () => (
	<StyledLogoWrapper>
		<StyledLink to="/">
			<StyledLogo src="/logo.webp" alt="Rick and Morty's Interdimensional Index" />
		</StyledLink>
	</StyledLogoWrapper>
);

const StyledLogoWrapper = styled.div`
	display: flex;
	justify-content: center;
	width: 100%;
`;

const StyledLink = styled(Link)`
	display: block;
	margin: 0 1rem 2rem;
	text-align: center;
	max-width: 350px;
`;

const StyledLogo = styled.img`
	width: 100%;
	height: auto;
	border-radius: 10%;
`;

export default Logo;
