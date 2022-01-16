<style lang="sass" src="./style.sass"></style>

<template lang="pug">
q-dialog(v-model="openHintDialogLocal")
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
        @click="async () => { openHintDialogLocal = false; }"
      )

</template>


<script>
import { defineComponent, ref } from "vue";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "Hint",
  props: { content: String , openHintDialog: Boolean},
  created(){
    this.$watch(
      () => this.openHintDialogLocal,
      (newVal, oldVal) => {
        this.$emit('openDialogChange', newVal);
      }
    )

    this.$watch(
      () => this.openHintDialog,
      (newVal, oldVal) => {
        this.openHintDialogLocal = this.openHintDialog;
      }
    )
  },
  data() {
    const q = useQuasar();
    return {
      q,
      openHintDialogLocal: ref(this.openHintDialog),
    };
  },

});
</script>
