<style lang="sass" src="./style.sass"></style>

<template lang="pug">
q-form(
  @submit="onSubmit"
  class="q-ma-md"
)
  q-btn(
    label="Отправить"
    color="primary"
    type="submit"
  )
  q-select(
    v-model="lang"
    :options="languages"
    label="Язык"
  )
  q-input.codeInput(
    type="textarea"
    v-model="code"
    lazy-rules
    label="Код"
    :rules="[ val => val && val.trim().length > 0 || 'Введите код перед отправкой' ]"
    rows=25
    input-class="codeInner"
  )
</template>

<script>
import { defineComponent, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useStore } from 'vuex';

export default defineComponent({
  props:{
    task: String
  },
  setup(props){
    const q = useQuasar();
    const languages = ['python', 'pypy', 'cpp', 'java', 'pascal']
    const code = ref('');
    const lang = ref('python');
    const file = ref(null);
    const accept = ref(false);
    const store = useStore();

    return{
      q,
      code,
      file,
      lang,
      languages,
      accept,
      store,
      async onSubmit(){
        const attempt = {
          author: store.getters['users/login'],
          language: lang.value,
          programText: code.value,
          task: props.task
        }
        const response = await store.dispatch('attempts/send', attempt)
        if(response.status == 200){
          q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'cloud_done',
            message: 'Отправлено'
          })
        }else{
          q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message: 'Ошибка'
          })
        }
      }
    }
  }
})
</script>
