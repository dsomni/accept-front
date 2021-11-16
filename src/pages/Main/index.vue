<style lang="sass" src="./style.sass"></style>

<template lang="pug">
q-page.flex.flex-start
  Parallax
  CardList(:cardList="cards")
</template>


<script>
import { defineComponent } from "vue";

import Parallax from "components/DefaultParallax/index.vue";
import CardList from "components/DefaultCardList/index.vue";

const cards = [
  {
    title: "Образование",
    description:
      "Сделайте обучение интересным и привлекательным! \
   Придумывайте задачи, создавайте уроки, проводите контрольные. \
   Одна площадка - множество возможностей",
    reference: "/edu",
  },
  {
    title: "Турниры",
    description:
      "Участвуйте в Турнирах или создавайте свои. \
      Гибкая настройка и приятный интерфейс помогут \
      вам прочувствовать незабываемый дух соперничества",
    reference: "/tournaments",
  },
  {
    title: "Курсы",
    description:
      "Узнавать что-то новое всегда интересно. \
      Площадка предоставляет возможности создавать \
      и проходить различные курсы. Также можно закрепить теорию \
      проверкой практических навыков",
    reference: "/courses",
  },
];

export default defineComponent({
  name: "Main",
  components: {
    Parallax,
    CardList,
  },
  data() {
    return {
      cards,
    };
  },
});
</script>
