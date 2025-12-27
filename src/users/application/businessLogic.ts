import { UserAlreadyExistsException, UserNotFoundException } from "./exceptions";
import IUserRepository from "./ports/UserRepository"
import bcrypt from "bcrypt";

export default class BusinessLogic {

    constructor(
        private userRepository: IUserRepository
    ) { }

    // async obtenerPerfilCompleto(username) {
    //     const user = await this.buscarPorUserName(username)
    //     if (user == null || user == undefined) {
    //         throw new UsuarioInexistenteException("El usuario no existe")
    //     }

    //     const imagendao = new ImagenDAO()
    //     user.picture = await imagendao.obtenerImagenDePerfil(user.id)
    //     const pubs = await this.obtenerTodasLasPublicacionesPorUuid(user.id)
    //     return {
    //         pubs: pubs,
    //         user: user
    //     }
    // }

    // async buscarUsuariosConUsuarioSimilar(username) {
    //     const usuariosdao = new UsuariosDAO()
    //     let usuarios = []
    //     usuarios = await usuariosdao.obtenerListaPorUsuarioSimilar(username)
    //     return usuarios
    // }

    // async guardarImagenDePerfil(filename, uuid) {
    //     filename = '/public/upload/userpicture/' + filename;
    //     const imagendao = new ImagenDAO()
    //     //Buscar si tiene una imagen de perfil existente
    //     const tiene = await imagendao.obtenerImagenDePerfil(uuid)
    //     if (tiene == null) {
    //         //Sino crear un nuevo campo
    //         const imagen = new Imagen(uuid, filename)
    //         await imagendao.guardarImagenDePerfil(imagen.toJSON())
    //     } else {
    //         const ruta = tiene
    //         fs.unlinkSync(path.join(__dirname, "..", ruta))
    //         //Si la tiene, actualizarla
    //         await imagendao.cambiarImagenDePerfil(filename, uuid)
    //     }
    // }

    // async obtenerUsuarioPorUuid(uuid) {
    //     const dao = new UsuariosDAO()
    //     const encontrado = await dao.obtenerPorId(uuid)
    //     if (encontrado != null) {
    //         const imagendao = new ImagenDAO()
    //         encontrado.picture = await imagendao.obtenerImagenDePerfil(encontrado.id)
    //     }
    //     return encontrado
    // }

    // async agregarUsuario(bodyReq) {

    //     //Verificar que no haya uno con el mismo username
    //     let encontrado = await this.buscarPorUserName(bodyReq.body.username)

    //     if (encontrado != null) {
    //         throw new UsuarioExistenteError("El usuario ya existe en la base de datos")
    //     }

    //     const userInfo = bodyReq.body
    //     const user = new Usuario(
    //         userInfo.name,
    //         userInfo.username,
    //         userInfo.password
    //     )
    //     const dao = new UsuariosDAO()
    //     const uuid = await dao.insertarUno(user.toJSON())
    //     await agregarUsuario()
    //     return uuid
    // }

    // async inicioDeSesion(req) {
    //     const body = req.body
    //     const daousuarios = new UsuariosDAO()
    //     const usuario = await daousuarios
    //         .obtenerPorUserNameYPassword(body.username, body.password)
    //     return usuario
    // }

    async addFriend(username: string, usernameFriend: string) {
        const user = await this.userRepository.getUserByUsername(username)

        if (!user) {
            throw new UserNotFoundException("User not found");
        }

        const userFriend = await this.userRepository.getUserByUsername(usernameFriend)

        if (!userFriend) {
            throw new UserNotFoundException("User not found");
        }

        user.uuidFriendList.push(userFriend.uuid);
        userFriend.uuidFriendList.push(user.uuid);

        await this.userRepository.updateUser(user);
        await this.userRepository.updateUser(userFriend);
    }

    async login(username: string, plainPassword: string) {
        const user = await this.userRepository.getUserByUsername(username)

        if (!user) {
            throw new UserNotFoundException("User not found");
        }

        const isPasswordValid = await bcrypt.compare(plainPassword, user.password);

        if (!isPasswordValid) {
            throw new UserNotFoundException("Invalid password");
        }

        return user;
    }

    async getAllUsers() {
        return await this.userRepository.getAllUsers()
    }

    async createUser(username: string, password: string): Promise<string> {

        const user = await this.userRepository.getUserByUsername(username)

        if (user != null) {
            throw new UserAlreadyExistsException(`User with username ${username} already exists`);
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        await this.userRepository.createUser(username, hashPassword);

        return "User created successfully";
    }

}