<template>
  <q-layout view="lHh Lpr lFf">

    <q-toggle
      v-model="active"
      @click="toggleTheme"
      :color="$q.dark.isActive ? 'cyan' : 'pink'"
      keep-color
      class="q-ma-lg" />{{active}}
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>

import { defineComponent, ref } from "vue";
import { useQuasar } from 'quasar'

export default defineComponent({
  name: "MainLayout",

  setup() {
    const $q = useQuasar()
    const active = ref(true)
    let theme = JSON.parse(localStorage.getItem('dark'))
    if (theme === true){
      $q.dark.set(true)
      active.value = !theme;
    }
    if(theme === false){
      active.value = !theme;
    }

    const toggleTheme = () => {
      $q.dark.toggle()
      localStorage.setItem('dark' , JSON.stringify($q.dark.isActive) )
    }

    return {
      toggleTheme,
      active
    };
  },
});
</script>
