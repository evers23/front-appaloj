<template>
    <v-layout align-start>
        <v-flex>
            <v-data-table
            :headers="headers"
            :items="articulos"
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
                                <v-select v-model="idcategoria" :items="categorias" label="Categoria"></v-select>
                            </v-col>
                            <v-col cols="6" sm="6" md="6">
                                <v-text-field v-model="codigo" label="Código"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                                <v-text-field v-model="nombre" label="Nombre"></v-text-field>
                            </v-col>
                            <v-col cols="6" sm="6" md="6">
                                <v-text-field v-model.number="precio_venta" label="Precio Venta"></v-text-field>
                            </v-col>
                            <v-col cols="6" sm="6" md="6">
                                <v-text-field v-model.number="stock" label="Existencia"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="12" md="12">
                                <v-text-field v-model="descripcion" label="Descripción" ></v-text-field>
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
            articulos: [],
            dialog: false,
            dialogDelete: false,
            headers: [
            { text: '', value: 'actions', sortable: false },
            { text: 'Categoria', value: 'categoria' },
            { text: 'Código', value: 'codigo' },
            { text: 'Nombre', value: 'nombre' },
            { text: 'Precio', value: 'precio_venta' },
            { text: 'Existencia', value: 'stock' },
            { text: 'Descripción', value: 'descripcion', sortable: false },
            { text: 'Estado', value: 'condicion', sortable: false },
            ],
            search: '',
            editedIndex: -1,
            id: '',
            idcategoria: '',
            categorias: [],
            codigo: '',
            nombre: '',
            precio_venta: 0,
            stock: 0,
            descripcion: '',
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
            return this.editedIndex === -1 ? 'Nueva Articulo' : 'Editar Articulo'
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

            axios.get('api/articulos/listar', configuracion).then(function(response) {
                //console.log(response);
                me.articulos = response.data;
                console.log(me.articulos);
            }).catch(function(error) {
                console.log(error);
            });
        },
        select() {
            let me = this;
            var categoriasArray=[];

            let header = {"Authorization": "Bearer " + this.$store.state.token};
            let configuracion = {headers: header};

            axios.get('api/categorias/select', configuracion).then(function(response) {
                categoriasArray=response.data;

                categoriasArray.map(function(x) {
                    me.categorias.push({text: x.nombre, value: x.idcategoria});
                });
            }).catch(function(error) {
                console.log(error);
            });
        },
        editItem (item) {
            this.id = item.idarticulo;
            this.idcategoria = item.idcategoria;
            this.codigo = item.codigo;
            this.nombre = item.nombre;
            this.precio_venta = item.precio_venta;
            this.stock = item.stock;
            this.descripcion = item.descripcion;
            this.editedIndex = 1;
            this.dialog = true
        },

        close () {
            this.dialog = false;
            this.limpiar();
        },

        limpiar() {
            this.id = '';
            this.idcategoria = '';
            this.codigo = '';
            this.nombre = '';
            this.precio_venta = 0;
            this.stock = 0;
            this.descripcion = '';
            this.editedIndex = -1;
        },
        guardar () {
            if (this.validar())
                return;
            
            let header = {"Authorization": "Bearer " + this.$store.state.token};
            let configuracion = {headers: header};

            if (this.editedIndex > -1) {
                let me = this;
                axios.put('api/articulos/editar', {
                    'idarticulo': me.id,
                    'idcategoria': me.idcategoria,
                    'codigo': me.codigo,
                    'nombre': me.nombre,
                    'precio_venta': me.precio_venta,
                    'stock': me.stock,
                    'descripcion': me.descripcion
                }, configuracion).then(function(response) {
                    me.close();
                    me.listar();
                    me.limpiar();
                }).catch(function(error){
                    console.log(error);
                });
            } else {
                let me = this;
                axios.post('api/articulos/crear', {
                    'idcategoria': me.idcategoria,
                    'codigo': me.codigo,
                    'nombre': me.nombre,
                    'precio_venta': me.precio_venta,
                    'stock': me.stock,
                    'descripcion': me.descripcion
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

            if (!this.idcategoria)
                this.validaMensaje.push("Seleccione una categoria");

            if (!this.stock || this.stock == 0)
                this.validaMensaje.push("Ingrese stock inicial del articulo");

            if (!this.precio_venta || this.precio_venta == 0)
                this.validaMensaje.push("Ingrese precio de venta del articulo");

            if (this.validaMensaje.length)
                this.valida = 1;

            return this.valida;
        },
        activarDesactivar(accion, item) {
            this.adModal = 1;
            this.adNombre = item.nombre;
            this.adId = item.idarticulo;
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

            let header = {"Authorization": "Bearer " + this.$store.state.token};
            let configuracion = {headers: header};

            axios.put('api/articulos/Activar/'+this.adId, {}, configuracion).then(function(response) {
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
            axios.put('api/articulos/Desactivar/'+this.adId, {}, configuracion).then(function(response) {
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
