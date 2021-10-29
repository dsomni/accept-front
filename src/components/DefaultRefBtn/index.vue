<style lang="sass" src="./style.sass"></style>

<template lang="pug">
q-item.text-weight-medium.bg-grey-1.header-ref-btn(
  :class="{ 'header-ref-btn-undrln': underline }",
  clickable,
  :active="true",
  v-ripple,
  active-class="text-primary",
  tag="a",
  :href="reference",
)
  q-item-section.no-wrap.text-grey-10 {{ label }}
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: "DefaultRefBtn",
  props:{
    reference: String,
    label: String,
    underline: Boolean,
  }
})
</script>

