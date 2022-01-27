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
      // await dispatch('logIn', user);
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
