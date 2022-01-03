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
          :error-message="errorMsgTagTitleAdd()",
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

  q-dialog(v-model="openEditTagDialog")
    q-card.q-pa-sm.add-tag-dialog.dialog
      q-card-section.row.items-center
        .dialog-title Редактировать Тег
        q-space
        q-btn(icon="close", flat, color="primary", round, dense, v-close-popup)

      q-card-section.q-pt-none
        q-input(
          label="Название",
          outline,
          autofocus,
          v-model="validator.editTagDialog.title.$model",
          @blur="validator.editTagDialog.title.$touch",
          :error-message="errorMsgTagTitleEdit()",
          :error="!!validator.editTagDialog.title.$error"
        )

      q-card-actions(align="right")
        q-btn(
          flat,
          label="Сохранить",
          color="primary",
          :disable="!!validator.editTagDialog.$invalid",
          @click="async () => { await updateTag(); openEditTagDialog = false; }"
        )

  q-dialog(v-model="openHintDialog")
    q-card.q-pa-sm.hint-dialog.dialog
      q-card-section
        .dialog-title.text-primary Подсказка

      q-card-section.q-pt-none.scroll.hint-content-section(v-html="taskForm.hint.content", style="max-height: 60vh")
      q-card-actions(align="right")
        q-btn(
          flat,
          label="Скрыть",
          color="primary",
          @click="async () => { openHintDialog = false; }"
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
    q-tab-panel(name="editor", style="overflow: hidden")
      .editor-container.q-gutter-xl(
        :class="{ row: q.screen.width >= limitWidth }"
      )
        .col
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
                      @click="() => { setupEditTagDialog(scope.opt); openEditTagDialog = true; }"
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
                text-color="secondary",
                icon="add",
                @click="openAddTagDialog = true"
              )

          .grade-container
            q-input.grade-input(
              label="Класс",
              outline,
              v-model="validator.taskForm.grade.$model",
              @blur="validator.taskForm.grade.$touch",
              :error-message="errorMsgGrade()",
              :error="!!validator.taskForm.grade.$error"
            )
          .description-container
            .row
              .field-title(
                :class="{ 'field-title-error': !!validator.taskForm.description.$error }"
              ) Описание
              q-space
              q-icon.text-negative(
                v-if="!!validator.taskForm.description.$error",
                style="font-size: 1.75em",
                text-color="negative",
                name="error"
              )
            ckeditor(
              :editor="editor",
              v-model="validator.taskForm.description.$model",
              :config="editorConfig"
            )
            .field-error.text-negative(
              v-if="!!validator.taskForm.description.$error"
            ) {{ errorMsgDescription() }}
          .inputFormat-container
            .row
              .field-title(
                :class="{ 'field-title-error': !!validator.taskForm.inputFormat.$error }"
              ) Входные данные
              q-space
              q-icon.text-negative(
                v-if="!!validator.taskForm.inputFormat.$error",
                style="font-size: 1.75em",
                text-color="negative",
                name="error"
              )
            ckeditor(
              :editor="editor",
              v-model="validator.taskForm.inputFormat.$model",
              :config="editorConfig"
            )
            .field-error.text-negative(
              v-if="!!validator.taskForm.inputFormat.$error"
            ) {{ errorMsgInputFormat() }}

          .outputFormat-container
            .row
              .field-title(
                :class="{ 'field-title-error': !!validator.taskForm.outputFormat.$error }"
              ) Выходные данные
              q-space
              q-icon.text-negative(
                v-if="!!validator.taskForm.outputFormat.$error",
                style="font-size: 1.75em",
                text-color="negative",
                name="error"
              )
            ckeditor(
              :editor="editor",
              v-model="validator.taskForm.outputFormat.$model",
              :config="editorConfig"
            )
            .field-error.text-negative(
              v-if="!!validator.taskForm.outputFormat.$error"
            ) {{ errorMsgOutputFormat() }}

        .col-6
          .examples-container
            .field-title Примеры
            template(
              v-for="(example, index) in taskForm.examples",
              :key="index"
            )
              .row.q-gutter-x-xs.items-center
                .example-main-title {{ 'Пример #' + (index + 1) }}
                q-btn(
                  size="0.8em",
                  color="negative",
                  flat,
                  round,
                  icon="delete",
                  @click="() => { taskForm.examples.splice(index, 1); }"
                )
              .example-container
                .example-small-title Входные данные
                q-input.example-input(
                  outline,
                  autogrow,
                  v-model="taskForm.examples[index].inputData",
                  error-message="Пожалуйста, заполните поле!",
                  :error="!!!taskForm.examples[index].inputData"
                )
                .example-small-title Выходные данные
                q-input.example-input(
                  outline,
                  autogrow,
                  v-model="taskForm.examples[index].outputData",
                  error-message="Пожалуйста, заполните поле!",
                  :error="!!!taskForm.examples[index].outputData"
                )
            q-btn.example-add-btn(
              outline,
              size="1em",
              color="secondary",
              icon="add",
              @click="() => { taskForm.examples.push({ inputData: '', outputData: '' }); }"
            )

          .remark-container
            .row
              .field-title(
                :class="{ 'field-title-error': !!validator.taskForm.remark.$error }"
              ) Примечание
              q-space
              q-icon.text-negative(
                v-if="!!validator.taskForm.remark.$error",
                style="font-size: 1.75em",
                text-color="negative",
                name="error"
              )
            ckeditor(
              :editor="editor",
              v-model="validator.taskForm.remark.$model",
              :config="editorConfig"
            )
            .field-error.text-negative(
              v-if="!!validator.taskForm.remark.$error"
            ) {{ errorMsgRemark() }}

          .hint-container
            .row
              .field-title(
                :class="{ 'field-title-error': !!validator.taskForm.hint.content.$error }"
              ) Подсказка
              q-space
              q-icon.text-negative(
                v-if="!!validator.taskForm.hint.content.$error",
                style="font-size: 1.75em",
                text-color="negative",
                name="error"
              )
            ckeditor(
              :editor="editor",
              v-model="validator.taskForm.hint.content.$model",
              :config="editorConfig"
            )
            .field-error.text-negative(
              v-if="!!validator.taskForm.hint.content.$error"
            ) {{ errorMsgHintContent() }}
            q-input.hint-alarm-input(
              label="Показывать через",
              suffix="попыток"
              outline,
              :disable="!!!taskForm.hint.content.length"
              autogrow,
              v-model="validator.taskForm.hint.alarm.$model",
              @blur="validator.taskForm.hint.alarm.$touch",
              :error-message="errorMsgHintAlarm()",
              :error="!!validator.taskForm.hint.alarm.$error"
            )

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
        .credentials
          .author {{ 'Автор: ' + taskForm.author }}
          .grade {{ 'Класс: ' + taskForm.grade }}
        .description(v-html="taskForm.description")
        .inputFormat
          .inputFormat-title.text-primary Входные данные
          .inputFormat-content(v-html="taskForm.inputFormat")
        .outputFormat
          .outputFormat-title.text-primary Выходные данные
          .outputFormat-content(v-html="taskForm.outputFormat")
        .examples(v-if="taskForm.examples.length > 0")
          .example-title.text-primary Примеры
          template(v-for="(example, index) in taskForm.examples", :key="index")
            .example-pair
              q-markup-table(
                separator="horizontal",
                flat,
                bordered,
                style="margin-bottom: 0.5em; border-color: #5e5e5e"
              )
                thead
                  tr
                    th(
                      style="text-align: left; font-size: 0.8em; border-color: #5e5e5e"
                    )
                      .row.justify-between.items-center
                        div Входные данные
                        q-btn(
                          size="0.75em",
                          flat,
                          color="secondary",
                          icon="content_copy",
                          @click="() => { copyText(taskForm.examples[index].inputData); }"
                        )

                tbody(
                  style="background: white !important; border-color: #5e5e5e"
                )
                  tr.example-row.bg-blue-grey-1
                    td(
                      style="white-space: pre-wrap; word-wrap: break-word; font-size: 0.65em"
                    ) {{ taskForm.examples[index].inputData }}

              q-markup-table(
                separator="horizontal",
                flat,
                bordered,
                style="border-color: #5e5e5e"
              )
                thead
                  tr
                    th(
                      style="text-align: left; font-size: 0.8em; border-color: #5e5e5e"
                    )
                      .row.justify-between.items-center
                        div Выходные данные
                        q-btn(
                          size="0.75em",
                          flat,
                          color="secondary",
                          icon="content_copy",
                          @click="() => { copyText(taskForm.examples[index].outputData); }"
                        )
                tbody
                  tr.example-row.bg-blue-grey-1
                    td(
                      style="white-space: pre-wrap; word-wrap: break-word; border-color: #5e5e5e; font-size: 0.65em"
                    ) {{ taskForm.examples[index].outputData }}

        .remark(v-if="!!taskForm.remark")
          .remark-title.text-primary Примечание
          .remark-content(v-html="taskForm.remark")
      q-page-sticky(
        v-if='taskForm.hint.content.length > 0'
        position="bottom-right",
        :offset="q.screen.gt.xs ? [36, 36] : [18, 18]"
      )
        q-btn(
          :fab="q.screen.gt.xs",
          fab-mini,
          icon="visibility",
          color="accent",
          @click="()=>{ openHintDialog = true;}"
      )
</template>


<script>
import { defineComponent, ref } from "vue";
import { useQuasar, copyToClipboard } from "quasar";
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
  minValue,
  requiredIf,
} from "@vuelidate/validators";

const CONFIGS = require("../../../../configs.js");

const limitWidth = 900;

export default defineComponent({
  name: "EduAddTask",
  components: { ckeditor: CKEditor.component },
  async mounted() {
    document.title = "Добавить задачу";
    await this.loadTags();
    this.setupAuthor();
    this.validator.taskForm.$touch();
  },
  setup() {
    const validator = useVuelidate();
    const store = useStore();
    const q = useQuasar();

    let tags = ref([]);
    let tagOptions = ref([]);

    return {
      limitWidth,

      q,
      store,
      validator,

      tab: ref("editor"),
      // tab: ref("preview"),

      tags,
      tagOptions,

      openAddTagDialog: ref(false),
      openEditTagDialog: ref(false),
      openHintDialog: ref(false),
    };
  },
  data() {
    return {
      addTagDialog: ref({
        title: "",
      }),
      editTagDialog: ref({
        oldTitle: "",
        title: "",
        spec: "",
      }),
      taskForm: ref({
        title: "Название Задачи",
        tags: [
          { title: "Заглушка1" },
          { title: "Заглушка2" },
          { title: "Заглушка3" },
        ],
        grade: "11",
        description: `<p>${"safdsf dsfssafdsf dsfs ".repeat(30)}</p>`,
        author: "",

        inputFormat: `<p>${"safds fdsf ss afd sfdsfs ".repeat(15)}</p>`,
        outputFormat: `<p>${"safdsf dsfssa fdsfd sfs ".repeat(15)}</p>`,
        remark: `<p>${"safdsfdsf ssafdsf ds fs ".repeat(15)}</p>`,

        examples: [
          {
            inputData: `1`,
            outputData: `2`,
          },
          {
            inputData: `00005`,
            outputData: `2\n465`,
          },
        ],

        hint: {
          content: `<p>${"фффф вввв гггг ее ".repeat(30) }</p>`,
          alarmType: "attempts",
          alarm: "1",
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
    setupAuthor() {
      this.taskForm.author = this.store.getters["users/shortName"];
    },
    setupEditTagDialog(tag) {
      this.editTagDialog.spec = tag.spec;
      this.editTagDialog.oldTitle = tag.title;
      this.editTagDialog.title = tag.title;
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

    // shrinkAuthor(author) {
    //   let info = author.split(' ');
    //   let reduced = '';
    //   let j = 0;
    //   for (j = 0; j < info.length; j++) {
    //     const element = info[j];
    //     if (!!info[j]){
    //       reduced = element;
    //       break;
    //     }
    //   }
    //   for (let i = j+1; i < info.length; i++) {
    //     const element = info[i];
    //     if (!!info[i]){
    //       reduced += ' ' + element[0] + '.'
    //     }
    //   }
    //   return reduced;
    // },

    copyText(text) {
      copyToClipboard(text)
        .then(() => {
          this.q.notify({
            color: "green-9",
            textColor: "white",
            message: "Скопировано в буфер обмена",
          });
        })
        .catch(() => {
          this.q.notify({
            color: "negative",
            message: "Ошибка при копировании в буфер обмена",
          });
        });
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
    validateTagTitleAddUniqueness(title) {
      return !this.tags
        .map((item) => {
          return item.title.toLowerCase();
        })
        .includes(title.toLowerCase());
    },

    validateTagTitleEditUniqueness(title) {
      return !this.tags
        .map((item) => {
          if (item.title == this.editTagDialog.oldTitle) return;
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

    errorMsgTagTitleAdd() {
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

    errorMsgTagTitleEdit() {
      if (this.validator.editTagDialog.title.required.$invalid) {
        return `Пожалуйста, заполните поле`;
      }
      if (this.validator.editTagDialog.title.minLength.$invalid) {
        return `Тег должен быть не короче ${this.validator.addTagDialog.title.minLength.$params.min} символов`;
      }
      if (this.validator.editTagDialog.title.maxLength.$invalid) {
        return `Тег должен быть не длиннее ${this.validator.addTagDialog.title.maxLength.$params.max} символов`;
      }
      if (this.validator.editTagDialog.title.regExpValidation.$invalid) {
        return `Используются недопустимые символы`;
      }
      if (this.validator.editTagDialog.title.uniquenessValidation.$invalid) {
        return `Похожий тег уже существует`;
      }
    },

    errorMsgDescription() {
      if (this.validator.taskForm.description.required.$invalid) {
        return `Пожалуйста, заполните поле`;
      }
      if (this.validator.taskForm.description.maxLength.$invalid) {
        return `Превышено допустимое количество символов`;
      }
    },
    errorMsgInputFormat() {
      if (this.validator.taskForm.inputFormat.required.$invalid) {
        return `Пожалуйста, заполните поле`;
      }
      if (this.validator.taskForm.inputFormat.maxLength.$invalid) {
        return `Превышено допустимое количество символов`;
      }
    },
    errorMsgOutputFormat() {
      if (this.validator.taskForm.outputFormat.required.$invalid) {
        return `Пожалуйста, заполните поле`;
      }
      if (this.validator.taskForm.outputFormat.maxLength.$invalid) {
        return `Превышено допустимое количество символов`;
      }
    },

    errorMsgRemark() {
      if (this.validator.taskForm.remark.maxLength.$invalid) {
        return `Превышено допустимое количество символов`;
      }
    },

    errorMsgGrade() {
      if (this.validator.taskForm.grade.required.$invalid) {
        return `Пожалуйста, заполните поле`;
      }
      if (this.validator.taskForm.grade.numeric.$invalid) {
        return `Класс должен быть числом`;
      }
      if (this.validator.taskForm.grade.between.$invalid) {
        let l = this.validator.taskForm.grade.between.$params.min;
        let h = this.validator.taskForm.grade.between.$params.max;
        return `Значение класса должно быть между ${l} и ${h}`;
      }
    },

    errorMsgHintContent() {
      if (this.validator.taskForm.hint.content.maxLength.$invalid) {
        return `Превышено допустимое количество символов`;
      }
    },

    errorMsgHintAlarm() {
      if (this.validator.taskForm.hint.alarm.required.$invalid) {
        return `Пожалуйста, заполните поле`;
      }
      if (this.validator.taskForm.hint.alarm.numeric.$invalid) {
        return `Значение должно быть числом`;
      }
      if (this.validator.taskForm.hint.alarm.minValue.$invalid) {
        console.log(this.validator.taskForm.hint.alarm.minValue);
        return `Минимальное значение - `;
      }
    },

    async addTag() {
      this.$refs.TagSelector.hidePopup();
      const Tag = {
        title: this.addTagDialog.title,
      };
      const response = await this.store.dispatch("tags/addTag", Tag);
      if (response.status == 200) {
        this.q.notify({
          color: "green-9",
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
      const tag = this.editTagDialog;
      if (tag.title == tag.oldTitle) return;
      this.$refs.TagSelector.hidePopup();
      const response = await this.store.dispatch("tags/updateTag", tag);
      if (response.status == 200) {
        this.q.notify({
          color: "green-9",
          textColor: "white",
          message: "Тег успешно обновлён",
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
          color: "green-9",
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
      editTagDialog: {
        oldTitle: {},
        spec: {},
        title: {
          required,
          maxLength: maxLength(64),
          minLength: minLength(3),
          regExpValidation: this.validateTagTitleSymbols,
          uniquenessValidation: this.validateTagTitleEditUniqueness,
        },
      },
      addTagDialog: {
        title: {
          required,
          maxLength: maxLength(64),
          minLength: minLength(3),
          regExpValidation: this.validateTagTitleSymbols,
          uniquenessValidation: this.validateTagTitleAddUniqueness,
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
          maxLength: maxLength(32768),
        },
        inputFormat: {
          required,
          maxLength: maxLength(16384),
        },
        outputFormat: {
          required,
          maxLength: maxLength(16384),
        },
        remark: {
          maxLength: maxLength(16384),
        },

        hint: {
          content: {
            maxLength: maxLength(16384),
          },
          alarm: {
            required: requiredIf(this.taskForm.hint.content.length > 0),
            numeric,
            minValue: minValue(0),
          },
        },
      },
    };
  },
});
</script>
