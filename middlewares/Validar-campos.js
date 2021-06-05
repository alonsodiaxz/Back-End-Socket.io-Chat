const { validationResult } = require("express-validator");

const validarCampos = (req, res, next) => { //Los campos req, res y next los crea express automáticamente, cuando en la otra clase lo metemos en los corchetes.

    const errores = validationResult(req);

    if( !errores.isEmpty()){
        return res.status(400).json({
            ok: false,
            errors: errores.mapped()
        });

    }
    next() //Si no ha habido ningún error, llama al next para que se ejecute el código siguiente.


}

module.exports = {

    validarCampos
}