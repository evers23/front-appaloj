import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../components/Login.vue'
import Categoria from '../components/Categoria.vue'
import Articulo from '../components/Articulo.vue'
import Ingreso from '../components/Ingreso.vue'
import Proveedor from '../components/Proveedor.vue'

import Venta from '../components/Venta.vue'
import Cliente from '../components/Cliente.vue'
import Rol from '../components/Rol.vue'
import Usuario from '../components/Usuario.vue'
import ConsultaCompra from '../components/ConsultaCompra.vue'
import ConsultaVenta from '../components/ConsultaVenta.vue'

import store from '../store/'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      administrador: true,
      almacenero: true,
      vendedor: true
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
      administrador: true
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
    component: Rol,
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
  }else if (store.state.usuario && store.state.usuario.rol == 'Administrador'){
    if(to.matched.some(record => record.meta.administrador)){
      next()
    }
  }else if (store.state.usuario && store.state.usuario.rol == 'Cliente'){
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
