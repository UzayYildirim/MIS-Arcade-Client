import { ref, onMounted, onBeforeUnmount } from 'vue'
import PocketBase from 'pocketbase'
import { config } from '../config/env'
import { clearAllLocalStorage } from '../utils/storage'

export function useSession() {
  const pb = config.pocketbaseUrl ? new PocketBase(config.pocketbaseUrl) : null
  const sessionInterval = ref<number | null>(null)
  const isTracking = ref(false)

  const getCurrentUserId = (): string | null => {
    return localStorage.getItem('arcadeUserId')
  }

  const getCurrentPageUrl = (): string => {
    return window.location.href
  }

  const isUserLoggedIn = (): boolean => {
    return !!getCurrentUserId()
  }

  const createSession = async (userId: string, lastAction: string) => {
    if (!pb) return
    const body: any = { id: userId, user: userId, last_action: lastAction }
    return pb.collection('sessions').create(body, { '$autoCancel': false, 'cache': 'no-store' })
  }

  const updateSession = async (userId: string, lastAction: string) => {
    if (!pb) return
    const body = { last_action: lastAction }
    return pb.collection('sessions').update(userId, body, { '$autoCancel': false, 'cache': 'no-store' })
  }

  const trackSession = async () => {
    if (!isUserLoggedIn()) return
    if (!config.pocketbaseUrl) return

    const userId = getCurrentUserId()
    if (!userId) return

    const currentUrl = getCurrentPageUrl()

    try {
      await updateSession(userId, currentUrl)
    } catch (error: any) {
      if (error?.status === 404) {
        try {
          await createSession(userId, currentUrl)
        } catch {
          // Session creation failed, try update one more time in case it was created concurrently
          try {
            await updateSession(userId, currentUrl)
          } catch {
            // Silently fail - don't break the app for session tracking issues
          }
        }
      }
      // Silently ignore other errors to prevent breaking the app
    }
  }

  const startTracking = () => {
    if (isTracking.value) return
    if (!isUserLoggedIn()) return

    isTracking.value = true
    trackSession()
    sessionInterval.value = window.setInterval(() => { trackSession() }, 60000)
  }

  const stopTracking = () => {
    if (sessionInterval.value) {
      clearInterval(sessionInterval.value)
      sessionInterval.value = null
    }
    isTracking.value = false
  }

  const checkLoginStatus = () => {
    if (isUserLoggedIn()) startTracking(); else stopTracking()
  }

  const setupEventListeners = () => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'arcadeUserId') checkLoginStatus()
    }
    const handleLoginEvent = () => { checkLoginStatus() }
    const handleLogoutEvent = () => { clearAllLocalStorage(); stopTracking() }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('user-login', handleLoginEvent)
    window.addEventListener('user-logout', handleLogoutEvent)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('user-login', handleLoginEvent)
      window.removeEventListener('user-logout', handleLogoutEvent)
    }
  }

  onMounted(() => {
    checkLoginStatus()
    const cleanup = setupEventListeners()
    onBeforeUnmount(() => { stopTracking(); cleanup() })
  })

  const debugSessions = async () => {
    if (!config.pocketbaseUrl) return []
    try {
      const all = await pb.collection('sessions').getFullList({ '$autoCancel': false, 'cache': 'no-store' })
      const uid = getCurrentUserId()
      if (uid) {
        return all.filter(s => s.user === uid)
      }
      return all
    } catch (e) {
      return []
    }
  }

  return { isTracking, trackSession, startTracking, stopTracking, checkLoginStatus, debugSessions, clearAllLocalStorage }
}
