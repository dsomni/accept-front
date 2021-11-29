export function isAuthenticated (state) {
  return !!state.user;
}

export function stateUser (state) {
  return state.user;
}

export function role (state) {
  return state.user?.role;
}

