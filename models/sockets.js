const { usuarioConectado, usuarioDesconectado, getUsuarios, grabarMensaje, leerMensajes } = require("../controllers/sockets");
const { comprobarJWT } = require("../helpers/Jwt");


class Sockets {

    constructor( io ) {

        this.io = io;

        this.socketEvents();
    }

    socketEvents() {
        // On connection
        this.io.on('connection', async( socket ) => {

            const token =  socket.handshake.query['x-token']; //Funcion para recibir parámetros de una query, en este caso el token

            //TODO: Validar el jwt
            //Si el token no es válido desconectar
            const [valido, uid] = comprobarJWT(token); //Comprueba la validez del token

            if(!valido){
                console.log('Socket no identificado.');
                return socket.disconnect();
            }

            //TODO: Saber que usuario está activo mediante el UID
            const usuario =  await usuarioConectado(uid); //A partir del uid contenido dentro del token, identificamos el user en la bbdd
            console.log('Cliente conectado', uid, usuario.nombre );

            //TODO: Socket join
            //Unir al usuario conectado a una sala de socket.io
            socket.join(uid);

            //TODO: Emitir todos los usuarios conectados
            this.io.emit('lista-usuarios', await getUsuarios());

            //TODO: Escuchar cuando el cliente manda un mensaje
            //mensaje-personal
            socket.on('mensaje-personal', async(contenido) => {
                const mensaje = await grabarMensaje(contenido); //Almacenamos el mensaje y en la bbdd y lo extraemos con todos sus parámetros.
                const uidReceptor = contenido.para; 
                const uidEmisor = contenido.de;
                this.io.to(uidReceptor).emit('mensaje-personal', mensaje); //Enviamos el mensaje a la sala con el uid del receptor
                this.io.to(uidEmisor).emit('mensaje-personal', mensaje);
            })
           

            //TODO: Disconnect
            //Marcar que el usuario se desconecto
            socket.on('disconnect', async() => {
                
                const usuario = await usuarioDesconectado(uid);
                console.log('Cliente desconectado', uid, usuario.nombre);
                this.io.emit('lista-usuarios', await getUsuarios());
            })
        
        });
    }


}


module.exports = Sockets;
    
    
