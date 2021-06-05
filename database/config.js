const mongoose = require('mongoose');

const dbConnection = async() => {

    try {

        //Es asíncrono, ponemos el await para que espere el resultado de la conexión.
        await mongoose.connect(process.env.DB_CNN_STRING,{
            //Para evitar warnings
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useCreateIndex: true
        });

        console.log('Conectado a la bbdd');
        
    } catch (error) {
        console.log(error);
        throw new Error('Error en la base de datos- vea logs');
    }

}

module.exports = {
    dbConnection
}