import { api } from "boot/axios";

export async function getTag({ dispatch }, title) {
  let response = null;
  await api
    .get(`api/tag/${title}`)
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

export async function getAllTags({ dispatch }) {
  let response = null;
  await api
    .get(`api/tag`)
    .then((res) => {
      response = {
        status: res.status,
        statusText: res.statusText,
        data: res.data
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

