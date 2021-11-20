import { api } from "boot/axios";

export async function register({ dispatch }, user) {
  let response = null;
  await api
    .post('api/user', user)
    .then(async (res) => {
      response = {
        status: res.status,
        statusText: res.statusText,
      };
      await dispatch('logIn', user);
    })
    .catch((error) => {
      if (error.response) {
        response = {
          status: error.response.status,
          statusText: error.response.statusText,
          detail: error.response.data.detail
        };
      }
    });

  return response;
}

export async function logIn({ dispatch }, user) {
  let response = null;
  await api
    .post("api/login", user)
    .then(async (res) => {
      response = {
        status: res.status,
        statusText: res.statusText,
      };
    })
    .catch((error) => {
      if (error.response) {
        response = {
          status: error.response.status,
          statusText: error.response.statusText,
          detail: error.response.data.detail
        };
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
      response = {
        status: res.status,
        statusText: res.statusText,
      };
      user = res.data
    }
    ).catch((error) => {
      if (error.response) {
        response = {
          status: error.response.status,
          statusText: error.response.statusText,
          detail: error.response.data.detail
        };
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
      response = {
        status: res.status,
        statusText: res.statusText,
      };
    }
    ).catch((error) => {
      if (error.response) {
        response = {
          status: error.response.status,
          statusText: error.response.statusText,
          detail: error.response.data.detail
        };
      }
    });

  commit('logout', null);

  return response;
}

export async function refresh({ commit }) {
  let response = null;
  await api
    .post('api/refresh')
    .then((res) => {
      response = {
        status: res.status,
        statusText: res.statusText,
      };
    }
    ).catch((error) => {
      if (error.response) {
        response = {
          status: error.response.status,
          statusText: error.response.statusText,
          detail: error.response.data.detail
        };
      }
    });
  return response;
}


export async function getUser({ dispatch }, login) {
  let response = null;
  await api
    .get(`api/user/${login}`)
    .then((res) => {
      response = {
        status: res.status,
        statusText: res.statusText,
      };
    })
    .catch((error) => {
      if (error.response) {
        response = {
          status: error.response.status,
          statusText: error.response.statusText,
          detail: error.response.data.detail
        };
      }
    });
  return response;
}

