// Centralized storage utilities

// Unified TurboWarp namespace key used across the app
export const NAMESPACE_KEY = 'extensions.turbowarp.org/local-storage:misarcade'

// Known localStorage keys we might set
const KNOWN_KEYS = [
  'arcadeUserId',
  'arcadeUserName',
  'arcadeUserAvatarBase64',
  'arcadeUserAvatarURL',
  'pb_auth', // PocketBase auth store default key
  NAMESPACE_KEY,
  'misarcade_guest_scores',
]

export function clearAllLocalStorage(): void {
  try {
    localStorage.clear()
  } catch {
    // Fallback: best-effort remove known keys
    for (const key of KNOWN_KEYS) {
      try { localStorage.removeItem(key) } catch { /* noop */ }
    }
  }

  // Also clear sessionStorage if available (defensive; not strictly needed)
  try { sessionStorage.clear() } catch { /* noop */ }

  for (const key of KNOWN_KEYS) {
    try { localStorage.removeItem(key) } catch { /* noop */ }
  }
}

export interface GuestScoreEntry {
  gameKey: string
  score: number
  timestamp: number
}

const GUEST_SCORES_KEY = 'misarcade_guest_scores'

function getGuestScores(): GuestScoreEntry[] {
  try {
    const raw = localStorage.getItem(GUEST_SCORES_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveGuestScores(scores: GuestScoreEntry[]): void {
  try {
    localStorage.setItem(GUEST_SCORES_KEY, JSON.stringify(scores))
  } catch {
    // Storage quota exceeded or other error
  }
}

export function addGuestScore(gameKey: string, score: number): void {
  const scores = getGuestScores()
  const existingScore = scores.find(entry => entry.gameKey === gameKey && entry.score === score)
  if (existingScore) {
    return
  }
  scores.push({
    gameKey,
    score,
    timestamp: Date.now()
  })
  saveGuestScores(scores)
}

export function getGuestScoresForGame(gameKey: string): GuestScoreEntry[] {
  return getGuestScores().filter(entry => entry.gameKey === gameKey)
}

export function getGuestBestScores(): Map<string, number> {
  const scores = getGuestScores()
  const bestByGame = new Map<string, number>()
  
  for (const entry of scores) {
    const current = bestByGame.get(entry.gameKey)
    if (current == null || entry.score > current) {
      bestByGame.set(entry.gameKey, entry.score)
    }
  }

  return bestByGame
}