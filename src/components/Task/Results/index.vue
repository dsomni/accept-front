<style lang="sass" src="./style.sass"></style>

<template lang="pug">
.table-container
  q-table.simple-table(
    title="Попытки",
    :rows="attempts",
    :columns="columns",
    separator="cell",
    row-key="spec",
    :pagination="initialPagination",
    no-data-label="Попытки не найдены",
    binary-state-sort
  )
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useQuasar, QTable } from "quasar";
import { useStore } from "vuex";
import { parseDate } from "../../../utils/parseDate";

const columns = [
  {
    name: "date",
    field: (attempt) => attempt.arriveTime,
    label: "Дата",
    align: "left",
    format: (stamp) => parseDate(stamp),
    sortable: true,
  },
  {
    name: "language",
    field: "language",
    align: "left",
    label: "Язык",
    sortable: true,
    classes: "languageCell",
    headerClasses : "languageCell"
  },
  {
    name: "verdict",
    align: "left",
    field: (attempt) =>
      attempt.verdict?.shortResult ||
      (attempt.status == 1 && "Testing...") ||
      "Error",
    label: "Вердикт",
    classes : (attempt) =>
      (attempt.verdict?.shortResult == "OK" ? "okResult" : "errResult") + " resultCell",
  },
];

export default defineComponent({
  props: {
    task: String,
  },
  components: {
    QTable,
  },
  setup(props) {
    const q = useQuasar();
    const store = useStore();
    const attempts = ref([]);
    const loading = ref(true);
    const error = ref(false);

    onMounted(() => {
      fetchAttempts(loading, error, attempts, props.task, store);
    });

    return {
      q,
      attempts,
      columns,
      initialPagination: {
        sortBy: "date",
        descending: true,
        rowsPerPage: 20,
      },
    };
  },
});

async function fetchAttempts(loading, error, attempts, task_spec, store) {
  loading.value = true;
  error.value = false;
  const response = await store.dispatch("attempts/getUserTask", {
    login: store.getters["users/login"],
    task_spec,
  });
  if (response.status == 200) {
    error.value = false;
    attempts.value = response.attempts;
  } else {
    error.value = true;
  }
  loading.value = false;
}
</script>
