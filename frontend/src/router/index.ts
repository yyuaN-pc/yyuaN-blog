import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import Placeholder from '../views/Placeholder.vue'
import NoteDetail from '../views/NoteDetail.vue'
import Articles from '../views/Articles.vue'
import Album from '../views/Album.vue'
import AlbumDetail from '../views/AlbumDetail.vue'
import Tools from '../views/Tools.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', component: Home },
  { path: '/note/:id', component: NoteDetail },
  { path: '/articles', component: Articles },
  { path: '/project', component: Placeholder },
  { path: '/album', component: Album },
  { path: '/album/:id', component: AlbumDetail },
  { path: '/tools', component: Tools },
  { path: '/about', component: Placeholder },
  { path: '/blog/:id', component: Placeholder }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
