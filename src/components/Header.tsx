import styled from 'styled-components'
import { Link } from 'react-router-dom'

const HeaderWrapper = styled.header`
  padding: ${({ theme }) => theme.spacing.xxxl} ${({ theme }) => theme.spacing.xl};
  text-align: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.surface};
`

const Logo = styled(Link)`
  display: inline-block;
`

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 300;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1.8rem;
  }
`

const Subtitle = styled.p`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1.1rem;
  font-style: italic;
  color: ${({ theme }) => theme.colors.textMuted};
  letter-spacing: 0.05em;
`

export function Header() {
  return (
    <HeaderWrapper>
      <Logo to="/">
        <Title>Wabi Sabi</Title>
        <Subtitle>The art of imperfect beauty</Subtitle>
      </Logo>
    </HeaderWrapper>
  )
}
