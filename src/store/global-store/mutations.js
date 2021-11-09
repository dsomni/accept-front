import { LocalStorage, SessionStorage } from 'quasar'

export function initializeStore(state) {

  if (LocalStorage.getItem('token')) {
      state.token = LocalStorage.getItem('token')
      state.isAuthenticated = true
  } else {
      state.token = ''
      state.isAuthenticated = false
  }
}

export function setIsLoading(state, status) {
  state.isLoading = status
}
export function setToken(state, token) {
    state.token = token
    state.isAuthenticated = true
}
export function removeToken(state) {
    state.token = ''
    state.isAuthenticated = false
}
