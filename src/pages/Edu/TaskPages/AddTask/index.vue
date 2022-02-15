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
    q-tab-panel(name="editor", style="overflow: hidden")
      TaskEditor(
        createButtonLabel="Создать",
        :onSubmit="onSubmit",
        :taskForm="taskForm"
      )
    q-tab-panel(name="preview")
      TaskPreview(:taskForm="taskForm")
      Hint(
        v-if="taskForm.hint.content.length > 0",
        :content="taskForm.hint.content",
        :openHintDialog="openHintDialog",
        v-on:openDialogChange="openDialogChange"
      )
      q-page-sticky(
        position="bottom-right",
        :offset="q.screen.gt.xs ? [36, 36] : [18, 18]"
      )
        q-btn(
          v-if="taskForm.hint.content.length > 0",
          fab,
          icon="visibility",
          color="accent",
          @click="() => { openHintDialog = true; }"
        )
</template>


<script>
import { defineComponent, ref } from "vue";

import TaskPreview from "src/components/Task/Preview/index.vue";
import TaskEditor from "src/components/Task/Edit/index.vue";
import Hint from "src/components/Hint/index.vue";

import { useQuasar } from "quasar";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";

export default defineComponent({
  name: "EduAddTask",
  components: { TaskPreview, Hint, TaskEditor },
  async mounted() {
    document.title = "Добавить задачу";
  },
  setup() {
    const store = useStore();
    const q = useQuasar();
    const router = useRouter();
    const route = useRoute();

    return {
      q,
      store,
      router,
      route,
    };
  },
  data() {
    return {
      openHintDialog: ref(false),

      tab: ref("editor"),
      // tab: ref("preview"),

      taskForm: ref({
        title: "Название Задачи",
        tags: [],
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
          content: `<p>${"фффф вввв гггг ее ".repeat(30)}</p>`,
          alarmType: "attempts",
          alarm: "1",
        },

        checkType: "tests",
        type: "code",

        tests: [
          {
            inputData: `1`,
            outputData: `1`,
          },
          {
            inputData: `1243142342`,
            outputData: `1`,
          },
        ],
      }),
    };
  },
  methods: {
    openDialogChange(value) {
      this.openHintDialog = value;
    },

    async onSubmit() {
      const Task = {
        title: this.taskForm.title.toString().trim(),
        description: this.taskForm.description.toString(),
        author: this.taskForm.author.toString(),
        grade: this.taskForm.grade,

        tags: this.taskForm.tags.map((tag) => tag.spec.toString()),
        hint: this.taskForm.hint.content ? this.taskForm.hint : null,

        checkType: this.taskForm.checkType,
        type: this.taskForm.type,
        tests: this.taskForm.tests,
        examples: this.taskForm.examples,

        remark: this.taskForm.remark,
        inputFormat: this.taskForm.inputFormat,
        outputFormat: this.taskForm.outputFormat,

        checker: null,
      };
      const response = await this.store.dispatch("tasks/addTask", Task);
      if (response.status == 200) {
        const toPath = "/edu";
        this.router.push({ path: toPath });
        this.q.notify({
          color: "green-7",
          textColor: "white",
          message: "Задача успешно добавлена",
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
  },
});
</script>
