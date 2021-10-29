<style lang="sass" src="./style.sass"></style>

<template lang="pug">
q-parallax.q-mb-xl(style="height: 60vh", :speed="1")
  template(v-slot:media)
    img(src="~assets/code.jpg")

  template(v-slot:content="scope")
    .absolute.column.items-center.text-white(:style="{opacity:0.9}")
      img(
        src="~assets/simple_logo.svg",
        style="width: 150px; height: 150px"
      )
      .text-h1.text-center.text-weight-medium {{productName}}
      .text-h4.text-center.text-weight-medium v{{ version }}
</template>

<script>
import { defineComponent } from "vue";
import packageInfo  from '../../../package.json'

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
