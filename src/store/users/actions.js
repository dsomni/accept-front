import { api } from "boot/axios";

export async function register({ dispatch }, user) {
  let response = null;
  await api
  .post('api/user', user)
  .then((res) => {
    response = res;
  })
  .catch((error) => {
    if (error.response) {
      response = error.response
    }
  });
  await dispatch('logIn', user);
  return response;
}

export async function logIn({ dispatch }, user) {
  let response = null;
  await api
    .post("api/login", user)
    .then((res) => {
      response = res;
    })
    .catch((error) => {
      if (error.response) {
        response = error.response
      }
    });
  await dispatch('viewMe');
  return response;
}

export async function viewMe({ commit }) {
  let user = null;
  let response = null;
  await api
    .get('api/whoami')
    .then((res) => {
      response = res;
      user = res.data
    }
    ).catch((error) => {
      if (error.response) {
        response = error.response
      }
    });
  commit('setUser', user);
  return response;
}

export async function logOut({ commit }) {
  let response = null;
  await api
  .delete('api/logout')
  .then((res) => {
    response = res;
  }
  ).catch((error) => {
    if (error.response) {
      response = error.response
    }
  });

  let user = null;
  commit('logout', user);

  return response;
}

export async function refresh({ commit }) {
  let response = null;
  await api
    .post('api/refresh')
    .then((res) => {
      response = res;
    }
    ).catch((error) => {
      if (error.response) {
        response = error.response
      }
    });
  return response;
}


export async function getUser({ dispatch }, login) {
  let response = null;
  await api
    .get(`api/user/${login}`)
    .then((res) => {
      response = res;
    })
    .catch((error) => {
      if (error.response) {
        response = error.response
      }
    });
  return response;
}

