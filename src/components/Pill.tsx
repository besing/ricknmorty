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
	border: 1px solid ${({ theme }) => theme.borderColor};
	font-size: 14px;
	font-weight: 500;
`;

export default Pill;
