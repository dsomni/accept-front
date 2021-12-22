<style lang="sass" src="./style.sass"></style>

<template lang="pug">
q-page
  q-dialog(v-model="openAddTagDialog")
    q-card.q-pa-sm.add-tag-dialog.dialog
      q-card-section.row.items-center
        .dialog-title Добавить Тег
        q-space
        q-btn(icon="close", flat, color="primary", round, dense, v-close-popup)

      q-card-section.q-pt-none
        q-input(
          label="Название",
          outline,
          autofocus,
          v-model="validator.addTagDialog.title.$model",
          @blur="validator.addTagDialog.title.$touch",
          :error-message="errorMsgTagTitle()",
          :error="!!validator.addTagDialog.title.$error"
        )

      q-card-actions(align="right")
        q-btn(
          flat,
          label="Добавить",
          color="primary",
          :disable="!!validator.addTagDialog.$invalid",
          @click="addTag"
        )
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
              :label="tag.title",
              removable,
              @remove="taskForm.tags.splice(index, 1)"
            )

        .selector-container.row.q-col-gutter-sm.fit
          q-select.col(
            ref="TagSelector",
            counter,
            use-input,
            v-model="taskForm.tags",
            transition-show="jump-up",
            transition-hide="jump-up",
            multiple,
            outlined,
            display-value="Теги",
            emit-value,
            :options="tagOptions",
            virtual-scroll-slice-size="2",
            @filter="tagFilter",
            input-debounce="300",
            dense
          )
            template(v-slot:option="scope")
              .row.q-gutter-x-xs
                q-item.col.wrap(v-bind="scope.itemProps")
                  q-item-section
                    q-item-label {{ scope.opt.title }}
                .row.items-center.q-pa-xs
                  q-btn(
                    size="0.7em",
                    color="primary",
                    flat,
                    round,
                    icon="edit",
                    @click="() => {}"
                  )
                  q-btn(
                    size="0.7em",
                    color="negative",
                    flat,
                    round,
                    icon="delete",
                    @click="confirmTagRemovalDialog(scope.label)"
                  )

          .col-1
            q-btn(
              round,
              flat,
              color="white",
              text-color="primary",
              icon="add",
              @click="openAddTagDialog = true"
            )
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
              :label="tag.title",
              :clickable="false"
            )
</template>


<script>
import { defineComponent, ref } from "vue";
import { useQuasar } from "quasar";
import { useStore } from "vuex";
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

// const tags = [
//   "алгоритмы",
//   "строки",
//   "массивы",
//   "qwer",
//   "qwert",
//   "qwerty",
//   "qwertyu",
//   "qwertyui",
// ];

export default defineComponent({
  name: "EduAddTask",
  components: { ckeditor: CKEditor.component },
  async mounted() {
    document.title = "Добавить задачу";
    await this.loadTags();
  },
  setup() {
    const validator = useVuelidate();
    const store = useStore();
    const q = useQuasar();

    let tags = ref([]);
    let tagOptions = ref([]);

    return {
      q,
      store,
      validator,

      tab: ref("editor"),
      // tab: ref("preview"),

      tags,
      tagOptions,

      openAddTagDialog: ref(false),
    };
  },
  data() {
    return {
      addTagDialog: ref({
        title: "",
      }),
      taskForm: ref({
        title: "Название Задачи",
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
      }),

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
    async loadTags() {
      let response = await this.store.dispatch("tags/getAllTags");
      if (response.status == 200) {
        this.tags = response.data.sort((a, b) =>
          a.title > b.title ? 1 : b.title > a.title ? -1 : 0
        );
      }
    },

    async confirmTagRemovalDialog(tag) {
      this.q
        .dialog({
          title: `Вы действительно хотите удалить тег "${tag.title}"?`,
          cancel: true,
          class: "dialog-stye",
          focus: "cancel",
          ok: {
            label: "Да",
            flat: true,
            color: "primary",
          },
          cancel: {
            label: "Отмена",
            flat: true,
            color: "negative",
          },
        })
        .onOk(async () => {
          this.$refs.TagSelector.hidePopup();
          await this.deleteTag(tag);
        })
        .onCancel(() => {});
    },

    tagFilter(val, update) {
      update(() => {
        if (val === "") {
          this.tagOptions = this.tags;
        } else {
          const options = {
            includeScore: true,
            keys: ["title"],
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
      const validContentRegExp = /^[0-9a-zA-ZА-ЯЁа-яё!*()-='№:?+.,<>` ]+$/;
      if (validContentRegExp.test(content)) {
        return true;
      }
      return false;
    },

    validateTagTitleSymbols(content) {
      const validContentRegExp = /^[0-9a-zA-ZА-ЯЁа-яё ]+$/;
      if (validContentRegExp.test(content)) {
        return true;
      }
      return false;
    },
    validateTagTitleUniqueness(title) {
      return !this.tags
        .map((item) => {
          return item.title.toLowerCase();
        })
        .includes(title.toLowerCase());
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

    errorMsgTagTitle() {
      if (this.validator.addTagDialog.title.required.$invalid) {
        return `Пожалуйста, заполните поле`;
      }
      if (this.validator.addTagDialog.title.minLength.$invalid) {
        return `Тег должен быть не короче ${this.validator.addTagDialog.title.minLength.$params.min} символов`;
      }
      if (this.validator.addTagDialog.title.maxLength.$invalid) {
        return `Тег должен быть не длиннее ${this.validator.addTagDialog.title.maxLength.$params.max} символов`;
      }
      if (this.validator.addTagDialog.title.regExpValidation.$invalid) {
        return `Используются недопустимые символы`;
      }
      if (this.validator.addTagDialog.title.uniquenessValidation.$invalid) {
        return `Похожий тег уже существует`;
      }
    },

    async addTag() {
      const Tag = {
        title: this.addTagDialog.title,
      };
      const response = await this.store.dispatch("tags/addTag", Tag);
      if (response.status == 200) {
        this.q.notify({
          color: "green-4",
          textColor: "white",
          message: "Тег успешно добавлен",
        });
        await this.loadTags();
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

    async updateTag() {
      const Tag = {
        title: this.addTagDialog.title,
      };
      const response = await this.store.dispatch("tags/addTag", Tag);
      if (response.status == 200) {
        this.q.notify({
          color: "green-4",
          textColor: "white",
          message: "Тег успешно добавлен",
        });
        await this.loadTags();
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

    async deleteTag(tag) {
      const response = await this.store.dispatch("tags/deleteTag", tag);
      if (response.status == 200) {
        this.q.notify({
          color: "green-4",
          textColor: "white",
          message: "Тег успешно удалён",
        });
        await this.loadTags();
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
  },
  validations() {
    return {
      addTagDialog: {
        title: {
          required,
          maxLength: maxLength(64),
          minLength: minLength(3),
          regExpValidation: this.validateTagTitleSymbols,
          uniquenessValidation: this.validateTagTitleUniqueness,
        },
      },

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
