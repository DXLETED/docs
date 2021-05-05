export const loadState = (key: string) => {
  try {
    const serializedState = localStorage.getItem(key)
    return serializedState != null && JSON.parse(serializedState)
  } catch (err) {
    localStorage.removeItem(key)
  }
}

export const saveState = (key: string, state: {}) => {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem(key, serializedState)
  } catch {
    localStorage.removeItem(key)
  }
}
