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
            v-model="validator.form.loginForm.login.$model",
            label="Логин",
            autofocus,
            hint="Будет использован для входа в систему",
            :error-message="errorMsgLogin()",
            :error="!!validator.form.loginForm.login.$error"
          )

      q-step(:name="2", title="Пароль", icon="edit", :done="step > 2")
        .q-pa-none.text-h6.column.q-gutter-y-sm
          q-input(
            filled,
            v-model="validator.form.passwordForm.password.$model",
            label="Пароль",
            autofocus,
            :type="isPwd ? 'password' : 'text'",
            autocomplete="on",
            :error-message="errorMsgPassword()",
            :error="!!validator.form.passwordForm.password.$error"
          )
            template(v-slot:append)
              q-icon.cursor-pointer(
                :name="isPwd ? 'visibility_off' : 'visibility'",
                @click="isPwd = !isPwd"
              )

          q-input(
            filled,
            v-model="validator.form.passwordForm.confirmPassword.$model",
            label="Повторите пароль",
            :type="confirm_isPwd ? 'password' : 'text'",
            autocomplete="on",
            :error-message="errorMsgConfirmPassword()",
            :error="!!validator.form.passwordForm.confirmPassword.$error"
          )
            template(v-slot:append)
              q-icon.cursor-pointer(
                :name="confirm_isPwd ? 'visibility_off' : 'visibility'",
                @click="confirm_isPwd = !confirm_isPwd"
              )

      q-step(:name="3", title="Другое", , icon="edit")
        .q-pa-none.text-h6.column.q-gutter-y-sm
          q-input(
            filled,
            v-model="validator.form.infoForm.name.$model",
            label="ФИО",
            type="text",
            autofocus,
            :error-message="errorMsgName()",
            :error="!!validator.form.infoForm.name.$error"
          )
          q-input(
            filled,
            v-model="validator.form.infoForm.email.$model",
            label="Email",
            type="email",
            hint="Опционально",
            :error-message="errorMsgEmail()",
            :error="!!validator.form.infoForm.email.$error"
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

import useVuelidate from "@vuelidate/core";
import { required, sameAs, minLength, email, helpers } from "@vuelidate/validators";

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
    const validator = useVuelidate();

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
      validator,

      shouldShrink,

      isPwd: ref(true),
      confirm_isPwd: ref(true),
      step: ref(1),
      isLoading: ref(false),

      toPath,
    };
  },
  data() {
    return {
      form: {
        loginForm: {
          login: "",
        },
        passwordForm: {
          password: "",
          confirmPassword: "",
        },
        infoForm: {
          name: "",
          email: "",
        },
      },
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
    async validateLoginUniqueness(login) {
      this.isLoading = true;
      const response = await this.store.dispatch("users/getUser", login);
      this.isLoading = false;
      if (response.status == 404) {
        return true;
      }
      return false;
    },

    validateLoginSymbols(login) {
      const validLoginRegExp = /^[0-9a-zA-Z]+$/;
      if (validLoginRegExp.test(login)) {
        return true;
      }
      return false;
    },

    validatePasswordSymbols(password) {
      const validPasswordRegExp = /^[0-9a-zA-Z!@#$%^&*]+$/;
      if (validPasswordRegExp.test(password)) {
        return true;
      }
      return false;
    },

    validateNameSymbols(name) {
      const validNameRegExp = /^[A-Za-zА-ЯЁа-яё ]*$/;
      if (validNameRegExp.test(name)) {
        return true;
      }
      return false;
    },

    errorMsgLogin() {
      if (this.validator.form.loginForm.login.required.$invalid) {
        return `Пожалуйста, заполните поле`;
      }
      if (this.validator.form.loginForm.login.minLength.$invalid) {
        return `Логин должен быть не короче ${this.validator.form.loginForm.login.minLength.$params.min} символов`;
      }
      if (this.validator.form.loginForm.login.regExpValidation.$invalid) {
        return `Используются недопустимые символы`;
      }
      if (this.validator.form.loginForm.login.isUnique.$invalid) {
        return `Такой логин уже занят`;
      }
    },

    errorMsgPassword() {
      if (this.validator.form.passwordForm.password.required.$invalid) {
        return `Пожалуйста, заполните поле`;
      }
      if (this.validator.form.passwordForm.password.minLength.$invalid) {
        return `Пароль должен быть не короче ${this.validator.form.loginForm.login.minLength.$params.min} символов`;
      }

      if (this.validator.form.passwordForm.password.regExpValidation.$invalid) {
        return `Используются недопустимые символы`;
      }
    },

    errorMsgConfirmPassword() {
      if (this.validator.form.passwordForm.confirmPassword.required.$invalid) {
        return `Пожалуйста, заполните поле`;
      }
      if (
        this.validator.form.passwordForm.confirmPassword.sameAsPassword.$invalid
      ) {
        return `Пароли не совпадают`;
      }
    },

    errorMsgName() {
      if (this.validator.form.infoForm.name.required.$invalid) {
        return `Пожалуйста, заполните поле`;
      }
      if (this.validator.form.infoForm.name.regExpValidation.$invalid) {
        return `Используются недопустимые символы`;
      }
    },

    errorMsgEmail() {
      if (this.validator.form.infoForm.email.email.$invalid) {
        return `Некорректный формат`;
      }
    },

    isNextDisable() {
      if (
        (this.step == 1 && !this.validator.form.loginForm.$invalid) ||
        (this.step == 2 && !this.validator.form.passwordForm.$invalid) ||
        (this.step == 3 && !this.validator.form.$invalid)
      ) {
        return false;
      }
      return true;
    },

    async onSubmit() {
      const User = {
        login: this.form.loginForm.login.toString().trim(),
        password: this.form.passwordForm.password.toString().trim(),
        name: this.form.infoForm.name.toString().trim(),
        email: this.form.infoForm.email?.toString().trim() || null,
      };
      const response = await this.store.dispatch("users/register", User);
      if (response.status == 200) {
        const toPath = this.route.query.nextUrl || "/";
        this.router.push({ path: toPath });
        this.q.notify({
          color: "green-9",
          textColor: "white",
          message: "Вы успешно зарегистрированы",
        });
      } else {
        this.q.notify({
          type: "negative",
          message:
            response?.detail?.descriptionRU ||
            response?.detail?.description ||
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
  },
  validations() {
    return {
      form: {
        loginForm: {
          login: {
            required,
            minLength: minLength(5),
            regExpValidation: this.validateLoginSymbols,
            isUnique: helpers.withAsync(this.validateLoginUniqueness)
          },
        },
        passwordForm: {
          password: {
            required,
            minLength: minLength(5),
            regExpValidation: this.validatePasswordSymbols,
          },
          confirmPassword: {
            required,
            sameAsPassword: sameAs(this.form.passwordForm.password),
          },
        },
        infoForm: {
          name: {
            required,
            regExpValidation: this.validateNameSymbols,
          },
          email: {
            email,
          },
        },
      },
    };
  },
});
</script>
