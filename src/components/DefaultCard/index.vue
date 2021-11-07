<style lang="sass" src="./style.sass"></style>

<template lang="pug">
.q-pa-md.full-width.row.no-wrap.items-start.content-start.largex-padding(
  :class="{'justify-end': isRight && !($q.screen.width < getLimitWidth)}"
)
  q-card.shadow-10.shadow-up-10.card-class(
    :class="{'reduce-width-card': ($q.screen.width < getLimitWidth)}"
  )
    q-parallax(
      :src="getImgUrl"
      :class="{'reduce-height': ($q.screen.width < getLimitWidth)}",
      style="height: 400px"
    )
      template(v-slot:content="scope")
        .text-h2.absolute-bottom.text-left.text-white.q-py-md.q-px-md.card-title.q-mx-md(
            :class="{'text-right': isRight && !($q.screen.width < getLimitWidth), 'reduce-font-card':($q.screen.width < getLimitWidth)}"
        )  {{item.title}}

    q-card-section.row.q-mx-md(
        :class="{'justify-end': isRight && !($q.screen.width < getLimitWidth)}",
    )
      .text-h5(
        :class="{'text-right': isRight && !($q.screen.width < getLimitWidth)}",
      ) {{item.description}}
      ArrowButton(:reference="item.reference", label='Попробовать')

</template>

<script>
import { defineComponent } from "vue";
import ArrowButton from "components/ArrowRefBtn/index";

const images = require.context("../../assets/", false, /\.jpg$/);

export default defineComponent({
  name: "DefaultCard",
  props: {
    item: Object,
    isRight: Boolean,
    imgIdx: Number
  },
  computed: {
    getLimitWidth() {
      return 600;
    },
    getImgUrl() {
      return images("./" + 'code' + this.imgIdx.toString() + ".jpg");
    },
  },
  components: {
    ArrowButton,
  },
});
</script>

