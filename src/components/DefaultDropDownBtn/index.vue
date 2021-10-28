<style lang="sass" src="./style.sass"></style>

<template lang="pug">
q-item.q-pa-none(
  clickable,
  :active="true",
  v-ripple,
  active-class="text-primary"
)
  q-btn-dropdown.bg-grey-1.text-weight-medium.text-grey-10.header-drop-down(
    :class="{ 'header-ref-btn-undrln': underline }",
    color="primary",
    :label="label",
    type="a",
    no-caps,
    unelevated,
    no-wrap,
    :ripple="false",
    dropdown-icon="arrow_drop_down"
  )
    q-list
      template(v-for="(listItem, index) in list", :key="index")
        RefButton(:reference="listItem.reference", :label="listItem.label", :underline="underline")
        q-separator(:key="'sep' + index", v-if="listItem.separator")
</template>

<script>
import { defineComponent } from "vue";
import RefButton from "components/DefaultRefBtn/index";
//    dropdown-icon="img:icons/arrow_drop_down.svg"
export default defineComponent({
  name: "DefaultRefBtn",
  props: {
    label: String,
    list: Array,
  },
  components: {
    RefButton,
    underline: Boolean,
  },
});
</script>

