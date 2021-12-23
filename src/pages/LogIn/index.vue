<style lang="sass" src="./style.sass"></style>

<template lang="pug">
q-page.flex.justify-center.items-center
  q-resize-observer(@resize="onResize")
  div(:class="{ 'full-window': shouldShrink, 'small-window': !shouldShrink }")
    .text-grey-10.text-h4.text-weight-regular.q-pl-xl.q-mt-xl(
      :class="{ 'center-title': shouldShrink }"
    )
      q-avatar(size="xl", square, :class="{ 'q-ml-xs': !shouldShrink }")
        img(src="~assets/logo.svg")
      span.q-ml-sm Accept | Вход
    q-form.q-px-xl.q-pb-xl.q-pt-lg.column.q-gutter-y-sm(
      :class="{ 'full-form': shouldShrink, 'small-form': !shouldShrink }",
      @submit="onSubmit"
    )
      q-input(
        filled,
        v-model="login",
        label="Логин",
        lazy-rules,
        :rules="[(val) => (val && val.length > 0) || 'Пожалуйста, заполните поле']"
      )

      q-input(
        filled,
        v-model="password",
        label="Пароль",
        lazy-rules,
        :type="isPwd ? 'password' : 'text'",
        autocomplete="on",
        :rules="[(val) => (val && val.length > 0) || 'Пожалуйста, заполните поле']"
      )
        template(v-slot:append)
          q-icon.cursor-pointer(
            :name="isPwd ? 'visibility_off' : 'visibility'",
            @click="isPwd = !isPwd"
          )

      .column.q-gutter-y-md.q-pt-md
        q-btn.q-pa-md.text-body1(label="Войти", type="submit", color="primary")
        //- q-btn(label="WhoAmI", color="primary", @click="printInfo")
        //- q-btn(label="Log out", , @click="logout")

      .q-mt-md.text-body1.text-grey-10
        div
          | {{ 'Ещё нет аккаунта? ' }}
          a.register-ref(:href="`/#/form/registration?nextUrl=${toPath}`") Зарегистрироваться
        .q-mt-xs
          | {{ 'Вернуться на ' }}
          a.register-ref(href="/") главную страницу
</template>

<script>
import { defineComponent, ref } from "vue";

import { useQuasar } from "quasar";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";

const limitWidth = 570;
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
    if (
      q.screen.width < limitWidth ||
      (q.screen.width < limitWidthDependsHeight &&
        q.screen.height < limitWidthHeight)
    ) {
      shouldShrink.value = true;
    }

    const toPath = route.query.nextUrl || "/";
    return {
      q,
      store,
      router,
      route,
      login,
      password,

      shouldShrink,
      isPwd: ref(true),

      toPath,
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
    async onSubmit() {
      const User = {
        login: this.login.toString(),
        password: this.password.toString(),
      };
      const response = await this.store.dispatch("users/logIn", User);
      // console.log(response)
      if (response.status == 200) {
        this.router.push({ path: this.toPath });
        this.q.notify({
          color: "green-4",
          textColor: "white",
          message: "Вход выполнен",
        });
      } else {
        this.q.notify({
          type: "negative",
          message:
            response?.detail?.descriptionRU || response?.detail?.description ||
            `${response.status}: ${response.statusText}`,
          timeout: 8000,
        });
      }
    },
    onResize(size) {
      if (
        size.width < limitWidth ||
        (size.width < limitWidthDependsHeight && size.height < limitWidthHeight)
      ) {
        this.shouldShrink = true;
      } else {
        this.shouldShrink = false;
      }
    },
    // async logout() {
    //   let response = await this.store.dispatch("users/logOut");
    //   const toPath = this.route.query.nextUrl || "/login";
    //   this.router.push({ path: toPath });
    // },
    // async printInfo() {
    //   let response = await this.store.dispatch("users/viewMe");
    //   console.log(this.store.getters["users/stateUser"]);
    // },
  },
});
</script>
