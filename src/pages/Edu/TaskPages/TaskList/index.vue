<style lang="sass" src="./style.sass"></style>

<template lang="pug">
q-page
  .table-container
    q-table.simple-table(
      bordered,
      wrap-cells,
      :rows="tasks",
      :columns="columns",
      row-key="name",
      :visible-columns="visibleColumns",
      :filter="filterObj",
      :filter-method="(rows, terms, cols) => customFilter(rows)",
      :rows-per-page-options="[15, 30, 0]",
      rows-per-page-label="На странице",
      :loading="false",
      loading-label="Подождите, задачи загружаются!",
      no-results-label="Ничего не найдено"
    )
      template(v-slot:top)
        .row.justify-between.q-gutter-y-md(style="width: 100%")
          q-select.q-mr-md(
            v-model="visibleColumns",
            multiple,
            outlined,
            dense,
            options-dense,
            display-value="Поля",
            emit-value,
            map-options,
            :options="columns.filter((item) => !item.required)",
            option-value="name",
            style="min-width: 150px; font-size: 1em"
          )

          .row.q-gutter-x-md
            q-select.q-mb-sm(
              v-model="filterObj.verdictSort",
              transition-show="jump-up",
              transition-hide="jump-up",
              multiple,
              outlined,
              dense,
              options-dense,
              display-value="Вердикты",
              emit-value,
              :use-chips="filterObj.verdictSort.length > 0",
              map-options,
              :options="verdicts",
              option-value="name",
              style="min-width: 150px; font-size: 1em"
            )
              template(v-if="filterObj.verdictSort.length > 0", v-slot:append)
                q-icon.cursor-pointer(
                  name="clear",
                  color="primary",
                  @click.stop="filterObj.verdictSort = []"
                )

            q-select.q-mb-sm(
              v-model="filterObj.tagSort",
              transition-show="jump-up",
              transition-hide="jump-up",
              multiple,
              outlined,
              dense,
              options-dense,
              display-value="Теги",
              emit-value,
              :use-chips="filterObj.tagSort.length > 0",
              map-options,
              virtual-scroll-slice-size="2",
              :options="tags",
              option-label="title",
              style="min-width: 150px; max-width: 350px; font-size: 1em"
            )
              template(v-if="filterObj.tagSort.length > 0", v-slot:append)
                q-icon.cursor-pointer(
                  name="clear",
                  color="primary",
                  @click.stop="filterObj.tagSort = []"
                )

            q-input.q-mb-sm(
              borderless,
              dense,
              debounce="300",
              v-model="filterObj.titleSort",
              placeholder="Поиск",
              style="font-size: 1em"
            )
              template(v-slot:append)
                q-icon(name="search")

      template(v-slot:header="props")
        q-tr(:props="props")
          q-th(
            v-for="col in props.cols",
            :key="col.name",
            :props="props",
            style="white-space: nowrap"
          )
            span(style="font-size: 1.5em") {{ col.label }}

      template(v-slot:body="props")
        q-tr(no-hover, :props="props")
          q-td(key="index", no-hover, :props="props") {{ props.row.index }}

          q-td(key="title", no-hover, :props="props", style="max-width: 250px")
            .flex.items-center.q-gutter-x-sm
              .text-primary.text-weight-medium.q-mr-lg(
                style="font-size: 1.3em"
              )
                a.title-ref(:href="joinPath([paths.main, paths.edu.self , paths.edu.task.page, props.row.spec])") {{ props.row.title }}
              q-space

              .text-grey-7(
                style="font-size: 0.9em",
                v-for="(tag, index) in props.row.tags",
                :key="index"
              ) {{ tag + (index == props.row.tags.length - 1 ? ' ' : ', ') }}

          q-td(key="grade", no-hover, :props="props") {{ props.row.grade }}

          q-td(key="verdict", no-hover, :props="props") {{ props.row.verdict }}

          q-td(key="author", no-hover, :props="props") {{ props.row.author }}
q-page-sticky(
  position="bottom-right",
  :offset="q.screen.gt.xs ? [36, 36] : [18, 18]"
)
  q-btn(
    :fab="q.screen.gt.xs",
    fab-mini,
    icon="add",
    color="primary",
    :to="joinPath([ '/', paths.edu.self, paths.edu.task.add ])"
  )
</template>


<script>
import { defineComponent, ref } from "vue";
import { useQuasar } from "quasar";
import { useStore } from "vuex";
import Fuse from "fuse.js";
import { paths } from '../../../../router/paths';
import { joinPath } from 'src/utils/joinPath';

const columns = [
  {
    name: "index",
    align: "left",
    required: true,
    label: "#",
    field: "index",
    sortable: true,
    style: {
      width: "2em",
    },
  },
  {
    name: "title",
    required: true,
    label: "Название",
    align: "left",
    field: "title",
    sortable: true,
    style: {},
  },
  {
    name: "grade",
    align: "left",
    label: "Класс",
    field: "grade",
    sortable: true,
    style: {
      width: "6em",
    },
  },
  {
    name: "verdict",
    align: "left",
    label: "Вердикт",
    field: "verdict",
    style: {
      width: "7em",
    },
  },
  {
    name: "author",
    align: "left",
    label: "Автор",
    field: "author",
    style: {
      width: "16em",
    },
  },
];

const verdicts = ["WA", "OK", "CE", "RE", "TL"];
const limitTableWidth = 600;

export default defineComponent({
  name: "EduMain",
  components: {},
  setup() {
    const filterObj = ref({
      titleSort: "",
      tagSort: [],
      verdictSort: [],
    });

    const q = useQuasar();
    const store = useStore();
    let visibleColumns = ref(["grade", "verdict", "author"]);

    let shouldShrinkTable = ref(false);
    if (q.screen.lt.sm) {
      visibleColumns.value = [];
    }
    let rows = []
    let tags = ref([]);
    let tasks = ref([]);

    return {
      q,
      tags,
      tasks,
      store,
      filterObj,
      shouldShrinkTable,
      visibleColumns,
    };
  },
  data() {
    return {
      columns,
      verdicts,
      limitTableWidth,
      paths,
      joinPath,
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

    async loadTasks() {
      let response = await this.store.dispatch("tasks/getAllTasksToDisplay");
      if (response.status == 200) {
        this.tasks = response.data;
        this.tasks.forEach((task, index) => {
          task.index = index + 1;
          task.verdict = task.verdict || "-";
           task.tags = task.tags.map((tagSpec) => {
            let tag = this.tags.find((tag) => tag.spec == tagSpec);
            return tag?.title;
          });
        });
      }
    },

    customFilter(rows) {
      let filtered = rows;

      if (this.filterObj.verdictSort.length > 0) {
        filtered = filtered.filter((row) =>
          this.filterObj.verdictSort.includes(row.verdict)
        );
      }

      if (this.filterObj.tagSort.length > 0) {
        filtered = filtered.filter((row) => {
          const tagSort = this.filterObj.tagSort;
          for (let i = 0; i < tagSort.length; i++) {
            if (!row.tags.includes(tagSort[i].title)) {
              return false;
            }
          }
          return true;
        });
      }

      if (this.filterObj.titleSort) {
        const options = {
          includeScore: true,
          keys: ["title"],
        };
        const fuse = new Fuse(filtered, options);
        filtered = fuse.search(this.filterObj.titleSort).map((row) => {
          return row.item;
        });
      }

      return filtered;
    },
  },
  async mounted() {
    document.title = "Accept | Edu";
    await this.loadTags();
    await this.loadTasks();
  },
});
</script>
