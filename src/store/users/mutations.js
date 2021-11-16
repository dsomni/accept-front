import { LocalStorage, SessionStorage } from 'quasar'

export function setUser(state, login) {

  state.user = login;
}

export function logout(state, user) {
  state.user = user
}
