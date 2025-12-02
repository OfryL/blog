import { useParams, Link, Navigate } from 'react-router-dom'
import styled from 'styled-components'
import { articles } from '../data/articles'

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: 0.85rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
  transition: color ${({ theme }) => theme.transitions.default};

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }

  &::before {
    content: '←';
  }
`

const ArticleHeader = styled.header`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
`

const Date = styled.time`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textLight};
  letter-spacing: 0.1em;
  text-transform: uppercase;
`

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 300;
  margin: ${({ theme }) => theme.spacing.md} 0;
  color: ${({ theme }) => theme.colors.text};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1.8rem;
  }
`

const Tags = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: center;
  flex-wrap: wrap;
`

const Tag = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textLight};
  letter-spacing: 0.05em;

  &::before {
    content: '#';
  }
`

const FeaturedImage = styled.img`
  width: 100%;
  max-height: 500px;
  object-fit: cover;
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
  filter: grayscale(10%) contrast(0.98);
`

const Content = styled.div`
  max-width: 680px;
  margin: 0 auto;
  font-size: 1.05rem;
  line-height: 1.9;
  color: ${({ theme }) => theme.colors.text};

  p {
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }

  strong {
    font-weight: 500;
  }

  ul, ol {
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    padding-left: ${({ theme }) => theme.spacing.xl};
  }

  li {
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }
`

function formatDate(dateString: string): string {
  const date = new window.Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function parseContent(content: string): string {
  return content
    .split('\n\n')
    .map(paragraph => {
      if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
        return `<h3>${paragraph.slice(2, -2)}</h3>`
      }
      if (paragraph.startsWith('- ')) {
        const items = paragraph.split('\n').map(item => `<li>${item.slice(2)}</li>`).join('')
        return `<ul>${items}</ul>`
      }
      if (paragraph.includes('**')) {
        paragraph = paragraph.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      }
      return `<p>${paragraph}</p>`
    })
    .join('')
}

export function ArticlePage() {
  const { id } = useParams<{ id: string }>()
  const article = articles.find(a => a.id === id)

  if (!article) {
    return <Navigate to="/" replace />
  }

  return (
    <article>
      <BackLink to="/">Back to articles</BackLink>
      <ArticleHeader>
        <Date dateTime={article.date}>{formatDate(article.date)}</Date>
        <Title>{article.title}</Title>
        {article.tags && (
          <Tags>
            {article.tags.map(tag => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </Tags>
        )}
      </ArticleHeader>
      {article.image && (
        <FeaturedImage src={article.image} alt={article.title} />
      )}
      <Content dangerouslySetInnerHTML={{ __html: parseContent(article.content) }} />
    </article>
  )
}
