<style lang="sass" src="./style.sass"></style>

<template lang="pug">
q-page
  q-tabs.text-grey(
    v-model="tab",
    active-color="primary",
    indicator-color="primary",
    align="justify",
    narrow-indicator
  )
    q-tab(name="task", label="Задача")
    q-tab(name="code", label="Отправка")
    q-tab(name="results", label="Посылки")
  q-separator
  q-tab-panels(v-model="tab")
    q-tab-panel(name="task")
      TaskPreview.preview(v-if="showPreview", :taskForm="task")
      Hint(
        v-if="showPreview && task.hint.content.length > 0",
        :content="task.hint.content",
        :openHintDialog="openHintDialog",
        v-on:openDialogChange="openDialogChange"
      )
      q-page-sticky(
        position="bottom-right",
        :offset="q.screen.gt.xs ? [36, 36] : [18, 18]"
      )
        .column.q-gutter-md
          q-fab(
            :direction="q.screen.height > limitHeightFab ? 'up' : 'left'",
            icon="more_vert",
            color="accent"
          )
            template(v-for="(action, index) in actions", :key="index")
              q-fab-action(:to="action.to", color="secondary", :icon="action.icon")
          q-btn(
            v-if="showPreview && task.hint.content.length > 0",
            fab,
            icon="visibility",
            color="accent",
            @click="() => { openHintDialog = true; }"
          )
    q-tab-panel(name="code")
      CodeForm(:task="spec")
    q-tab-panel(name="results")
      Results(:task="spec")

</template>


<script>
import { defineComponent, ref } from "vue";
import { useStore } from "vuex";
import { useQuasar } from "quasar";

import TaskPreview from "src/components/Task/Preview/index.vue";
import Hint from "src/components/Hint/index.vue";
import Results from "src/components/Task/Results/index.vue";
import CodeForm from "src/components/Task/CodeForm/index.vue";

import { paths } from "src/router/paths";
import { joinPath } from "src/utils/joinPath"

const limitHeightFab = 400;

export default defineComponent({
  name: "EduTask",
  props: {
    spec: String,
  },
  components: { TaskPreview, Hint, Results, CodeForm },
  created() {
    this.actions = [
      {
        to: joinPath(['/',paths.edu.self , paths.edu.task.edit, this.spec]),
        icon: "edit",
      },
    ];
  },
  setup(props) {
    const store = useStore();
    const q = useQuasar();
    let actions = ref([]);

    return {
      tab: ref("task"),
      q,
      store,
      actions,
    };
  },
  data() {
    return {
      task: ref({}),
      tags: ref([]),
      showPreview: ref(false),
      openHintDialog: ref(false),
      limitHeightFab,
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
        this.showPreview = true;
      }
    },

    async openDialogChange(value) {
      this.openHintDialog = value;
    },
  },
  async mounted() {
    document.title = "Задача";
    await this.loadTask();
    document.title = this.task?.title || "Задача";
  },
});
</script>
