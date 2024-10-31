import styled from 'styled-components';

const LoadingSpinnerContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100vw;
	height: 100vh;
`;

const LoadingSpinner = styled.div`
	width: 3rem;
	height: 3rem;
	background-image: url('/loading-spinner.svg');
	background-size: contain;
`;

const FullPageLoadingSpinner = () => (
	<LoadingSpinnerContainer>
		<LoadingSpinner />
	</LoadingSpinnerContainer>
);

export { LoadingSpinner, FullPageLoadingSpinner };
