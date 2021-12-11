<template>
    <v-layout align-start>
        <v-flex>
            <v-data-table
            :headers="headers"
            :items="clientes"
            :search="search"
            sort-by="nombre"
            class="elevation-1"
            >
            <template v-slot:top>
                <v-toolbar
                flat
                >
                <v-toolbar-title>Clientes</v-toolbar-title>
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
        this.listar();
    },
    methods: {
        listar() {
            let me = this;

            let header = {"Authorization": "Bearer " + this.$store.state.token};
            let configuracion = {headers: header};

            axios.get('api/personas/listarcliente', configuracion).then(function(response) {
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

                axios.put('api/personas/editar', {
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
                axios.post('api/personas/crear', {
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
