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

export async function addTag({ dispatch }, tag) {
  let response = null;
  await api
    .post('api/tag', tag)
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

export async function updateTag({ dispatch }, tag) {
  let response = null;
  await api
    .put(`api/tag/${tag.spec}`, tag.title, tag.connectedTasks)
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

export async function deleteTag({ dispatch }, tag) {
  let response = null;
  await api
    .delete(`api/tag/${tag.spec}`)
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
