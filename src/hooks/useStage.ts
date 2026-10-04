import { useLocation } from 'react-router-dom'

/** Unlisted review path: shows draft posts that the public routes hide. */
export const STAGE_PATH = '/stage'

export function useStage() {
  const { pathname } = useLocation()
  const stage = pathname === STAGE_PATH || pathname.startsWith(`${STAGE_PATH}/`)
  return { stage, prefix: stage ? STAGE_PATH : '' }
}
