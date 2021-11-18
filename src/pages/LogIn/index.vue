<style lang="sass" src="./style.sass"></style>

<template lang="pug">
q-page.flex.justify-center.items-center
  q-resize-observer(@resize="onResize")
  div(:class="{ 'full-window': shouldShrink, 'small-window': !shouldShrink }")
    .text-grey-10.text-h4.text-weight-medium.q-pl-xl.q-mt-xl(:class="{ 'center-title': shouldShrink}")
      q-avatar(size="xl", square, :class="{ 'q-ml-xs': !shouldShrink}")
        img(src="~assets/logo.svg")
      span.q-ml-sm Accept
    q-form.q-px-xl.q-pb-xl.q-pt-lg.column.q-gutter-y-sm(
      :class="{ 'full-form': shouldShrink, 'small-form': !shouldShrink }",
      @submit="onSubmit"
    )
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

      .column.q-gutter-y-md.q-pt-md
        q-btn.q-pa-md(label="Log in", type="submit", color="primary")
        //- q-btn(label="WhoAmI", color="primary", @click="printInfo")
        //- q-btn(label="Log out", , @click="logout")
</template>

<script>
import { defineComponent, ref } from "vue";

import { useQuasar } from "quasar";
import { useStore, mapActions } from "vuex";
import { useRouter, useRoute } from "vue-router";

const limitWidth = 500;
const limitWidthDependsHeight = 820;
const limitWidthHeight = 500;

export default defineComponent({
  name: "LogIn",
  setup() {
    const q = useQuasar();
    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    const login = ref(null);
    const password = ref(null);

    const shouldShrink = ref(false);
    if (q.screen.width < limitWidth || (q.screen.width <limitWidthDependsHeight && q.screen.height < limitWidthHeight)) {
      shouldShrink.value = true;
    }

    return {
      store,
      router,
      route,
      login,
      password,

      shouldShrink,

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
    onResize(size) {
      if (size.width < limitWidth || (size.width <limitWidthDependsHeight && size.height < limitWidthHeight)) {
        this.shouldShrink = true;
      } else {
        this.shouldShrink = false;
      }
    },
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
