import type { Article } from '../types/article'
import { articles } from './articles'

export function listArticles(stage: boolean): Article[] {
  return stage ? articles : articles.filter(article => !article.draft)
}

export function findArticle(id: string | undefined, stage: boolean): Article | undefined {
  const article = articles.find(candidate => candidate.id === id)
  if (!article || (article.draft && !stage)) {
    return undefined
  }
  return article
}

export function countDrafts(): number {
  return articles.filter(article => article.draft).length
}
