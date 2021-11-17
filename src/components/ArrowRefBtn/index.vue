<style lang="sass" src="./style.sass"></style>

<template lang="pug">
q-btn.text-weight-bold.text-h5.q-pa-md.q-my-md.text-primary.bg-grey-1.arrow-ref-btn(
  :to="reference",
  :icon-right="($q.screen.width >= getLimitWidth) ? 'arrow_forward_ios' : null",
  no-caps
)
  q-item-section.no-wrap {{ label }}
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "ArrowRefBtn",
  computed: {
    getLimitWidth() {
      return 600;
    },
  },
  props: {
    reference: String,
    label: String,
  },
});
</script>

