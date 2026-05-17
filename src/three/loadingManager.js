// Shared Three.js LoadingManager. HeroScene + ScrollScene attach their GLTFLoaders to this.
// Loader UI subscribes to state via onLoadingChange().

let manager = null
let state = { loaded: 0, total: 0, started: false, done: false }
const listeners = new Set()

function emit(next) {
  state = { ...state, ...next }
  listeners.forEach((cb) => cb(state))
}

export function getLoadingManager() {
  if (typeof window === 'undefined' || !window.THREE) return null
  if (manager) return manager
  manager = new window.THREE.LoadingManager()
  manager.onStart = (_u, loaded, total) => emit({ started: true, loaded, total, done: false })
  manager.onProgress = (_u, loaded, total) => emit({ loaded, total })
  manager.onLoad = () => emit({ done: true, loaded: state.total || 1, total: state.total || 1 })
  manager.onError = (u) => {
    // eslint-disable-next-line no-console
    console.warn('[three] failed to load', u)
  }
  return manager
}

export function onLoadingChange(cb) {
  listeners.add(cb)
  cb(state)
  return () => listeners.delete(cb)
}

export function getLoadingState() { return state }
