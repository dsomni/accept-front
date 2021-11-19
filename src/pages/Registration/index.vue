<style lang="sass" src="./style.sass"></style>

<template lang="pug">
q-page.flex.justify-center.items-center
  q-resize-observer(@resize="onResize")
  .q-px-xl(
    :class="{ 'full-window': shouldShrink, 'small-window': !shouldShrink }"
  )
    .text-grey-10.text-h4.text-weight-regular.q-mt-xl.q-mb-md.wrap(
      :class="{ 'center-title': shouldShrink }"
    )
      q-avatar(size="xl", square, :class="{ 'q-ml-xs': !shouldShrink }")
        img(src="~assets/logo.svg")
      span.q-ml-sm Accept |
      span.q-ml-sm Регистрация

    q-stepper.transparent.text-grey-10(
      v-model="step",
      ref="stepper",
      animated,
      flat,
      done-color="primary",
      active-color="accent",
      inactive-color="secondary",
      :vertical="shouldShrink"
    )
      q-step(:name="1", title="Логин", icon="edit", :done="step > 1")
        .q-pa-none.text-h6.column.q-gutter-y-sm
          q-input(
            filled,
            v-model="login",
            label="Логин",
            hint="Будет использован для входа в систему",
            lazy-rules,
            :rules="[(val) => (val && val.length > 0) || 'Пожалуйста, заполните поле']"
          )

      q-step(:name="2", title="Пароль", icon="edit", :done="step > 2")
        .q-pa-none.text-h6.column.q-gutter-y-sm
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
          q-input(
            filled,
            v-model="r_password",
            label="Повторите пароль",
            lazy-rules,
            :type="r_isPwd ? 'password' : 'text'",
            autocomplete="on",
            :rules="[(val) => (val && val.length > 0) || 'Пожалуйста, заполните поле']"
          )
            template(v-slot:append)
              q-icon.cursor-pointer(
                :name="r_isPwd ? 'visibility_off' : 'visibility'",
                @click="r_isPwd = !r_isPwd"
              )

      q-step(:name="3", title="Другое", , icon="edit")
        .q-pa-none.text-h6.column.q-gutter-y-sm
          q-input(
            filled,
            v-model="name",
            label="ФИО",
            type="text",
            hint="Будет отображаться в системе рейтинга",
            lazy-rules,
            :rules="[(val) => (val && val.length > 0) || 'Пожалуйста, заполните поле']"
          )
          q-input(
            filled,
            v-model="name",
            label="Email",
            type="email",
            hint="Опционально",
            lazy-rules,
            :rules="[(val) => (val && val.length > 0) || 'Пожалуйста, заполните поле']"
          )
          q-checkbox.text-body1(
            v-model="shouldNotify",
            label="Получать уведомления на Email",
            color="primary"
          )

      template(v-slot:navigation)
        q-stepper-navigation
          q-btn.q-pa-md.text-body1(
            no-caps,
            @click="$refs.stepper.next()",
            color="primary",
            :label="step === 3 ? 'Зарегистрироваться' : 'Продолжить'"
          )
          q-btn.q-pa-md.q-ml-sm(
            v-if="step > 1",
            flat,
            color="primary",
            @click="$refs.stepper.previous()",
            label="Назад"
          )

    .q-pa-md.q-pb-xl.text-body1.text-grey-10
      div
        | {{ 'Уже есть аккаунт? ' }}
        a.login-ref(:href="`/#/form/login?nextUrl=${toPath}`") Войти
      .q-mt-xs
        | {{ 'Вернуться на ' }}
        a.login-ref(href="/") главную страницу
</template>

<script>
import { defineComponent, ref } from "vue";

import { useQuasar } from "quasar";
import { useStore, mapActions } from "vuex";
import { useRouter, useRoute } from "vue-router";

const limitWidth = 570;
const limitWidthDependsHeight = 820;
const limitWidthHeight = 500;

export default defineComponent({
  name: "Registration",
  setup() {
    const q = useQuasar();
    const store = useStore();
    const router = useRouter();
    const route = useRoute();

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

      login: ref(null),
      password: ref(null),
      r_password: ref(null),
      name: ref(null),
      email: ref(null),
      shouldNotify: ref(false),

      shouldShrink,
      isPwd: ref(true),
      r_isPwd: ref(true),
      step: ref(1),

      toPath,
    };
  },
  computed: {
    isLoggedIn: function () {
      return this.store.getters["users/isAuthenticated"];
    },
  },
  mounted() {
    document.title = "Registration | Accept";
  },
  methods: {
    async onSubmit() {
      const User = {
        login: this.login.toString(),
        password: this.password.toString(),
      };
      const response = await this.store.dispatch("users/logIn", User);
      if (response.status == 200) {
        const toPath = this.route.query.nextUrl || "/";
        this.router.push({ path: toPath });
        this.q.notify({
          color: "green-4",
          textColor: "white",
          message: response.data?.detail || "Successfully",
        });
      } else {
        this.q.notify({
          type: "negative",
          message:
            response.data?.detail ||
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
