import styled from 'styled-components'
import type { ReactNode } from 'react'
import { Header } from './Header'

const Main = styled.main`
  max-width: 900px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
  min-height: calc(100vh - 200px);

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`

const Footer = styled.footer`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl} ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 0.85rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin-top: ${({ theme }) => theme.spacing.xxxl};
`

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <Header />
      <Main>{children}</Main>
      <Footer>
        <p>Embracing imperfection, one moment at a time</p>
      </Footer>
    </>
  )
}
