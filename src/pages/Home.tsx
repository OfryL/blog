import styled from 'styled-components'
import { ArticleCard } from '../components/ArticleCard'
import { articles } from '../data/articles'

const PageTitle = styled.h1`
  font-size: 1.2rem;
  font-weight: 400;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
  text-align: center;
`

const ArticleList = styled.div`
  display: flex;
  flex-direction: column;
`

export function Home() {
  return (
    <>
      <PageTitle>Latest Articles</PageTitle>
      <ArticleList>
        {articles.map(article => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </ArticleList>
    </>
  )
}
