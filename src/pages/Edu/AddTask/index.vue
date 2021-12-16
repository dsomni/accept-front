<style lang="sass" src="./style.sass"></style>

<template lang="pug">
q-page
  q-tabs.q-ma-sm.bg-white(
    v-model="tab",
    active-color="primary",
    indicator-color="primary",
    align="justify"
  )
    q-tab(name="editor", label="Редактирование")
    q-tab(name="preview", label="Просмотр")
  q-separator

  q-tab-panels(v-model="tab")
    q-tab-panel(name="editor")
      .editor-container
        q-input.line-input(
          label="Название",
          outline,
          counter,
          autogrow,
          v-model="validator.taskForm.title.$model",
          @blur="validator.taskForm.title.$touch",
          :error-message="errorMsgTitle()",
          :error="!!validator.taskForm.title.$error"
        )

        .tags-editor-container
          template(v-for="(tag, index) in taskForm.tags", :key="index")
            q-chip(
              outline,
              color="primary",
              text-color="white",
              :label="tag",
              removable,
              @remove="taskForm.tags.splice(index, 1)"
            )

        .selector-container.row.q-col-gutter-sm.fit
          q-select.col(
            counter,
            use-input,
            v-model="taskForm.tags",
            transition-show="jump-up",
            transition-hide="jump-up",
            multiple,
            outlined,
            display-value="Теги",
            emit-value,
            map-options,
            virtual-scroll-slice-size="2",
            :options="tagOptions",
            option-value="name",
            @filter="tagFilter",
            input-debounce="300",
            dense
          )
            template(v-if="taskForm.tags.length > 0", v-slot:append)
                q-icon.cursor-pointer(
                  name="clear",
                  color="primary",
                  @click.stop="taskForm.tags = []"
                )
          .col-1
            q-btn(round, flat, color="white", text-color="primary", icon="add")
        //- ckeditor(:editor="editor", v-model="editorData", :config="editorConfig")

    q-tab-panel(name="preview")
      .preview-container
        .title {{ taskForm.title }}
        .tags
          template(v-for="(tag, index) in taskForm.tags", :key="index")
            q-chip(
              outline,
              color="black",
              text-color="white",
              :label="tag",
              :clickable="false"
            )
</template>


<script>
import { defineComponent, ref } from "vue";
import { useQuasar } from "quasar";
import Fuse from "fuse.js";
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

const tags = [
  "алгоритмы",
  "строки",
  "массивы",
  "qwer",
  "qwert",
  "qwerty",
  "qwertyu",
  "qwertyui",
];

export default defineComponent({
  name: "EduAddTask",
  components: { ckeditor: CKEditor.component },
  mounted() {
    document.title = "Добавить задачу";
  },
  setup() {
    const validator = useVuelidate();
    return {
      validator,

      tab: ref("editor"),
      // tab: ref("preview"),

      tags,
      tagOptions: ref(tags),
    };
  },
  data() {
    return {
      taskForm: {
        title: "Название Задачи",
        tags: ["алгоритмы", "строки", "массивы"],
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
    tagFilter(val, update) {
      update(() => {
        if (val === "") {
          this.tagOptions = this.tags;
        } else {
          const options = {
            includeScore: true,
          };
          const fuse = new Fuse(this.tags, options);
          this.tagOptions = fuse.search(val.toLowerCase()).map((obj) => {
            return obj.item;
          });
        }
      });
    },

    validateDefaultSymbols(content) {
      const validContentRegExp =
        /^[0-9a-zA-ZА-ЯЁа-яё!@#$%^*()-="№:?_+.,<>~\\` ]+$/;
      if (validContentRegExp.test(content)) {
        return true;
      }
      return false;
    },

    validateTitleSymbols(content) {
      const validContentRegExp = /^[0-9a-zA-ZА-ЯЁа-яё!*()-="№:?+.,<>` ]+$/;
      if (validContentRegExp.test(content)) {
        return true;
      }
      return false;
    },

    errorMsgTitle() {
      if (this.validator.taskForm.title.required.$invalid) {
        return `Пожалуйста, заполните поле`;
      }
      if (this.validator.taskForm.title.maxLength.$invalid) {
        return `Название должно быть не длиннее ${this.validator.taskForm.title.maxLength.$params.max} символов`;
      }
      if (this.validator.taskForm.title.regExpValidation.$invalid) {
        return `Используются недопустимые символы`;
      }
      // if (this.validator.taskForm.title.required.$invalid) {
      //   return `Такой логин уже занят`;
      // }
    },
  },
  validations() {
    return {
      taskForm: {
        title: {
          required,
          maxLength: maxLength(255),
          minLength: minLength(1),
          regExpValidation: this.validateTitleSymbols,
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
