<template>
  <v-app id="inspire">
    <v-app-bar color="blue darken-3" dark app >
    </v-app-bar>
    <v-navigation-drawer
      :clipped="$vuetify.breakpoint.mdAndUp"
      v-model="drawer"
      v-if="logueado"
      fixed
      app
    >
      <v-list dense>
        <template v-if="esAdmin || esCliente">
          <v-list-item :to="{name: 'home'}">
            <v-list-item-action>
              <v-icon>mdi-home</v-icon>
            </v-list-item-action>
            <v-list-item-title>
              Inicio
            </v-list-item-title>
          </v-list-item>        
        </template>
        <template v-if="esAdmin">
            <v-list-item :to="{ name: 'categorias'}">
              <v-list-item-action>
                <v-icon>mdi-table</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Categorías
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
        </template>
        <template v-if="esAdmin">
            <v-list-item :to="{ name: 'cowork'}">
              <v-list-item-action>
                <v-icon>mdi-table</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Cowork
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
        </template>
        <template v-if="esAdmin || esCliente">
            <v-list-item :to="{ name: 'reserva'}">
              <v-list-item-action>
                <v-icon>mdi-table</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Reserva
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
        </template>
        <template v-if="esAdmin">
            <v-list-group>
            <v-list-item slot="activator">
              <v-list-item-content>
                <v-list-item-title>
                  Accesos
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{ name: 'roles'}">
              <v-list-item-action>
                <v-icon>mdi-table</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Roles
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item :to="{ name: 'usuarios'}">
              <v-list-item-action>
                <v-icon>mdi-account-circle</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Usuarios
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>
      </v-list>

    </v-navigation-drawer>
    <v-toolbar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      color="blue darken-3"
      dark
      fixed
    >
      <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <span class="hidden-sm-and-down">Sistema</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="salir" v-if="logueado" icon>
        <v-icon>mdi-logout</v-icon> Salir
      </v-btn>
      <v-btn :to="{name: 'login'}" v-else icon>
        <v-icon>mdi-apps</v-icon> Login
      </v-btn>
    </v-toolbar>
    <v-main>
      <v-container fluid fill-height>
        <v-slide-y-transition mode="out-in">
          <router-view/>
        </v-slide-y-transition>
      </v-container>
    </v-main>

    <v-footer
      color="primary lighten-1"
      padless
    >
      <v-row justify="center" no-gutters>
        <v-col
          class="primary lighten-2 py-4 text-center white--text"
          cols="12"
        >
          {{ new Date().getFullYear() }} — <strong>Vuetify</strong>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>



<script>
export default {
  name: 'App',
  data () {
    return {
      drawer: null,
    }
  },
  computed: {
    logueado() {
      return this.$store.state.usuario;
    },
    esAdmin() {
      return this.$store.state.usuario && this.$store.state.usuario.rol == 'Administrador';
    },
    esCliente() {
      return this.$store.state.usuario && this.$store.state.usuario.rol == 'Cliente';
    }
  }, 
  created() {
    this.$store.dispatch('autoLogin');
  },
  methods: {

  }
}
</script>