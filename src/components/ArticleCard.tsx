import styled from 'styled-components'
import { Link } from 'react-router-dom'
import type { Article } from '../types/article'

const Card = styled.article`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.xxl} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:first-child {
    padding-top: 0;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.lg};
  }
`

const ImageContainer = styled.div`
  overflow: hidden;
  aspect-ratio: 4/3;
`

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(20%) contrast(0.95);
  transition: all ${({ theme }) => theme.transitions.default};

  &:hover {
    filter: grayscale(0%) contrast(1);
    transform: scale(1.02);
  }
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const Date = styled.time`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textLight};
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`

const Title = styled.h2`
  font-size: 1.6rem;
  font-weight: 400;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text};
  transition: color ${({ theme }) => theme.transitions.default};

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`

const Excerpt = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.95rem;
  line-height: 1.8;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`

const ReadMore = styled(Link)`
  font-size: 0.85rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.accent};
  align-self: flex-start;
  position: relative;
  padding-bottom: 2px;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 1px;
    background-color: ${({ theme }) => theme.colors.accent};
    transition: width ${({ theme }) => theme.transitions.default};
  }

  &:hover::after {
    width: 100%;
  }
`

const Tags = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`

const Tag = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textLight};
  letter-spacing: 0.05em;

  &::before {
    content: '#';
  }
`

interface ArticleCardProps {
  article: Article
}

function formatDate(dateString: string): string {
  const date = new window.Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Card>
      {article.image && (
        <ImageContainer>
          <Link to={`/article/${article.id}`}>
            <Image src={article.image} alt={article.title} loading="lazy" />
          </Link>
        </ImageContainer>
      )}
      <Content>
        <Date dateTime={article.date}>{formatDate(article.date)}</Date>
        <Link to={`/article/${article.id}`}>
          <Title>{article.title}</Title>
        </Link>
        <Excerpt>{article.excerpt}</Excerpt>
        <ReadMore to={`/article/${article.id}`}>Read more</ReadMore>
        {article.tags && (
          <Tags>
            {article.tags.map(tag => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </Tags>
        )}
      </Content>
    </Card>
  )
}
