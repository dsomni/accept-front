export function isAuthenticated (state) {
  return !!state.user;
}

export function stateUser (state) {
  console.log(state)
  return state.user;
}
