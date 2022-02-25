<template>
  <div class="q-pa-md flex justify-center">
    <div class="q-mr-xl" style="max-width: 300px">
      <q-input
        @keyup.enter="addToList"
        style="width: 250px"
        v-model="text"
        label="add new item..."
        label-color="pink"
        rounded
        outlined
        clearable>
        <template v-slot:after>
          <q-btn dense flat icon="send" @click="addToList" style="color:deeppink"/>
        </template>
      </q-input>
    </div>
    <div style="max-width: 300px">
      <q-input
        @keyup="filterItems"
        style="width: 250px"
        v-model="filterText"
        label="search..."
        label-color="pink"
        rounded
        outlined
        clearable>
        <template v-slot:after>
          <q-btn dense flat icon="search" style="color:deeppink"/>
        </template>
      </q-input>
    </div>
    <div class="row full-width justify-center q-pa-lg">
      <div class=" col-sm-6 col-lg-4">
        <q-card
          v-for="(item, index) in filteredItems"
          :key="index"
          class="my-card q-mb-md shadow-3"
          style="border-radius: 11px; border-left: 8px solid deeppink;">
          <q-card-section horizontal>
            <label style="width: 90%" class="flex flex-center">
              {{ item }}
            </label>
            <q-card-actions vertical class="justify-around q-px-md row">
              <q-btn flat round color="red" icon="delete" @click="openConfirmDeleteDialog(index)"/>
              <q-btn flat round icon="edit" @click="openEditDialog(index)"/>
            </q-card-actions>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>

  <q-dialog v-model="confirmDeleteDialog" position="top">
    <q-card style="width: 350px">
      <q-card-section class="row items-center">
        <span class="q-ml-sm">Are you sure to delete?</span>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="cancel" color="negative" v-close-popup/>
        <q-btn flat label="delete" color="negative" @click="deleteItem(currentItem.index)"/>
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="editBoxForDialog" position="bottom">
    <q-card style="width: 350px">
      <q-card-section class="row items-center">
        <div class="col-12">
          <span class="q-ml-sm">Edit</span>
        </div>
        <div class="col-12">
          <q-input v-model="edit" id="inputForEdit">
          </q-input>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="cancel" color="pink" v-close-popup/>
        <q-btn flat label="edit" color="pink" @click="editItem(currentItem.index)"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref , watch } from 'vue'
import { useQuasar , Notify } from 'quasar'

export default {
  setup () {
    const $q = useQuasar()
    const text = ref('');
    const edit = ref('');
    const filterText = ref('');
    const todoListItems = ref([]);
    const filteredItems = ref([]);
    const confirmDeleteDialog = ref(false);
    const editBoxForDialog = ref(false)
    const currentItem = ref({index: '', content: ''})


    watch(todoListItems, () => {
      filterItems()
    },{ deep: true })
    const filterItems = () => {
      filteredItems.value = todoListItems.value.filter(item => item.includes(filterText.value))
      console.log("filteredItems.value")
      console.log(filteredItems.value)
    }
    let tempData = JSON.parse(localStorage.getItem('items'))
    if(tempData){
      todoListItems.value = tempData;
    }
    const addToList = () => {
      if(text.value){
        todoListItems.value.push(text.value);
        text.value='';
        // text.setAttribute('id' , index + 1)
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

    const deleteItem = (itemToDelete) => {
        todoListItems.value.splice(itemToDelete, 1)
        localStorage.setItem('items', JSON.stringify(todoListItems.value))
        confirmDeleteDialog.value = false;
        $q.notify({
          progress: true,
          message: 'delete shod',
          icon: 'delete',
          color: 'cyan',
          textColor: 'white',
          actions: [
            { icon: 'close', color: 'white', handler: () => { /* ... */ } }
          ]
        })
    }
    const openConfirmDeleteDialog = (index) => {
      confirmDeleteDialog.value = true;
      currentItem.value.index = index;
    }
    const editItem = (itemIndex) => {
      todoListItems.value[itemIndex] = edit.value;
      localStorage.setItem('items', JSON.stringify(todoListItems.value))
      editBoxForDialog.value =false
      $q.notify({
        progress: true,
        message: 'success',
        icon: 'check',
        color: 'yellow',
        textColor: 'white',
        actions: [
          { icon: 'close', color: 'white', handler: () => { /* ... */ } }
        ]
      })
    }

    const openEditDialog = (index) => {
      editBoxForDialog.value = true;
      currentItem.value.content = filteredItems.value[index]
      currentItem.value.index = index
      edit.value = currentItem.value.content
    }

    return {
      text,
      edit,
      filterText,
      todoListItems,
      filteredItems,
      confirmDeleteDialog,
      editBoxForDialog,
      currentItem,
      addToList,
      filterItems,
      deleteItem,
      openConfirmDeleteDialog,
      editItem,
      openEditDialog,

    }
  }
}
</script>
