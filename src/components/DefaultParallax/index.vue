<style lang="sass" src="./style.sass"></style>

<template lang="pug">
q-parallax.q-mb-xl(style="height: 60vh")
  template(v-slot:media)
    img(src="~assets/code2.jpg")

  template(v-slot:content="scope")
    .absolute.column.items-center(:style="{opacity:0.9}")
      img(
        src="~assets/simple_logo.svg",
        style="width: 150px; height: 150px"
      )
      .text-h1.text-white.text-center.text-weight-medium {{productName}}
      .text-h4.text-grey-3.text-center.text-weight-medium v{{ version }}
</template>

<script>
import { defineComponent } from "vue";
import packageInfo  from '../../../package.json'
/**q-parallax.q-mb-lg(src="https://cdn.quasar.dev/img/parallax2.jpg")
  h1.text-white Accept */
export default defineComponent({
  name: "DefaultParallax",
  data() {
    return{
    productName: packageInfo.productName,
    version: packageInfo.version,
    }
  },
});
</script>
