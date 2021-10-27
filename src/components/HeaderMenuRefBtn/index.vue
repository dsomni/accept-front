<style lang="sass" src="./style.sass"></style>

<template lang="pug">
q-item.text-weight-medium.header-ref-btn(
  clickable,
  :active="true",
  v-ripple,
  active-class="text-primary",
  tag="a",
  :href="reference"
)
  q-item-section.no-wrap.text-grey-10 {{ label }}
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: "HeaderMenuButton",
  props:{
    reference: String,
    label: String,
  }
})
</script>

