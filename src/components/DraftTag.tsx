import styled from 'styled-components'

export const DraftTag = styled.span`
  display: inline-block;
  padding: 0.1rem 0.5rem;
  margin-left: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.accent};
  border-radius: 999px;
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accent};
  vertical-align: middle;
`
