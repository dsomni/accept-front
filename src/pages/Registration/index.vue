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
            autofocus,
            hint="Будет использован для входа в систему",
            :rules="[(val) => validateLogin(val)]"
          )

      q-step(:name="2", title="Пароль", icon="edit", :done="step > 2")
        .q-pa-none.text-h6.column.q-gutter-y-sm
          q-input(
            filled,
            v-model="password",
            label="Пароль",
            autofocus,
            lazy-rules,
            :type="isPwd ? 'password' : 'text'",
            autocomplete="on",
            :rules="[(val) => validatePassword(val)]"
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
            :type="r_isPwd ? 'password' : 'text'",
            autocomplete="on",
            :rules="[(val) => validateRPassword(val)]"
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
            autofocus,
            :rules="[(val) => validateName(val)]"
          )
          q-input(
            filled,
            v-model="email",
            label="Email",
            type="email",
            hint="Опционально",
            :rules="[(val) => validateEmail(val)]"
          )

      template(v-slot:navigation)
        q-stepper-navigation
          q-btn.q-pa-md.text-body1(
            no-caps,
            @click="step === 3 ? onSubmit() : $refs.stepper.next()",
            :color="isNextDisable() ? 'grey-6' : 'primary'",
            :disable="isNextDisable()",
            :loading="isLoading",
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
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";

const limitWidth = 570;
const limitWidthDependsHeight = 820;
const limitWidthHeight = 500;

const pwdRegExp = /^[0-9a-zA-Z!@#$%^&*]+$/;
const nameRegExp = /^[A-Za-zА-ЯЁа-яё ]*$/;
const emailRegExp =
  /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;

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

      shouldShrink,
      isPwd: ref(true),
      r_isPwd: ref(true),
      step: ref(1),
      isLoading: ref(false),

      step1check: ref(false),
      step21check: ref(false),
      step22check: ref(false),
      step31check: ref(false),
      step32check: ref(true),

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
    async validateLogin(val) {
      this.step1check = false;
      if (val) {
        if (val.length >= 5) {
          if (/^[0-9a-zA-Z]+$/.test(val)) {
            this.isLoading = true;
            const response = await this.store.dispatch("users/getUser", val);
            this.isLoading = false;
            if (response?.status == 404) {
              this.step1check = true;
              return true;
            } else if (response?.status == 200) {
              return "Такой логин уже занят";
            } else {
              return response?.statusText || "Ошибка сервера";
            }
          } else {
            return "Используйте только английские буквы и цифры";
          }
        } else {
          return "Логин должен быть длиннее 5 символов";
        }
      } else {
        return "Пожалуйста, заполните поле";
      }
    },
    validatePassword(val) {
      this.step21check = false;
      if (val) {
        if (val.length >= 5) {
          if (pwdRegExp.test(val)) {
            this.step21check = true;
            return true;
          } else {
            return "Пароль содержит недопустимые символы";
          }
        } else {
          return "Пароль должен быть длиннее 5 символов";
        }
      } else {
        return "Пожалуйста, заполните поле";
      }
    },
    validateRPassword(val) {
      this.step22check = false;
      if (val) {
        if (val == this.password) {
          this.step22check = true;
          return true;
        } else {
          return "Пароли не совпадают";
        }
      } else {
        return "Пожалуйста, заполните поле";
      }
    },
    validateName(val) {
      this.step31check = false;
      if (val) {
        if (nameRegExp.test(val)) {
          this.step31check = true;
          return true;
        } else {
          return "Используются недопустимые символы";
        }
      } else {
        return "Пожалуйста, заполните поле";
      }
    },
    validateEmail(val) {
      this.step32check = false;
      if (!!!val || emailRegExp.test(val)) {
        this.step32check = true;
        return true;
      } else {
        return "Неверный формат";
      }
    },
    isNextDisable() {
      if (
        (this.step == 1 && this.step1check) ||
        (this.step == 2 && this.step21check && this.step22check) ||
        (this.step == 3 &&
          this.step31check &&
          this.step32check &&
          this.step1check &&
          this.step21check &&
          this.step22check)
      ) {
        return false;
      }
      return true;
    },
    async onSubmit() {
      const User = {
        login: this.login.toString().trim(),
        password: this.password.toString().trim(),
        name: this.name.toString().trim(),
        email: this.email?.toString().trim() || "",
      };
      const response = await this.store.dispatch("users/register", User);
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
