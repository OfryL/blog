import styled from 'styled-components'
import { Link } from 'react-router-dom'

const HeaderWrapper = styled.header`
  position: relative;
  padding: ${({ theme }) => theme.spacing.xxxl} ${({ theme }) => theme.spacing.xl};
  text-align: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.surface};
  transition: background-color ${({ theme }) => theme.transitions.default};
`

// Shown only while the system is in light mode, same hint as ofry.net
const DarkHint = styled.span`
  display: none;
  position: absolute;
  top: ${({ theme }) => theme.spacing.md};
  right: ${({ theme }) => theme.spacing.md};
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: 0.3rem 0.7rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 999px;
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textLight};
  background-color: ${({ theme }) => theme.colors.surfaceMuted};

  @media (prefers-color-scheme: light) {
    display: inline-flex;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    position: static;
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
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
      <DarkHint aria-hidden="true">🌙 Best viewed in dark mode</DarkHint>
      <Logo to="/">
        <Title>Wabi Sabi</Title>
        <Subtitle>The art of imperfect beauty</Subtitle>
      </Logo>
    </HeaderWrapper>
  )
}
