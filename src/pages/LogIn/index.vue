

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

    .column.q-gutter-md
      q-btn(label="Log in", type="submit", color="primary")
      q-btn(label="WhoAmI", color="primary", @click="printInfo")
      q-btn(label="Log out", , @click="logout")
</template>

<script>
import { defineComponent, ref } from "vue";

import { useQuasar } from "quasar";
import { useStore, mapActions } from "vuex";
import { useRouter, useRoute } from "vue-router";

export default defineComponent({
  name: "LogIn",
  setup() {
    const q = useQuasar();
    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    const login = ref(null);
    const password = ref(null);

    return {
      store,
      router,
      route,
      login,
      password,

      async onSubmit() {
        const User = {
          login: login.value.toString(),
          password: password.value.toString(),
        };
        const response = await store.dispatch("users/logIn", User);
        if (response.status == 200) {
          const toPath = route.query.nextUrl || "/";
          router.push({ path: toPath });
          q.notify({
            color: "green-4",
            textColor: "white",
            message: response.data?.detail || "Successfully",
          });
        } else {
          q.notify({
            type: "negative",
            message:
              response.data?.detail ||
              `${response.status}: ${response.statusText}`,
            timeout: 8000,
          });
        }
      },
      onReset() {},
    };
  },
  computed: {
    isLoggedIn: function () {
      return this.store.getters["users/isAuthenticated"];
    },
  },
  mounted() {
    document.title = "Log In | Accept";
  },
  methods: {
    async logout() {
      let response = await this.store.dispatch("users/logOut");
      const toPath = this.route.query.nextUrl || "/login";
      this.router.push({ path: toPath });
    },
    async printInfo() {
      let response = await this.store.dispatch("users/viewMe");
      // console.log(this.store.getters["users/stateUser"]);
    },
  },
});
</script>
