/*
    Path: api/mensajes
*/

const  {Router} = require('express');
const { check } = require('express-validator');
const { obtenerChat } = require('../controllers/Mensajes');
//Controladores
const { validarJWT } = require('../middlewares/Validar-jwt');

const router = Router();

router.get('/:de', [validarJWT], obtenerChat);

module.exports = router