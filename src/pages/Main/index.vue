<style lang="sass" src="./style.sass"></style>

<template lang="pug">
q-page(class="flex flex-center")
  img(
    alt="Quasar logo"
    src="~assets/logo.svg"
    style="width: 200px; height: 200px"
  )
</template>


<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PageIndex'
})
</script>
