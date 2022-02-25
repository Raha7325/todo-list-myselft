<template>
  <div class="q-pa-md flex justify-center">
    <div class="q-mr-xl" style="max-width: 300px">
      <q-btn flat round icon="add" @click.stop="openAddDialog"/>
    </div>
  </div>
  <q-dialog v-model="openDialogForAddItem" positio="bottom">
    <q-card style="width:350px">
      <q-card-section class="row items-center">
        <div class="col-12">
          <span class="q-ml-sm">Add New Item</span>
        </div>
        <div class="q-gutter-sm">
          <q-radio keep-color v-model="addModel.category" val="work" label="work" color="orange" />
          <q-radio keep-color v-model="addModel.category" val="private" label="private" color="red" />
          <q-radio keep-color v-model="addModel.category" val="public" label="public" color="cyan" />
        </div>
        <div class="col-12">
          <!-- add keyup -->
          <q-input v-model="addModel.content" id="inputForAdd" @keyup.enter="addToList">
          </q-input>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="cancel" color="pink" v-close-popup/>
        <q-btn flat label="add" color="pink" @click="addToList(currentItem.index)"/>
      </q-card-actions>
    </q-card>
  </q-dialog>

</template>

<script>
import { ref } from 'vue'
import {useQuasar} from "quasar";

export default {
  setup(){
    const $q = useQuasar()
    const todoListItems = ref([]);
    const currentItem = ref({index: '', content: ''})
    const addModel = ref({ content:'', category: '', done:false});
    const openDialogForAddItem =ref(false)
    const openAddDialog =() => {
      openDialogForAddItem.value =true;
    }
    const addToList = () => {
      openDialogForAddItem.value =false;
      if(addModel.value.content && addModel.value.category){
        todoListItems.value.push({content: addModel.value.content, done: false, favorite:false, category:add.value.category});
        addModel.value.content='';
        localStorage.setItem('items', JSON.stringify(todoListItems.value))
        $q.notify({
          progress: true,
          message: 'success',
          icon: 'check',
          color: 'green',
          textColor: 'white',
          actions: [
            { icon: 'close', color: 'white', handler: () => { /* ... */ } }
          ]
        })
      }else{
        openDialogForAddItem.value = true;
        $q.notify({
          progress: true,
          message: 'davar deghat kon.',
          icon: 'warning',
          color: 'negative',
          textColor: 'white',
          actions: [
            { icon: 'close', color: 'white', handler: () => { /* ... */ } }
          ]
        })
      }
    }

    return{
      todoListItems,
      currentItem,
      addModel,
      openDialogForAddItem,
      openAddDialog,
      addToList,
    }

  }
}
</script>
