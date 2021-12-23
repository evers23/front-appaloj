
<template>
  <div class="row">
      <div class="col-sm" v-for="cow in coworks" :key="cow.idcowork">
        <div class="text-center card-box">
          <div class="member-card pt-2 pb-2">
            <div class="thumb-lg member-thumb mx-auto">
              <img
                src='https://source.unsplash.com/user/c_v_r/200x200'
                class="rounded-circle img-thumbnail"
                alt="profile-image"
              />
            </div>

            <div class="">
              <h4>{{ cow.nombre }} {{ cow.direccion }}</h4>
              <p class="text-muted">
                {{cow.direccion}}
              </p>
            </div>

            <button
              type="button"
              class="btn btn-primary mt-3 btn-rounded waves-effect w-md waves-light"
            >
              Reservar
            </button>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            coworks: [],
            clientes: [],
            dialog: false,
            headers: [
            { text: '', value: 'actions', sortable: false },
            { text: 'Tipo Persona', value: 'tipopersona' },
            { text: 'Nombre', value: 'nombre' },
            { text: 'Tipo Doc.', value: 'tipodocumento' },
            { text: '# Doc.', value: 'numdocumento' },
            { text: 'Dirección', value: 'direccion' },
            { text: 'Teléfono', value: 'telefono', sortable: false },
            { text: 'Email', value: 'email', sortable: false },
            ],
            search: '',
            editedIndex: -1,
            id: '',
            nombre: '',
            tipodocumento: '',
            documentos: ['RUN', 'PASAPORTE', 'OTROS'],
            numdocumento: '',
            direccion: '',
            telefono: '',
            email: '',
            valida: 0,
            validaMensaje: [],
            adModal: 0,
            adAccion: 0,
            adNombre: '',
            adId: ''
        }
    },
    computed: {
        formTitle () {
            return this.editedIndex === -1 ? 'Nuevo Cliente' : 'Editar Cliente'
        },
    },

    watch: {
        dialog (val) {
            val || this.close()
        },
        dialogDelete (val) {
            val || this.closeDelete()
        },
    },

    created () {
        this.listarCowork();
        this.listar();
    },
    methods: {
        listarCowork() {
            let me = this;

            let header = {"Authorization": "Bearer " + this.$store.state.token};
            let configuracion = {headers: header};

            axios.get('api/coworks/listar', configuracion).then(function(response) {
                me.coworks = response.data;
                console.log(me.coworks);
            }).catch(function(error) {
                console.log(error);
            });
        },
        listar() {
            let me = this;

            let header = {"Authorization": "Bearer " + this.$store.state.token};
            let configuracion = {headers: header};

            axios.get('api/reservas/listar', configuracion).then(function(response) {
                //console.log(response);
                me.clientes = response.data;
                console.log(me.clientes);
            }).catch(function(error) {
                console.log(error);
            });
        },
        editItem (item) {
            this.id = item.idpersona;
            this.nombre = item.nombre;
            this.tipodocumento = item.tipodocumento;
            this.numdocumento = item.numdocumento;
            this.direccion = item.direccion;
            this.telefono = item.telefono;
            this.email = item.email;
            this.editedIndex = 1;
            this.dialog = true;
            console.log(item);
        },

        close () {
            this.dialog = false;
            this.limpiar();
        },

        limpiar() {
            this.id = '';
            this.nombre = '';
            this.tipodocumento = '';
            this.numdocumento = '';
            this.direccion = '';
            this.telefono = '';
            this.email = '';
            this.editedIndex = -1;
        },
        guardar () {
            if (this.validar())
                return;
                
            let header = {"Authorization": "Bearer " + this.$store.state.token};
            let configuracion = {headers: header};

            if (this.editedIndex > -1) {
                let me = this;

                axios.put('api/reservas/editar', {
                    'idpersona': me.id,
                    'tipopersona': 'CLIENTE',
                    'nombre': me.nombre,
                    'tipodocumento': me.tipodocumento,
                    'numdocumento': me.numdocumento,
                    'direccion': me.direccion,
                    'telefono': me.telefono,
                    'email': me.email
                }, configuracion).then(function(response) {
                    me.close();
                    me.listar();
                    me.limpiar();
                }).catch(function(error){
                    console.log(error);
                });
            } else {
                let me = this;
                axios.post('api/reservas/crear', {
                    'tipopersona': 'CLIENTE',
                    'nombre': me.nombre,
                    'tipodocumento': me.tipodocumento,
                    'numdocumento': me.numdocumento,
                    'direccion': me.direccion,
                    'telefono': me.telefono,
                    'email': me.email
                }, configuracion).then(function(response) {
                    me.close();
                    me.listar();
                    me.limpiar();
                }).catch(function(error){
                    console.log(error);
                });
            }
        },
        validar() {
            this.valida = 0;
            this.validaMensaje = [];
            if (this.nombre.length < 3 || this.nombre.length > 50)
                this.validaMensaje.push("Nombre debe tener entre 3 y 50 catacteres.");

            if (!this.email)
                this.validaMensaje.push("Ingrese su Email");

            if (this.validaMensaje.length)
                this.valida = 1;

            return this.valida;
        }
    }
}
</script>
