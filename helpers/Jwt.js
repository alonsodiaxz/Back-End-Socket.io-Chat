const jwt = require('jsonwebtoken')

const generarJWT = ( uid ) => {

    return new Promise( ( resolve, reject) => { //Resolve (bien), reject (mal)

        const payload = {uid};

        //Para firmar tenemos tres argumentos, el payload, la palabra clave, la configuración y el callback para ver si ha salido bien o no.
        jwt.sign(payload, process.env.JWT_KEY,{

            expiresIn: '24h'
        }, ( err, token) => {

            if( err){
                console.log(err);
                reject('No se pudo generar el JWT');
            }else{

                resolve(token);
            }

        }); //Generar el json web token

    });


}

const comprobarJWT = (token= '') => {
    try {
        const {uid} = jwt.verify(token, process.env.JWT_KEY );
        return [true, uid];
    } catch (error) {
        console.log(error);
        return [false, null];
    }

}

module.exports = {
    generarJWT,
    comprobarJWT
}