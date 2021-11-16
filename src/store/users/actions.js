import { api } from "boot/axios";

export async function register({ dispatch }, form) {
  await api.post('register', form);
  let UserForm = new FormData();
  UserForm.append('username', form.username);
  UserForm.append('password', form.password);
  await dispatch('logIn', UserForm);
}

export async function logIn({ dispatch }, user) {
  await api.post('api/login', user);
  await dispatch('viewMe');
}

export async function viewMe({ commit }) {
  let { data } = await api.get('api/whoami');
  await commit('setUser', data);
}

export async function logOut({ commit }) {
  await api.delete('api/logout');
  let user = null;
  commit('logout', user);
}

