<style lang="sass" src="./style.sass"></style>

<template lang="pug">
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
                    round,
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
                    round,
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
</template>


<script>
import { defineComponent } from "vue";
import { useQuasar, copyToClipboard } from "quasar";

export default defineComponent({
  name: "TaskPreview",
  props: {
    taskForm: Object,
  },
  data() {
    const q = useQuasar();
    return {
      q,
    };
  },
  methods: {
        copyText(text) {
      copyToClipboard(text)
        .then(() => {
          this.q.notify({
            color: "green-7",
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
  },

});
</script>
