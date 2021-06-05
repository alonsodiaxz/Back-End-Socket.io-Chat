const Mensaje = require("../models/Mensaje");
const Usuario = require("../models/Usuario");


const usuarioConectado = async(uid) => {

    const usuario = await  Usuario.findById(uid); //Busca en la base de datos el usuario con ese uid, para extraer sus datos.
    usuario.online = true;
    await usuario.save(); //Lo actualizamos en la base de datos.
    return usuario;
}

const usuarioDesconectado = async(uid) => {

    const usuario = await Usuario.findById(uid);
    usuario.online = false;
    await usuario.save();
    return usuario;
}

const getUsuarios = async() => {
    //Recoger todos los elementos de la base de datos, con un orden (Primero los online y despues los offline)
    const usuarios = await Usuario
    .find()
    .sort('-online'); 
    return usuarios;
}

const grabarMensaje = async(mensaje) => {

    try {
        const message = new Mensaje(mensaje);
        await message.save();
        return message;
        

    } catch (error) {
        console.log(error);
    }
    
}

module.exports = {
    usuarioConectado,
    usuarioDesconectado,
    getUsuarios,
    grabarMensaje,
}