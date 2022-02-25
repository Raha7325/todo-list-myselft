<template>
  <div class="q-pa-md flex justify-center">
    <div class="q-mr-xl" style="max-width: 300px">
      <q-btn flat round icon="add" @click.stop="openAddDialog"/>
    </div>
    <div style="max-width: 300px">
      <q-input
        style="width: 250px"
        class="pink-borders"
        v-model="filterText"
        label="search..."
        label-color="pink"
        rounded
        outlined>
        <template v-slot:after>
          <q-btn dense flat icon="search" color="pink"/>
        </template>
        <template v-if="filterText.length>0" v-slot:append>
          <q-btn dense flat icon="close" @click="filterText = ''" color="pink"/>
        </template>
      </q-input>
    </div>
    <div>
      <q-checkbox
        toggle-indeterminate
        v-model="filters.favorite"
        @click="updateRouterQuery('favorite')"
        label="favorite"
        checked-icon="check"
        unchecked-icon="close"
      />
      <q-checkbox
        toggle-indeterminate
        v-model="filters.done"
        @click="updateRouterQuery('done')"
        label="done"
        checked-icon="check"
        unchecked-icon="close"/>
    </div>
    <div class="row full-width justify-center q-pa-lg">
      <div class="col-sm-6 col-lg-4">
        <transition-group
          enter-active-class="animated fadeInDown"
          leave-active-class="animated fadeOutUp"
        >
        <q-card
          v-for="(item, index) in computedFilteredItems"
          :key="index"
          class="my-card q-mb-md shadow-3"
          :class="item.done ? 'border-green' : 'border-pink'"
          @click="item.done = !item.done"
          clickable
          id="borderRight"
        >
          <q-card-section horizontal>
            <div class="row justify-center">
              <div class="q-pa-md">
                {{ item.category }}
              </div>
              <q-checkbox
                v-model="item.done"
                color="secondary"
              />
            </div>

            <label style="width: 90%" class="flex flex-center">
              {{ item.content }}
            </label>
            <q-card-actions vertical class="justify-around q-px-md row">
              <q-btn flat round color="red" icon="delete" @click.stop="openConfirmDeleteDialog(index)"/>
              <q-btn flat round icon="edit" @click.stop="openEditDialog(index)"/>
                <q-checkbox
                  v-model="item.favorite"
                  color="yellow"
                  checked-icon="star"
                  unchecked-icon="star_border"
                />
            </q-card-actions>
          </q-card-section>
        </q-card>
        </transition-group>
      </div>
      <div
        v-if="!computedFilteredItems.length"
        class="no-tasks absolute-center">
        <div class="text-h5 text-pink text-center">
          No items
        </div>
      </div>
    </div>
  </div>

  <q-dialog v-model="openDialogForAddItem" positio="bottom">
    <q-card style="width:350px">
      <q-card-section class="row items-center">
      <div class="col-12">
        <span class="q-ml-sm">Add New Item</span>
      </div>
        <div class="q-gutter-sm">
          <q-radio keep-color v-model="add.category" val="work" label="work" color="orange" />
          <q-radio keep-color v-model="add.category" val="private" label="private" color="red" />
          <q-radio keep-color v-model="add.category" val="public" label="public" color="cyan" />
        </div>
      <div class="col-12">
        <q-input v-model="add.content" label="add new item" id="inputForAdd" @keyup.enter="addToList">
        </q-input>
      </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="cancel" color="pink" v-close-popup/>
        <q-btn flat label="add" color="pink" @click="addToList"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
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
        <q-checkbox
          v-model="edit.done"
          color="secondary"
        />
        <q-checkbox
          v-model="edit.favorite"
          color="yellow"
          checked-icon="star"
          unchecked-icon="star_border"
        />
        <div class="col-12">
          <span class="q-ml-sm">Edit</span>
        </div>
        <div class="col-12">
          <q-input v-model="edit.content" id="inputForEdit">
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
import { ref , computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar , Notify } from 'quasar'

export default {
  setup () {
    const $q = useQuasar()
    const router = useRouter()
    const route = useRoute()
    const edit = ref({ content:'', done:false, favorite:false});
    const add = ref({ content:'', category: '', done:false, favorite:false});
    const filterText = ref('');
    const todoListItems = ref([]);
    console.log(todoListItems)
    const openDialogForAddItem =ref(false)
    const confirmDeleteDialog = ref(false);
    const editBoxForDialog = ref(false)
    const currentItem = ref({index: '', content: ''})
    const filters = ref({favorite: null, done:null})
    for(let key in route.query){
      filters.value[key] = route.query[key] === "true"
    }
// a computed ref
    const computedFilteredItems = computed(() => {
      let filtersArray = todoListItems.value;
      for(let key in route.query){
        filtersArray = filtersArray.filter(item => String(item[key]) === route.query[key])
      }
      return (filtersArray.filter(item => item.content.includes(filterText.value)))
    })
    // watch(todoListItems, () => {
    //   filterItems()
    // },{ deep: true })

    const filteredItems = (allItems) => {
      return (allItems.filter(item => item.content.includes(filterText.value)))
    }
    let tempData = JSON.parse(localStorage.getItem('items'))
    if(tempData){
      todoListItems.value = tempData;
    }
    const addToList = () => {
      openDialogForAddItem.value =false;
      if(add.value.content && add.value.category){
        todoListItems.value.push({content: add.value.content, done: false, favorite:false, category:add.value.category});
        add.value.content='';
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
    const openAddDialog =() => {
      openDialogForAddItem.value =true;
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
      todoListItems.value[itemIndex].content = edit.value.content;
      todoListItems.value[itemIndex].done = edit.value.done;
      todoListItems.value[itemIndex].favorite = edit.value.favorite;
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
      currentItem.value.content = todoListItems.value[index].content
      currentItem.value.done = todoListItems.value[index].done
      currentItem.value.favorite = todoListItems.value[index].favorite
      currentItem.value.index = index
      edit.value.content = currentItem.value.content
      edit.value.done = currentItem.value.done
      edit.value.favorite = currentItem.value.favorite
    }
    const updateRouterQuery = (name) => {
      const value = filters.value[name] === null ? undefined : filters.value[name]
      const query = {...route.query, [name]: value}
      router.replace( { query})
    }
    return {
      edit,
      add,
      filterText,
      todoListItems,
      filteredItems,
      openDialogForAddItem,
      confirmDeleteDialog,
      editBoxForDialog,
      currentItem,
      filters,
      addToList,
      openAddDialog,
      deleteItem,
      openConfirmDeleteDialog,
      editItem,
      openEditDialog,
      computedFilteredItems,
      updateRouterQuery
    }
  }
}
</script>
