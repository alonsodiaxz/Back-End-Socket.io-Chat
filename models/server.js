// Servidor de Express
const express  = require('express');
const http     = require('http');
const socketio = require('socket.io');
const path     = require('path');
const Sockets  = require('./sockets');
const cors = require('cors');
const {dbConnection} = require('../database/config')


class Server {

    constructor() {

        this.app  = express();
        this.port = process.env.PORT;

        //Conectar  a BBDD
        dbConnection();

        // Http server
        this.server = http.createServer( this.app );
        
        // Configuraciones de sockets
        this.io = socketio( this.server, { /* configuraciones */ } );
    }

    middlewares() {
        // Desplegar el directorio público
        this.app.use( express.static( path.resolve( __dirname, '../public' ) ) );

        //Cors
        this.app.use( cors()) //Permitir cualquier petición de cualquier lugar.

        //Parseo del body a formato json.
        this.app.use(express.json());

        //API ENDPoints
        //EndPoint de autenticación (crear usuario, login, revalidar token)
        this.app.use('/api/login', require('../router/auth'));
        this.app.use('/api/mensajes',require('../router/mensajes'));
    }

    // Esta configuración se puede tener aquí o como propieda de clase
    // depende mucho de lo que necesites
    configurarSockets() {
        new Sockets( this.io );
    }

    execute() {

        // Inicializar Middlewares
        this.middlewares();

        // Inicializar sockets
        this.configurarSockets();

        // Inicializar Server
        this.server.listen( this.port, () => {
            console.log('Server corriendo en puerto:', this.port );
        });
    }

}

//Cors, permite que puedan hacer peticiones desde cualquier lugar del mundo al backend. Además de que direcciones son las válidas, etc.


module.exports = Server;