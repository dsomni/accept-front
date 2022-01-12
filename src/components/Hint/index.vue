<style lang="sass" src="./style.sass"></style>

<template lang="pug">
q-dialog(v-model="openHintDialog")
  q-card.q-pa-sm.hint-dialog.dialog
    q-card-section
      .dialog-title.text-primary Подсказка

    q-card-section.q-pt-none.scroll.hint-content-section(
      v-html="content",
      style="max-height: 60vh"
    )
    q-card-actions(align="right")
      q-btn(
        flat,
        label="Скрыть",
        color="primary",
        @click="async () => { openHintDialog = false; }"
      )

q-page-sticky(
  position="bottom-right",
  :offset="q.screen.gt.xs ? [36, 36] : [18, 18]"
)
  q-btn(
    :fab="q.screen.gt.xs",
    fab-mini,
    icon="visibility",
    color="accent",
    @click="() => { openHintDialog = true; }"
  )
</template>


<script>
import { defineComponent, ref } from "vue";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "Hint",
  props: { content: String },
  data() {
    const q = useQuasar();
    return {
      q,
      openHintDialog: ref(false),
    };
  },
});
</script>
