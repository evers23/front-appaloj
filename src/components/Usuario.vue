<template>
    <v-layout align-start>
        <v-flex>
            <v-data-table
            :headers="headers"
            :items="usuarios"
            :search="search"
            sort-by="nombre"
            class="elevation-1"
            >
            <template v-slot:top>
                <v-toolbar
                flat
                >
                <v-toolbar-title>Articulos</v-toolbar-title>
                <v-divider
                    class="mx-4"
                    inset
                    vertical
                ></v-divider>
                <v-spacer></v-spacer>
                <v-text-field class="text-xs-center" v-model="search" append-icon="mdi-magnify" label="Búsqueda" single-line hide-details></v-text-field>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="80%">
                    <template v-slot:activator="{ on }">
                    <v-btn
                        slot="activator"
                        color="primary"
                        dark
                        class="mb-2"
                        v-on="on"
                    >
                        Nuevo
                    </v-btn>
                    </template>
                    <v-card>
                    <v-card-title>
                        <span class="text-h5">{{ formTitle }}</span>
                    </v-card-title>
        
                    <v-card-text>
                        <v-container>
                        <v-row>
                            <v-col cols="6" sm="6" md="6">
                                <v-select v-model="idrol" :items="roles" label="Rol"></v-select>
                            </v-col>
                            <v-col cols="6" sm="6" md="6">
                                <v-text-field v-model="nombre" label="Nombre"></v-text-field>
                            </v-col>
                            <v-col cols="6" sm="6" md="6">
                                <v-select v-model="tipodocumento" :items="documentos" label="Documento"></v-select>
                            </v-col>
                            <v-col cols="6" sm="6" md="6">
                                <v-text-field v-model="numdocumento" label="# Documento"></v-text-field>
                            </v-col>
                            <v-col cols="6" sm="6" md="6">
                                <v-text-field v-model="telefono" label="Teléfono" ></v-text-field>
                            </v-col>
                            <v-col cols="6" sm="6" md="6">
                                <v-text-field v-model="email" label="Email" ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                                <v-text-field v-model="direccion" label="Dirección"></v-text-field>
                            </v-col>
                            <v-col cols="6" sm="6" md="6">
                                <v-text-field type="password" v-model="password" label="Contraseña" ></v-text-field>
                            </v-col>
                            
                            <v-col cols="12" sm="12" md="12" v-show='valida'>
                                <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v">
                                </div>
                            </v-col>
                        </v-row>
                        </v-container>
                    </v-card-text>
        
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="close">
                            Cancelar
                        </v-btn>
                        <v-btn color="blue darken-1" text @click="guardar" >
                            Guardar
                        </v-btn>
                    </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-dialog v-model="adModal" max-width="300px">
                    <v-card>
                        <v-card-title class="headline" v-if="adAccion==1">¿Activar Item?</v-card-title>
                        <v-card-title class="headline" v-if="adAccion==2">¿Desactivar Item?</v-card-title>
                        <v-card-text>
                            Desea 
                            <span v-if="adAccion==1">Activar </span>
                            <span v-if="adAccion==2">Desactivar </span>
                            el item {{ adNombre }}
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="default darken-1" @click="activarDesactivarCerrar">
                                Cancelar
                            </v-btn>
                            <v-btn v-if="adAccion==1" color="green darken-4" @click="activar">
                                Activar
                            </v-btn>
                            <v-btn v-if="adAccion==2" color="red darken-4" @click="desactivar">
                                Desactivar
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                </v-toolbar>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon
                small
                class="mr-2"
                @click="editItem(item)"
                >
                mdi-pencil
                </v-icon>
                <template v-if="item.condicion">
                    <v-icon
                    small
                    @click="activarDesactivar(2, item)"
                    >
                    mdi-cancel
                    </v-icon>
                </template>
                <template v-else>
                    <v-icon
                    small
                    @click="activarDesactivar(1, item)"
                    >
                    mdi-check-decagram
                    </v-icon>
                </template>
            </template>
            <template v-slot:[`item.condicion`]="{ item }">
                <div v-if="item.condicion">
                    <v-icon
                        medium
                        class="mr-2 justify-center green--text"
                    >
                        mdi-check-decagram
                    </v-icon>
                </div>
                <div v-else>
                    <v-icon
                        medium
                        class="mr-2 justify-center"
                    >
                        mdi-check-decagram
                    </v-icon>
                </div>
            </template>
            <template v-slot:no-data>
                <v-btn
                color="primary"
                @click="listar"
                >
                Resetear
                </v-btn>
            </template>
            </v-data-table>
        </v-flex>
    </v-layout>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            usuarios: [],
            dialog: false,
            dialogDelete: false,
            headers: [
            { text: '', value: 'actions', sortable: false },
            { text: 'Rol', value: 'rol' },
            { text: 'Nombre', value: 'nombre' },
            { text: 'Tipo Doc.', value: 'tipodocumento' },
            { text: '# Doc.', value: 'numdocumento' },
            { text: 'Dirección', value: 'direccion' },
            { text: 'Teléfono', value: 'telefono', sortable: false },
            { text: 'Email', value: 'email', sortable: false },
            { text: 'Condición', value: 'condicion', sortable: false },
            ],
            search: '',
            editedIndex: -1,
            id: '',
            idrol: '',
            roles: [],
            nombre: '',
            tipodocumento: '',
            documentos: ['RUN', 'PASAPORTE', 'OTROS'],
            numdocumento: '',
            direccion: '',
            telefono: '',
            email: '',
            password: '',
            passwordAnt: '',
            pass_update: false,
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
            return this.editedIndex === -1 ? 'Nuevo Usuario' : 'Editar Usuario'
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
        this.listar();
        this.select();
    },
    methods: {
        listar() {
            let me = this;

            let header = {"Authorization": "Bearer " + this.$store.state.token};
            let configuracion = {headers: header};

            axios.get('api/usuarios/listar', configuracion).then(function(response) {
                //console.log(response);
                me.usuarios = response.data;
                console.log(me.usuarios);
            }).catch(function(error) {
                console.log(error);
            });
        },
        select() {
            let me = this;
            var rolesArray=[];

            let header = {"Authorization": "Bearer " + this.$store.state.token};
            let configuracion = {headers: header};

            axios.get('api/roles/select', configuracion).then(function(response) {
                rolesArray=response.data;

                rolesArray.map(function(x) {
                    me.roles.push({text: x.nombre, value: x.idrol});
                });
            }).catch(function(error) {
                console.log(error);
            });
        },
        editItem (item) {
            this.id = item.idusuario;
            this.idrol = item.idrol;
            this.nombre = item.nombre;
            this.tipodocumento = item.tipodocumento;
            this.numdocumento = item.numdocumento;
            this.direccion = item.direccion;
            this.telefono = item.telefono;
            this.email = item.email;
            this.password = item.passwordhash;
            this.passwordAnt = item.passwordhash;
            this.editedIndex = 1;
            this.dialog = true
        },

        close () {
            this.dialog = false;
            this.limpiar();
        },

        limpiar() {
            this.id = '';
            this.idrol = '';
            this.nombre = '';
            this.tipodocumento = '';
            this.numdocumento = '';
            this.direccion = '';
            this.telefono = '';
            this.email = '';
            this.password = '';
            this.passwordAnt = '';
            this.pass_update = false;
            this.editedIndex = -1;
        },
        guardar () {
            if (this.validar())
                return;
            
            let header = {"Authorization": "Bearer " + this.$store.state.token};
            let configuracion = {headers: header};

            if (this.editedIndex > -1) {
                let me = this;
                if(me.password != me.passwordAnt)
                    me.pass_update = true;

                axios.put('api/usuarios/editar', {
                    'idusuario': me.id,
                    'idrol': me.idrol,
                    'nombre': me.nombre,
                    'tipodocumento': me.tipodocumento,
                    'numdocumento': me.numdocumento,
                    'direccion': me.direccion,
                    'telefono': me.telefono,
                    'email': me.email,
                    'password': me.password,
                    'pass_update': me.pass_update
                }, configuracion).then(function(response) {
                    me.close();
                    me.listar();
                    me.limpiar();
                }).catch(function(error){
                    console.log(error);
                });
            } else {
                let me = this;
                axios.post('api/usuarios/crear', {
                    'idrol': me.idrol,
                    'nombre': me.nombre,
                    'tipodocumento': me.tipodocumento,
                    'numdocumento': me.numdocumento,
                    'direccion': me.direccion,
                    'telefono': me.telefono,
                    'email': me.email,
                    'password': me.password
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

            if (!this.idrol)
                this.validaMensaje.push("Seleccione un rol");

            if (!this.tipodocumento)
                this.validaMensaje.push("Seleccione un documento");

            if (!this.email)
                this.validaMensaje.push("Ingrese su Email");

            if (!this.password)
                this.validaMensaje.push("Ingrese una contraseña");

            if (this.validaMensaje.length)
                this.valida = 1;

            return this.valida;
        },
        activarDesactivar(accion, item) {
            this.adModal = 1;
            this.adNombre = item.nombre;
            this.adId = item.idusuario;
            if (accion == 1){
                this.adAccion = 1;
            } else if (accion == 2){
                this.adAccion = 2;
            } else {
                this.adAccion = 0;
            }
        },
        activarDesactivarCerrar() {
            this.adModal = 0;
        },
        activar() {
            let me = this;
            axios.put('api/usuarios/Activar/'+this.adId, {}, configuracion).then(function(response) {
                me.adModal = 0;
                me.adAccion = 0;
                me.adNombre = "";
                me.adId = "";
                me.listar();
            }).catch(function(error){
                console.log(error);
            });
        },
        desactivar() {
            let me = this;
            axios.put('api/usuarios/Desactivar/'+this.adId, {}, configuracion).then(function(response) {
                me.adModal = 0;
                me.adAccion = 0;
                me.adNombre = "";
                me.adId = "";
                me.listar();
            }).catch(function(error){
                console.log(error);
            });
        }
    }
}
</script>
