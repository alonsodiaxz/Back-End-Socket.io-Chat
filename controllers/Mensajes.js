const mensaje = require('../models/Mensaje');


const obtenerChat = async (req, res) => {
    const miId = req.uid;
    const mensajesDe = req.params.de;

    const last30 = await mensaje.find({
        //Condición de la búsqueda, que uno de los dos receptor o emisor tenga mi id y retornar los mensajes.
        $or:[
           {de: miId, para: mensajesDe },
           {de: mensajesDe, para:miId  } 
        ]
    })
    .sort({createdAt: 'asc'})//ordenados de forma descendent
    .limit(30); //Solo los 30 primeros



    res.json({
        ok: true,
        mensajes: last30  ,
        miId,
        mensajesDe  
    });
}

module.exports = {
    obtenerChat
}
