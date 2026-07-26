const USER_ID_COOKIE = 'sjdt_user_id'
const PROFILE_COOKIE = 'sjdt_profile_v1'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365

function readCookie(name) {
  if (typeof document === 'undefined') return ''

  const encodedName = `${encodeURIComponent(name)}=`
  const parts = document.cookie ? document.cookie.split('; ') : []
  const match = parts.find((entry) => entry.startsWith(encodedName))
  if (!match) return ''

  return decodeURIComponent(match.slice(encodedName.length))
}

function writeCookie(name, value) {
  if (typeof document === 'undefined') return

  document.cookie = [
    `${encodeURIComponent(name)}=${encodeURIComponent(value)}`,
    `Max-Age=${COOKIE_MAX_AGE}`,
    'Path=/',
    'SameSite=Lax',
  ].join('; ')
}

function createUserId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `sjdt-${crypto.randomUUID().slice(0, 8)}`
  }

  return `sjdt-${Math.random().toString(36).slice(2, 10)}`
}

function safeParse(json, fallback) {
  try {
    return JSON.parse(json)
  } catch {
    return fallback
  }
}

export function normalizeProfile(profile = {}) {
  const ownedItems = Array.isArray(profile.ownedItems)
    ? [...new Set(profile.ownedItems.filter(Boolean))]
    : []
  const deathsHistory = Array.isArray(profile.deathsHistory)
    ? profile.deathsHistory
        .filter(
          (entry) =>
            entry &&
            typeof entry === 'object' &&
            Number.isFinite(entry.timestamp) &&
            (typeof entry.levelName === 'string' && entry.levelName) ||
            Number.isFinite(entry.level),
        )
        .map((entry) => ({
          timestamp: Math.max(0, Math.floor(entry.timestamp)),
          level: Number.isFinite(entry.level) ? Math.max(1, Math.floor(entry.level)) : null,
          levelName: typeof entry.levelName === 'string' && entry.levelName ? entry.levelName : null,
          chaserId: typeof entry.chaserId === 'string' && entry.chaserId ? entry.chaserId : null,
        }))
        .slice(-50)
    : []

  return {
    userId: typeof profile.userId === 'string' && profile.userId ? profile.userId : createUserId(),
    sheebs: Number.isFinite(profile.sheebs) ? Math.floor(profile.sheebs) : 0,
    ownedItems,
    highestLevel: Number.isFinite(profile.highestLevel) ? Math.max(1, Math.floor(profile.highestLevel)) : 1,
    deaths: Number.isFinite(profile.deaths) ? Math.max(0, Math.floor(profile.deaths)) : 0,
    deathsHistory,
    muted: profile.muted === true,
  }
}

export function loadProfile() {
  const storedUserId = readCookie(USER_ID_COOKIE)
  const storedProfile = safeParse(readCookie(PROFILE_COOKIE), {})

  const profile = normalizeProfile({
    ...storedProfile,
    userId: storedUserId || storedProfile.userId,
  })

  persistProfile(profile)
  return profile
}

export function persistProfile(profile) {
  const normalized = normalizeProfile(profile)
  writeCookie(USER_ID_COOKIE, normalized.userId)
  writeCookie(PROFILE_COOKIE, JSON.stringify(normalized))
  return normalized
}
