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
    :filter="filter",
    :filter-method="(rows, terms, cols) => fuzzySearch(rows)",
    rows-per-page-label="На странице",
    :loading="false",
    loading-label="Подождите, задачи загружаются!",
    no-results-label="Ничего не найдено"
  )
    template(v-slot:top-left)
      //- .text-h4.col-2.q-table__title Задачи

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

    template(v-slot:top-right)
      q-input(
        borderless,
        dense,
        debounce="300",
        v-model="filter",
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
      tags: ["алгоритмы", "строки", "массивы", "алгоритм"],
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
      tags: ["алгоритмы", "строки", "массивы", "алгоритм", "массивы", "алгоритм"],
      grade: 10,
      verdict: "WA",
      author: "Лобачевский Д.В.",
    });
  }
}

export default defineComponent({
  name: "EduMain",
  components: {},
  setup() {
    const filter = ref("");

    return {
      filter,
    };
  },
  data() {
    return {
      visibleColumns: ref(["grade", "verdict", "author"]),
      columns,
      rows,
    };
  },
  methods: {
    fuzzySearch(rows) {
      const options = {
        includeScore: true,
        keys: ["title"],
      };

      const fuse = new Fuse(rows, options);
      return fuse.search(this.filter).map((row) => {
        return row.item;
      });
    },
  },
  mounted() {
    document.title = "Accept | Edu";
  },
});
</script>
