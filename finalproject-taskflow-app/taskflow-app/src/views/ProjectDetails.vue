<script setup>
import { onMounted, computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useTaskStore } from '@/stores/taskStore'
import Draggable from 'vuedraggable'

const route = useRoute()
const projectId = route.params.id
const taskStore = useTaskStore()

// 1. Charger les tâches de CE projet spécifique
onMounted(() => {
  taskStore.loadTasks(projectId)
})

const newTaskTitle = ref('')

// 2. Gestion intelligente des colonnes pour le Drag & Drop
const createColumn = (status) => computed({
  get: () => taskStore.tasks.filter(t => t.status === status),
  set: (items) => {
    // Quand on lâche une carte, on met à jour son statut dans Firebase
    items.forEach(task => {
      if (task.status !== status) {
        taskStore.updateTask(projectId, task.id, { status: status })
      }
    })
  }
})

const todoList = createColumn('todo')
const doingList = createColumn('doing')
const doneList = createColumn('done')

// 3. Ajouter une tâche
const handleAddTask = async () => {
  const title = prompt("Titre de la tâche :")
  if (title) {
    await taskStore.createTask(projectId, title, "Description...", null)
  }
}

// 4. Supprimer une tâche (Double click)
const handleDelete = async (taskId) => {
  if(confirm("Supprimer cette tâche ?")) {
    await taskStore.deleteTask(projectId, taskId)
  }
}
</script>

<template>
  <div class="kanban-board">
    <header class="board-header">
      <router-link to="/dashboard" class="back-link">← Retour aux projets</router-link>
      <h1>Tableau de bord</h1>
    </header>

    <div v-if="taskStore.loading">Chargement des tâches...</div>

    <div v-else class="columns-container">
      
      <!-- Colonne À FAIRE -->
      <div class="column todo">
        <div class="column-header">
          <h2>À Faire</h2>
          <span class="count">{{ todoList.length }}</span>
        </div>
        
        <!-- AJOUT DE ghost-class ICI -->
        <Draggable 
          v-model="todoList" 
          group="tasks" 
          item-key="id" 
          class="drag-area"
          ghost-class="ghost-card"
        >
          <template #item="{ element }">
            <div class="task-card" @dblclick="handleDelete(element.id)">
              {{ element.title }}
            </div>
          </template>
        </Draggable>

        <button @click="handleAddTask" class="add-btn">+ Ajouter</button>
      </div>

      <!-- Colonne EN COURS -->
      <div class="column doing">
        <div class="column-header">
          <h2>En Cours</h2>
          <span class="count">{{ doingList.length }}</span>
        </div>

        <!-- AJOUT DE ghost-class ICI -->
        <Draggable 
          v-model="doingList" 
          group="tasks" 
          item-key="id" 
          class="drag-area"
          ghost-class="ghost-card"
        >
          <template #item="{ element }">
            <div class="task-card" @dblclick="handleDelete(element.id)">
              {{ element.title }}
            </div>
          </template>
        </Draggable>
      </div>

      <!-- Colonne TERMINÉ -->
      <div class="column done">
        <div class="column-header">
          <h2>Terminé</h2>
          <span class="count">{{ doneList.length }}</span>
        </div>

        <!-- AJOUT DE ghost-class ICI -->
        <Draggable 
          v-model="doneList" 
          group="tasks" 
          item-key="id" 
          class="drag-area"
          ghost-class="ghost-card"
        >
          <template #item="{ element }">
            <div class="task-card done" @dblclick="handleDelete(element.id)">
              {{ element.title }}
            </div>
          </template>
        </Draggable>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* Tes styles existants */
.kanban-board { padding: 2rem; height: calc(100vh - 60px); }
.board-header { margin-bottom: 2rem; }
.back-link { color: var(--text-muted); text-decoration: none; display: inline-block; margin-bottom: 0.5rem; }
.columns-container { display: flex; gap: 1.5rem; height: 90%; overflow-x: auto; }

.column { flex: 1; min-width: 300px; background: #f8fafc; border-radius: 12px; padding: 1rem; display: flex; flex-direction: column; }
.column.todo { background-color: var(--todo-bg); border-top: 4px solid var(--todo-border); }
.column.doing { background-color: var(--doing-bg); border-top: 4px solid var(--doing-border); }
.column.done { background-color: var(--done-bg); border-top: 4px solid var(--done-border); }

.column-header { display: flex; justify-content: space-between; margin-bottom: 1rem; font-weight: bold; }
.drag-area { flex-grow: 1; min-height: 100px; }

.task-card { background: white; padding: 1rem; border-radius: 8px; margin-bottom: 0.8rem; box-shadow: 0 1px 2px rgba(0,0,0,0.05); cursor: grab; }
/* .task-card:active { cursor: grabbing; }  <-- J'ai retiré ça car .sortable-drag le gère mieux */
.task-card.done { text-decoration: line-through; color: gray; }

.add-btn { width: 100%; padding: 0.5rem; background: transparent; border: 2px dashed rgba(0,0,0,0.1); color: var(--text-muted); border-radius: 8px; cursor: pointer; margin-top: 10px; }
.add-btn:hover { border-color: var(--primary); color: var(--primary); }

/* --- NOUVEAUX STYLES POUR LE GHOST EFFECT --- */

/* Style de l'élément fantôme (la zone où on va lâcher la carte) */
.ghost-card {
  background: rgba(99, 102, 241, 0.1) !important; /* Fond bleu très clair */
  border: 2px dashed #6366f1; /* Bordure en pointillés */
  color: transparent; /* On cache le texte */
  box-shadow: none;
}

/* Style de la carte pendant qu'on la tient (rotation sympa) */
.sortable-drag {
  opacity: 1 !important;
  background: white;
  transform: rotate(3deg); /* Légère inclinaison */
  cursor: grabbing;
  box-shadow: 0 15px 30px rgba(0,0,0,0.2); /* Grosse ombre pour donner de la hauteur */
}
</style>