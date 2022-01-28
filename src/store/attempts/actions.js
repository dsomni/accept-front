import { api } from "boot/axios";

export async function send({ dispatch }, attempt) {
  let response = null;
  await api
    .post('api/attempt', attempt)
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

  return response;
}

export async function getUserTask({ dispatch }, {login, task_spec}) {
  let response = null;
  await api
    .get(`api/attempt_login_task`, {
      params: {
        login: login,
        task_spec: task_spec
    }})
    .then((res) => {
      response = {
        status: res.status,
        statusText: res.statusText,
        attempts: res.data
      }
    })
    .catch((error) => {
      if (error.response) {
        response = {
          status: error.response.status,
          statusText: error.response.statusText,
          detail: error.response.data.detail
        }
      }
    })
  return response;
}