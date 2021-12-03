<style lang="sass" src="./style.sass"></style>

<template lang="pug">
q-page.q-pa-xl
  q-table(
    title="Задачи",
    :rows="rows",
    :columns="columns",
    row-key="name",
    :visible-columns="visibleColumns",
    :rows-per-page-options="[10, 15, 20, 30, 0]",
    :filter="filterObj",
    :filter-method="(rows, terms, cols) => customFilter(rows)",
    rows-per-page-label="На странице",
    :loading="false",
    loading-label="Подождите, задачи загружаются!",
    no-results-label="Ничего не найдено"
  )
    template(v-slot:top-right)
      .flex.q-gutter-x-md
        q-select(
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
          style="min-width: 150px"
        )

        q-select(
          v-model="filterObj.tagSort",
          multiple,
          outlined,
          dense,
          options-dense,
          display-value="Теги",
          emit-value,
          map-options,
          :options="tags",
          option-value="name",
          style="min-width: 150px"
        )

        q-input(
          borderless,
          dense,
          debounce="300",
          v-model="filterObj.titleSort",
          placeholder="Поиск"
        )
          template(v-slot:append)
            q-icon(name="search")

    template(v-slot:header="props")
      q-tr(:props="props")
        q-th(v-for="col in props.cols", :key="col.name", :props="props")
          span.text-h6 {{ col.label }}
    template(v-slot:body-cell-title="props")
      q-td(style="max-width: 250px")
        .flex.items-center.q-gutter-x-sm
          .text-primary.text-weight-medium.q-mr-lg(style="font-size: 1.3rem") {{ props.row.title }}
          q-space

          .text-grey-7(v-for="(tag, index) in props.row.tags", :key="index") {{ tag + (index == props.row.tags.length - 1 ? ' ' : ', ') }}
</template>


<script>
import { defineComponent, ref } from "vue";
import Fuse from "fuse.js";

const columns = [
  {
    name: "index",
    align: "left",
    required: true,
    label: "#",
    field: "index",
    style: {
      fontSize: "1.1em",
    },
  },
  {
    name: "title",
    required: true,
    label: "Название",
    align: "left",
    field: "title",
    sortable: true,
    style: {
      fontSize: "1.1em",
    },
  },
  {
    name: "grade",
    align: "left",
    label: "Класс",
    field: "grade",
    sortable: true,
    style: {
      fontSize: "1.1em",
    },
  },
  {
    name: "verdict",
    align: "left",
    label: "Вердикт",
    field: "verdict",
    style: {
      fontSize: "1.1em",
    },
  },
  {
    name: "author",
    align: "left",
    label: "Автор",
    field: "author",
    style: {
      fontSize: "1.1em",
    },
  },
];

const N = 100;

let rows = [];

for (let i = 1; i <= N; i++) {
  if (i % 3 == 0) {
    rows.push({
      index: i,
      title: "Simple Title",
      tags: ["строки", "строки"],
      grade: 11,
      verdict: "OK",
      author: "Береснев Д.В.",
    });
  } else if (i % 3 == 1) {
    rows.push({
      index: i,
      title: "Очень длинное название",
      tags: ["массивы"],
      grade: 7,
      verdict: "OK",
      author: "Юн Д.В.",
    });
  } else {
    rows.push({
      index: i,
      title: "Россия вперёд",
      tags: [
        "алгоритмы",
        "строки",
        "массивы",
        "алгоритм",
        "массивы",
        "алгоритм",
      ],
      grade: 10,
      verdict: "WA",
      author: "Лобачевский Д.В.",
    });
  }
}

const tags = ["алгоритмы", "строки", "массивы"];

export default defineComponent({
  name: "EduMain",
  components: {},
  setup() {
    const filterObj = ref({
      titleSort: "",
      tagSort: tags,
    });

    return {
      filterObj,
    };
  },
  data() {
    return {
      visibleColumns: ref(["grade", "verdict", "author"]),
      columns,
      rows,
      tags,
    };
  },
  methods: {
    customFilter(rows) {
      let filtered = rows;

console.log(this.filterObj.tagSort)
      if (this.filterObj.tagSort.length < this.tags.length) {
        filtered = filtered.filter((row) => {
          for (let i = 0; i < row.tags.length; i++) {
            if (!this.filterObj.tagSort.includes(row.tags[i])) {
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
  mounted() {
    document.title = "Accept | Edu";
  },
});
</script>
