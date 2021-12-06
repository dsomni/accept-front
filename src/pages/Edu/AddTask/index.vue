<style lang="sass" src="./style.sass"></style>

<template lang="pug">
q-page
  ckeditor(:editor="editor", v-model="editorData", :config="editorConfig")
</template>


<script>
import { defineComponent, ref, reactive } from "vue";
import { useQuasar } from "quasar";
import CKEditor from "@ckeditor/ckeditor5-vue";
import CustomEditor from "ckeditor5-custom-build/build/ckeditor";

const limitWidth = 600;

export default defineComponent({
  name: "EduAddTask",
  components: { ckeditor: CKEditor.component },
  setup() {},
  data() {
    return {
      editor: CustomEditor,
      editorData: "<p>Content of the editor.</p>",
      editorConfig: {
        simpleUpload: {
          // The URL that the images are uploaded to.
          uploadUrl: "http://localhost:8000/",

          // Enable the XMLHttpRequest.withCredentials property.
          withCredentials: true,

          // Headers sent along with the XMLHttpRequest to the upload server.
          headers: {
            "X-CSRF-TOKEN": "CSRF-Token",
            Authorization: "Bearer <JSON Web Token>",
          },
        },
      },
    };
  },
  methods: {},
  mounted() {
    document.title = "Добавить задачу";
  },
});
</script>
