import { api } from "boot/axios";

export async function getAssignmentSchemas({ dispatch }) {
  let response = null;
  await api
  .get(`api/assignment_schema`)
  .then((res) => {
    response = {
      status: res.status,
      statusText: res.statusText,
      data: res.data
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
