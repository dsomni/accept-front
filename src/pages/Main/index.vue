<style lang="sass" src="./style.sass"></style>

<template lang="pug">
q-page.flex.flex-start
    Parallax
    Parallax
</template>


<script>
import { defineComponent } from 'vue';
import Parallax from 'components/DefaultParallax/index.vue';

export default defineComponent({
  name: 'Main',
  components: {
    Parallax
  }
})
</script>
