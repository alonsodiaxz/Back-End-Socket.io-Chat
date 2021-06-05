const { response } = require('express')
const jwt = require('jsonwebtoken')

//La validación del token se va a producir una vez el usuario esta dentro y recarga el navegador o se intenta conectar de nuevo al server.
const validarJWT = (req, res, next) => {

    try {

        const token = req.header('x-token');

        if(!token){
            return res.status(401).json({
                ok: false,
                msg: 'No hay token en la petición'
            });

        }

        const payload = jwt.verify(token, process.env.JWT_KEY ); //Cuando obtenemos el payload, estamos obteniendo el id del jwt.
        const uid = payload.uid
        req.uid = uid

        next();
        
    } catch (error) {
        //Usuario no autorizado código 401.
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido.'
        });
    }
}

module.exports = {
    validarJWT
}