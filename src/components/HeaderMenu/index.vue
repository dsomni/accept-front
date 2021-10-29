<style lang="sass" src="./style.sass"></style>

<template lang="pug">
.row.q-mx-xl
  q-list.row.q-gutter-x-sm
    template(v-for="(menuItem, index) in menuList", :key="index")
      RefButton(
        v-if="menuItem.type == 'reference'",
        :reference="menuItem.reference",
        :label="menuItem.label",
        :underline="false"
      )

      DropDown(
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
import DropDown from "components/DefaultDropDownBtn/index";

export default defineComponent({
  name: "HeaderMenu",
  setup() {},
  props: {
    menuList: Array,
  },
  components: {
    RefButton,
    DropDown,
  },
});
</script>

