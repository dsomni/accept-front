<style lang="sass" src="./style.sass"></style>

<template lang="pug">
q-page
  q-tabs.q-ma-sm.bg-white(
    v-model="tab",
    active-color="primary",
    indicator-color="primary",
    align="justify",

  )
    q-tab(name="editor", label="Редактирование")
    q-tab(name="preview", label="Просмотр")
  q-separator

  q-tab-panels(v-model="tab", animated, keep-alive)
    q-tab-panel(name="editor")
      .editor-container
        //- ckeditor(:editor="editor", v-model="editorData", :config="editorConfig")

    q-tab-panel(name="preview")
      .preview-container
        //- div(v-html="editorData")
</template>


<script>
import { defineComponent, ref } from "vue";
import { useQuasar } from "quasar";
import CKEditor from "@ckeditor/ckeditor5-vue";
import CustomEditor from "@dsomni/ckeditor5-custom-build-full/build/ckeditor";

import useVuelidate from "@vuelidate/core";
import {
  required,
  minLength,
  helpers,
  maxLength,
  between,
  numeric,
} from "@vuelidate/validators";

const CONFIGS = require("../../../../configs.js");

const limitWidth = 600;

export default defineComponent({
  name: "EduAddTask",
  components: { ckeditor: CKEditor.component },
  mounted() {
    document.title = "Добавить задачу";
  },
  setup() {
    const validator = useVuelidate();
    return {
      tab: ref("editor"),
    };
  },
  data() {
    return {
      taskForm: {
        tittle: "",
        tags: [],
        grade: "",
        description: "",
        author: "",

        inputFormat: "",
        outputFormat: "",

        hint: {
          content: "",
          timerType: "",
          timer: "",
        },
      },

      editor: CustomEditor,
      editorConfig: {
        simpleUpload: {
          uploadUrl: CONFIGS.serverURL + CONFIGS.urls.uploadImg,

          withCredentials: true,
        },
      },
    };
  },
  methods: {
    validateDefaultSymbols(content) {
      const validContentRegExp =
        /^[0-9a-zA-ZА-ЯЁа-яё!@#$%^*()-="№:?_+.,<>~ ]+$/;
      if (validContentRegExp.test(content)) {
        return true;
      }
      return false;
    },
  },
  validations() {
    return {
      taskForm: {
        title: {
          required,
          maxLength: maxLength(255),
          regExpValidation: this.validateDefaultSymbols,
          // isUnique: helpers.withAsync(this.validateTitleUniqueness),
        },
        grade: {
          required,
          numeric,
          between: between(1, 11),
        },
        description: {
          required,
          maxLength: maxLength(10000),
        },
        inputFormat: {
          required,
          maxLength: maxLength(10000),
          regExpValidation: this.validateDefaultSymbols,
        },
        outputFormat: {
          required,
          maxLength: maxLength(10000),
          regExpValidation: this.validateDefaultSymbols,
        },

        hint: {
          content: {
            maxLength: maxLength(1000),
            regExpValidation: this.validateDefaultSymbols,
          },
          // timer:{
          //   minValue: minValue(1)
          // }
        },
      },
    };
  },
});
</script>
