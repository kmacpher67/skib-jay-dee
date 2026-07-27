const USER_ID_COOKIE = 'sjdt_user_id'
const PROFILE_COOKIE = 'sjdt_profile_v1'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365
const PROFILES_REGISTRY_KEY = 'sjdt_profiles_v1'

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

function readRegistry() {
  if (typeof localStorage === 'undefined') return {}
  return safeParse(localStorage.getItem(PROFILES_REGISTRY_KEY) ?? '', {}) || {}
}

function writeRegistry(registry) {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(PROFILES_REGISTRY_KEY, JSON.stringify(registry))
}

function saveToRegistry(profile) {
  const registry = readRegistry()
  registry[profile.userId] = profile
  writeRegistry(registry)
  return registry
}

export function normalizeProfile(profile = {}) {
  const ownedItems = Array.isArray(profile.ownedItems)
    ? [...new Set(profile.ownedItems.filter(Boolean))]
    : []
  const earnedBadges = Array.isArray(profile.earnedBadges)
    ? [...new Set(profile.earnedBadges.filter(Boolean))]
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
          timePlayed: Number.isFinite(entry.timePlayed) ? entry.timePlayed : null,
          sessionSheebDelta: Number.isFinite(entry.sessionSheebDelta) ? entry.sessionSheebDelta : null,
          sessionSkreemDelta: Number.isFinite(entry.sessionSkreemDelta) ? entry.sessionSkreemDelta : null,
        }))
        .slice(-50)
    : []

  const rewardsHistory = Array.isArray(profile.rewardsHistory)
    ? profile.rewardsHistory
        .filter(
          (entry) =>
            entry &&
            typeof entry === 'object' &&
            Number.isFinite(entry.timestamp) &&
            typeof entry.type === 'string' &&
            typeof entry.label === 'string'
        )
        .map((entry) => ({
          timestamp: Math.max(0, Math.floor(entry.timestamp)),
          type: entry.type,
          label: entry.label,
          amount: Number.isFinite(entry.amount) ? entry.amount : null,
          level: Number.isFinite(entry.level) ? Math.max(1, Math.floor(entry.level)) : null,
          levelName: typeof entry.levelName === 'string' && entry.levelName ? entry.levelName : null,
        }))
        .slice(-50)
    : []

  const userId = typeof profile.userId === 'string' && profile.userId ? profile.userId : createUserId()

  return {
    userId,
    label: typeof profile.label === 'string' && profile.label.trim() ? profile.label.trim().slice(0, 24) : '',
    sheebs: Number.isFinite(profile.sheebs) ? Math.floor(profile.sheebs) : 0,
    ownedItems,
    earnedBadges,
    highestLevel: Number.isFinite(profile.highestLevel) ? Math.max(1, Math.floor(profile.highestLevel)) : 1,
    deaths: Number.isFinite(profile.deaths) ? Math.max(0, Math.floor(profile.deaths)) : 0,
    deathsHistory,
    rewardsHistory,
    muted: profile.muted === true,
    updatedAt: Number.isFinite(profile.updatedAt) ? Math.floor(profile.updatedAt) : Date.now(),
  }
}

export function loadProfile() {
  const storedUserId = readCookie(USER_ID_COOKIE)
  const registry = readRegistry()
  const registered = storedUserId ? registry[storedUserId] : null
  const storedProfile = registered || safeParse(readCookie(PROFILE_COOKIE), {})

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
  saveToRegistry(normalized)
  return normalized
}

// Every profile ever active on this browser, newest-touched first. Each
// entry is a full normalized profile (not just a summary) so switching is a
// pure read with no re-fetch step.
export function listProfiles() {
  const registry = readRegistry()
  return Object.values(registry).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
}

// Makes `userId` the active profile (writes the pointer + profile cookies)
// and returns it. No-ops into `createProfile()` if the id isn't registered.
export function switchProfile(userId) {
  const registry = readRegistry()
  const found = registry[userId]
  if (!found) return createProfile()

  const normalized = normalizeProfile({ ...found, updatedAt: Date.now() })
  writeCookie(USER_ID_COOKIE, normalized.userId)
  writeCookie(PROFILE_COOKIE, JSON.stringify(normalized))
  saveToRegistry(normalized)
  return normalized
}

// Creates and activates a brand-new save slot in this browser, optionally
// with a display label (shown in the switcher instead of the raw id).
export function createProfile(label = '') {
  const profile = normalizeProfile({ userId: createUserId(), label })
  return persistProfile(profile)
}
