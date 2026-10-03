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
  filter: var(--image-filter);
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

  h3 {
    font-size: 1.5rem;
    margin: ${({ theme }) => theme.spacing.xl} 0 ${({ theme }) => theme.spacing.md};
  }

  a {
    color: ${({ theme }) => theme.colors.accent};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};

    &:hover {
      color: ${({ theme }) => theme.colors.accentHover};
      border-bottom-color: ${({ theme }) => theme.colors.accentHover};
    }
  }

  code {
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 0.9em;
    background-color: ${({ theme }) => theme.colors.surfaceMuted};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 3px;
    padding: 0.1em 0.35em;
  }

  pre {
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
    background-color: ${({ theme }) => theme.colors.surfaceMuted};
    border: 1px solid ${({ theme }) => theme.colors.border};
    overflow-x: auto;
    line-height: 1.6;

    code {
      font-size: 0.85rem;
      background: none;
      border: none;
      padding: 0;
    }
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

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function formatInline(text: string): string {
  const codeSpans: string[] = []
  let result = escapeHtml(text).replace(/`([^`]+)`/g, (_match, code: string) => {
    codeSpans.push(`<code>${code}</code>`)
    return `\uE000${codeSpans.length - 1}\uE000`
  })
  result = result
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
  return result.replace(/\uE000(\d+)\uE000/g, (_match, index: string) => codeSpans[Number(index)])
}

function parseContent(content: string): string {
  const codeBlocks: string[] = []
  const withoutCode = content.replace(/```([\w-]*)\n([\s\S]*?)```/g, (_match, lang: string, code: string) => {
    const className = lang ? ` class="language-${lang}"` : ''
    codeBlocks.push(`<pre><code${className}>${escapeHtml(code.replace(/\n$/, ''))}</code></pre>`)
    return `\uE001${codeBlocks.length - 1}\uE001`
  })

  return withoutCode
    .split(/\n\s*\n/)
    .map(block => block.trim())
    .filter(block => block.length > 0)
    .map(block => {
      const codeMatch = block.match(/^\uE001(\d+)\uE001$/)
      if (codeMatch) {
        return codeBlocks[Number(codeMatch[1])]
      }
      const headingMatch = block.match(/^\*\*([^*\n]+)\*\*$/)
      if (headingMatch) {
        return `<h3>${escapeHtml(headingMatch[1])}</h3>`
      }
      const lines = block.split('\n')
      if (lines.every(line => line.startsWith('- '))) {
        const items = lines.map(line => `<li>${formatInline(line.slice(2))}</li>`).join('')
        return `<ul>${items}</ul>`
      }
      if (lines.every(line => /^\d+\.\s/.test(line))) {
        const items = lines.map(line => `<li>${formatInline(line.replace(/^\d+\.\s/, ''))}</li>`).join('')
        return `<ol>${items}</ol>`
      }
      return `<p>${formatInline(block)}</p>`
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
