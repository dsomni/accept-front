<style lang="sass" src="./style.sass"></style>

<template lang="pug">
q-list.column
  q-expansion-item.expansion-item(
    expand-separator,
    :label="label",
    default-opened,
    :content-inset-level="0.2",
  )
    template(v-for="(listItem, index) in list", :key="index")
      RefButton.sub-level-btn(
        :reference="listItem.reference",
        :label="listItem.label",
        :underline="false"
      )
</template>

<script>
import { defineComponent } from "vue";
import RefButton from "components/DefaultRefBtn/index";

export default defineComponent({
  name: "ExpansionItemDrawer",
  setup() {},
  props: {
    label: String,
    list: Array,
  },
  components: {
    RefButton,
  },
});
</script>

