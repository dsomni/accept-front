<style lang="sass" src="./style.sass"></style>

<template lang="pug">
q-list.column
  template(v-for="(menuItem, index) in menuList", :key="index")
    RefButton(
      v-if="menuItem.type == 'reference'",
      :reference="menuItem.reference",
      :label="menuItem.label",
      :underline="false"
    )

    ExpansionItemDrawer.text-weight-regular(
      v-if="menuItem.type == 'dropDown'",
      :list="menuItem.list",
      :label="menuItem.label",
      :underline="false"
    )

    q-separator(:key="'sep' + index", v-if="menuItem.separator")
</template>

<script>
import { defineComponent } from "vue";
import RefButton from "components/DefaultRefBtn/index";
import ExpansionItemDrawer from "components/ExpansionItemDrawer/index";

export default defineComponent({
  name: "LeftDrawerMenu",
  setup() {},
  props: {
    menuList: Array,
  },
  components: {
    RefButton,
    ExpansionItemDrawer,
  },
});
</script>

