const PublicacionesDAO = require('../DAO/PublicacionesDAO')
const UsuariosDAO = require('../DAO/UsuariosDAO')
const Usuario = require('../users/domain/User')
const UsuarioExistenteError = require('../Dominio/excepciones/UsuarioExistenteError')
const UsuarioInexistenteException = require('../Dominio/excepciones/UsuarioInexistenteException')
const Publicacion = require('../posts/domain/post')
const ImagenDAO = require('../DAO/ImagenDAO')
const Imagen = require('../Dominio/Imagen')
const fs = require('fs')
const path = require('path')

class Logica {

    constructor() {

    }

    /**
     * String con el formato uuid de la libreria uuis
     * @param {String} uuid 
     */
    async traerPublicacionesDeAmigos(uuid) {
        //Traemos a los amigos de esta persona
        const daousuarios = new UsuariosDAO()
        let friendList = await daousuarios.obtenerSoloAmigos(uuid)
        //Por cada amigo traemos 10 publicaciones resientes
        const publicacionesdao = new PublicacionesDAO()
        const pubs = [];
        for (let i = 0; i < friendList.length; i++) {
            pubs[i] = await publicacionesdao.obtenerDiezResientes(friendList[i])
        }
        return pubs
    }

    async obtenerTodasLasPublicaciones(usuario) {
        const dao = new PublicacionesDAO()
        const pubs = await dao.obtenerTodasPorUsuario(usuario)
        return pubs;
    }

    async obtenerTodasLasPublicacionesPorUuid(uuid) {
        const dao = new PublicacionesDAO()
        let pubs = await dao.obtenerTodasPorUuid(uuid);
        return pubs;
    }

    async esMiAmigo(username, uuid) {
        const daousuarios = new UsuariosDAO()
        const usuario = await daousuarios.obtenerPorUserName(username)
        const esMiAmigo = usuario.friendList.indexOf(uuid) >= 0 ? true : false;
        return esMiAmigo
    }

    async loSigo(myuuid, theiruuid) {
        const daousuarios = new UsuariosDAO()
        const usuario = await daousuarios.obtenerPorUserName(myuuid)
        const loSigo = usuario.friendList.indexOf(theiruuid) >= 0 ? true : false;
        return loSigo
    }

}

module.exports = Logica