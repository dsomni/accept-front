export function isAuthenticated (state) {
  return !!state.user;
}

export function stateUser (state) {
  return state.user;
}

export function role (state) {
  return state.user?.role;
}

export function shortName (state) {
  return state.user?.shortName || state.user?.name || state.user?.login || "Anonymous";
}

export function login (state) {
  return state.user?.login || "Error";
}
