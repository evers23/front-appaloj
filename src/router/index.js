import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../components/Login.vue'
import Categoria from '../components/Categoria.vue'
import Cowork from '../components/Cowork.vue'

import Reserva from '../components/Reserva.vue'
import TipoUsuario from '../components/TipoUsuario.vue'
import Usuario from '../components/Usuario.vue'

import store from '../store/'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      administrador: true,
      cliente: true
    }
  },
  {
    path: '/categorias',
    name: 'categorias',
    component: Categoria,
    meta: {
      administrador: true
    }
  },
  {
    path: '/coworks',
    name: 'cowork',
    component: Cowork,
    meta: {
      administrador: true,
      cliente: true
    }
  },
  {
    path: '/reserva',
    name: 'reserva',
    component: Reserva,
    meta: {
      administrador: true,
      cliente: true
    }
  },
  {
    path: '/roles',
    name: 'roles',
    component: TipoUsuario,
    meta: {
      administrador: true
    }
  },
  {
    path: '/usuarios',
    name: 'usuarios',
    component: Usuario,
    meta: {
      administrador: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      libre: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.libre)){
    next()
  }else if (store.state.usuario && store.state.usuario.tipousuario == 'Administrador'){
    if(to.matched.some(record => record.meta.administrador)){
      next()
    }
  }else if (store.state.usuario && store.state.usuario.tipousuario == 'Cliente'){
    if(to.matched.some(record => record.meta.cliente)){
      next()
    }
  }else{
    next({
      name: 'login'
    })
    
  }
})

export default router
