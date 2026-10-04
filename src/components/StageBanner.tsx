import { useEffect } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { countDrafts } from '../data/visibility'

const Banner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accent};
  background-color: ${({ theme }) => theme.colors.surfaceMuted};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const PublicLink = styled(Link)`
  color: ${({ theme }) => theme.colors.textMuted};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`

export function StageBanner() {
  const drafts = countDrafts()

  // Keep the review path out of search engines.
  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    return () => {
      document.head.removeChild(meta)
    }
  }, [])

  return (
    <Banner role="status">
      <span>Stage preview · {drafts} {drafts === 1 ? 'draft' : 'drafts'} visible here, hidden from the public site</span>
      <PublicLink to="/">View public site</PublicLink>
    </Banner>
  )
}
