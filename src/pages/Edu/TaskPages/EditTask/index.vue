<style lang="sass" src="./style.sass"></style>

<template lang="pug">
q-page
  q-tabs.q-ma-sm.bg-white(
    v-show="isTaskLoaded",
    v-model="tab",
    active-color="primary",
    indicator-color="primary",
    align="justify"
  )
    q-tab(name="editor", label="Редактирование")
    q-tab(name="preview", label="Просмотр")
  q-separator

  q-tab-panels(v-model="tab", v-if="isTaskLoaded")
    q-tab-panel(name="editor", style="overflow: hidden")
      TaskEditor(
        createButtonLabel="Сохранить",
        :onSubmit="onSubmit",
        :taskForm="task"
      )
    q-tab-panel(name="preview")
      TaskPreview(:taskForm="task")
      Hint(
        v-if="task.hint.content.length > 0",
        :content="task.hint.content",
        :openHintDialog="openHintDialog",
        v-on:openDialogChange="openDialogChange"
      )
      q-page-sticky(
        position="bottom-right",
        :offset="q.screen.gt.xs ? [36, 36] : [18, 18]"
      )
        q-btn(
          v-if="task.hint.content.length > 0",
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
  name: "EduEditTask",
  props: { spec: String },
  components: { TaskPreview, Hint, TaskEditor },
  async mounted() {
    document.title = "Редактировать задачу";
    await this.loadTask();
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

      isTaskLoaded: ref(false),

      task: ref({}),
    };
  },
  methods: {
    openDialogChange(value) {
      this.openHintDialog = value;
    },

    async loadTags() {
      let response = await this.store.dispatch("tags/getAllTags");
      if (response.status == 200) {
        this.tags = response.data.sort((a, b) =>
          a.title > b.title ? 1 : b.title > a.title ? -1 : 0
        );
      }
    },
    async loadTask() {
      let response = await this.store.dispatch(
        "tasks/getTaskBySpec",
        this.spec
      );
      if (response.status == 200) {
        this.task = response.data;
        await this.loadTags();
        this.task.tags = this.task.tags.map((tagSpec) =>
          this.tags.find((tag) => tag.spec == tagSpec)
        );
        this.isTaskLoaded = true;
      }
    },

    async onSubmit() {
      const Task = {
        spec: this.task.spec,
        title: this.task.title.toString().trim(),
        description: this.task.description.toString(),
        author: this.task.author.toString(),
        grade: this.task.grade,

        tags: this.task.tags.map((tag) => tag.spec.toString()),
        hint: this.task.hint.content ? this.task.hint : null,

        checkType: this.task.checkType,
        type: this.task.type,
        tests: this.task.tests,
        examples: this.task.examples,

        remark: this.task.remark,
        inputFormat: this.task.inputFormat,
        outputFormat: this.task.outputFormat,

        checker: this.task.checker,
      };
      const response = await this.store.dispatch(
        "tasks/updateTask",
        Task
      );
      if (response.status == 200) {
        const toPath = "/edu";
        this.router.push({ path: toPath });
        this.q.notify({
          color: "green-7",
          textColor: "white",
          message: "Задача успешно обновлена",
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
