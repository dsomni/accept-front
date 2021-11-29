<style lang="sass" src="./style.sass"></style>

<template lang="pug">
q-list.column
  template(v-for="(menuItem, index) in menuList", :key="index")
    div(
         v-if="checkPermission(menuItem)"
    )
      RefButton(
        v-if="menuItem.type == 'reference'",
        :reference="menuItem.reference",
        :label="menuItem.label",
        :underline="false"
      )

      ExpansionItemDrawer.text-weight-regular(
        v-if="menuItem.type == 'dropDown'",
        :list="menuItem.list",
        :label="menuItem.label",
        :underline="false"
      )

      q-separator(:key="'sep' + index", v-if="menuItem.separator")
</template>

<script>
import { defineComponent } from "vue";
import RefButton from "components/DefaultRefBtn/index";
import ExpansionItemDrawer from "components/ExpansionItemDrawer/index";
import { useStore } from "vuex";

export default defineComponent({
  name: "LeftDrawerMenu",
  setup() {
    const store = useStore();

    return {
      store,
    };
  },
  props: {
    menuList: Array,
  },
  computed: {
    isTeacher() {
      const role = this.store.getters["users/role"];
      return role && (role == "teacher" || role == "admin");
    },
  },
  methods:{
    checkPermission(item){
      if (!item.requiredRole){
        return true;
      }

      if (item.requiredRole == "teacher" && this.isTeacher){
        return true;
      }else{
        return false;
      }
    },
  },
  components: {
    RefButton,
    ExpansionItemDrawer,
  },
});
</script>

