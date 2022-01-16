import { api } from "boot/axios";

export async function addTask({ dispatch }, task) {
  let response = null;
  await api
    .post('api/task', task)
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

export async function getAllTasksToDisplay({ dispatch }) {
  let response = null;
  await api
    .get('api/task-display-mode')
    .then(async (res) => {
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

export async function getTaskBySpec({ dispatch }, spec) {
  let response = null;
  await api
    .get(`api/task/${spec}`)
    .then(async (res) => {
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


export async function updateTask({ dispatch }, task) {
  let response = null;
  await api
    .put(`api/task/${task.spec}`, task)
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
