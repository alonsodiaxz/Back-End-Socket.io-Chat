/*
    path: api/login
*/
const { Router} = require('express');
const { check } = require('express-validator');
//Controladores
const { crearUsuario, login, renewLogin } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/Validar-campos');
const { validarJWT } = require('../middlewares/Validar-jwt');

const router = Router();

//ENDPOINTS
//Crear nuevos usuarios
router.post('/new', [
    check('nombre','El nombre es obligatorio').notEmpty(),
    check('password','El password es obligatorio').notEmpty(),
    check('email','El email es obligatorio').isEmail(),
    validarCampos
],crearUsuario);

//Login (Dentro de los corchetes comprobamos o checkeamos que los campos estén bien y llamamos a la clase que hace la validación.)
router.post('/', [
    check('email','El email es obligatorio').isEmail(),
    check('password','El password es obligatorio').notEmpty(),
    validarCampos
] ,login );

//Revalidar token
router.get('/renew', [
    validarJWT   //primero validas que el token que quieres revalidar, es válido
] ,renewLogin);


module.exports = router
