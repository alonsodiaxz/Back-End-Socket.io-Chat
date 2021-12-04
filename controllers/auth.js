const { response } = require("express");
const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const { generarJWT } = require("../helpers/Jwt");

const crearUsuario = async (req, res = response) => {
  try {
    const { email, password } = req.body;

    //Verificar que el email no exista dentro de la base de datos.
    const existeEmail = await Usuario.findOne({ email });

    //En caso de que ya exista un email dentro de la base de datos, respondemos con status malo.
    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        msg: "El correo ya existe",
      });
    }

    const usuario = new Usuario(req.body);

    //Encriptar contraseña
    const salt = bcrypt.genSaltSync(); //Genera el número de saltos que realizará la encripptación, contra más saltos mejor. Utiliza 10 por defecto.
    usuario.password = bcrypt.hashSync(password, salt); //Genera el hash o encriptación de la cadena que le pases con el número de saltos establecido anteriormente

    //Guardar usuario en BD.
    await usuario.save();

    //Generar el JWT (JSON Web Token)
    const token = await generarJWT(usuario.id); //Es lo mismo que poner _id

    res.json({
      ok: true,
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuarioBD = await Usuario.findOne({ email });

    if (!usuarioBD) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no registrado en la base de datos",
      });
    }

    const validPassword = bcrypt.compareSync(password, usuarioBD.password);

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Password no es correcto",
      });
    }

    //Si llega a este punto s que ambos son válidos, por tanto, generamos el json web toker
    const token = await generarJWT(usuarioBD.id);

    res.json({
      ok: true,
      usuarioBD,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};
const renewLogin = async (req, res) => {
  //Obtener el uid del request
  const uid = req.uid;

  //Creamos el nuevo token con el uid obtenido
  const token = await generarJWT(uid);

  //Obtener el usuario por el uid
  const usuario = await Usuario.findById(uid); //Busca en la base de datos mongo la información de ese id.

  res.json({
    ok: true,
    msg: "renew",
    token,
    usuario,
  });
};

module.exports = {
  crearUsuario,
  login,
  renewLogin,
};
