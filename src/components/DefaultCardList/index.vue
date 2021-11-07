<style lang="sass" src="./style.sass"></style>

<template lang="pug">
.column.q-gutter-y-md.full-width
  template(v-for="(listItem, index) in cardList", :key="index")
    Card(:item="listItem", :isRight="index % 2 != 0", :imgIdx="index % codePicturesNumber")
</template>

<script>
import { defineComponent } from "vue";
import Card from "components/DefaultCard/index";

const codePicturesNumber = 3;

export default defineComponent({
  name: "DefaultCardList",
  props: {
    cardList: Array,
  },
  components: {
    Card,
  },
  data() {
    return {
      codePicturesNumber,
    };
  },
});
</script>

