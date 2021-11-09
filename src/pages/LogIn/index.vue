

<template lang="pug">
.q-pa-md(style="max-width: 400px")
  q-form.q-gutter-md(@submit="onSubmit", @reset="onReset")
    q-input(
      filled,
      v-model="login",
      label="Login",
      lazy-rules,
      :rules="[(val) => (val && val.length > 0) || 'Please type something']"
    )

    q-input(
      filled,
      v-model="password",
      label="Password",
      lazy-rules,
      type="password",
      autocomplete="on",
      :rules="[(val) => (val && val.length > 0) || 'Please type something']"
    )

    div
      q-btn(label="Log in", type="submit", color="primary")
</template>

<script>
import { defineComponent, ref } from "vue";
import { api } from "boot/axios";

import { useQuasar } from "quasar";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";

export default defineComponent({
  name: "LogIn",
  setup() {
    const $q = useQuasar();
    const $store = useStore();
    const $router = useRouter();
    const $route = useRoute();

    const login = ref(null);
    const password = ref(null);

    return {
      login,
      password,

      async onSubmit() {
        api.defaults.headers.common["Authorization"] = "";

        $q.localStorage.remove("token");

        const formData = {
          username: login.value,
          password: password.value,
        };

        await api
          .post("/api/v1/token/login/", formData)
          .then((response) => {
            const token = response.data.auth_token;

            $store.commit("Global/setToken", token);

            api.defaults.headers.common["Authorization"] = "Token " + token;
            $q.localStorage.set("token", token);

            const toPath = $route.query.to || "/";

            $router.push({ path: toPath });

            $q.notify({
              color: "green-4",
              textColor: "white",
              icon: "cloud_done",
              message: "Successfully",
            });
          })
          .catch((error) => {
            if (error.response) {
              if (
                typeof error.response.data === "object" &&
                error.response.data !== null
              ) {
                for (const property in error.response.data) {
                  $q.notify({
                    type: "negative",
                    message: `${property}: ${error.response.data[property]}`,
                    timeout: 8000,
                  });
                }
              } else {
                $q.notify({
                  type: "negative",
                  message: `${error.response.status}: ${error.response.statusText}`,
                  timeout: 8000,
                });
              }
            } else {
              $q.notify({
                type: "negative",
                message: "Something went wrong. Please try again",
                timeout: 8000,
              });

              console.log(JSON.stringify(error));
            }
          });
      },
      onReset() {},
    };
  },
  mounted() {
    document.title = "Log In | Accept";
  },
});
</script>
