import styled from 'styled-components';

interface PillProps {
	children: string;
}

const Pill = ({ children }: PillProps) => {
	return <StyledPill>{children}</StyledPill>;
};

const StyledPill = styled.span`
	display: inline-block;
	padding: 4px 12px;
	border-radius: 16px;
	background-color: #4caf50;
	color: white;
	font-size: 14px;
	font-weight: 500;
`;

export default Pill;