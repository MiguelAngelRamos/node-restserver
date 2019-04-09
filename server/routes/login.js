const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require ('jsonwebtoken');
const Usuario = require('../models/usuario');
const app = express();

// Autenticacion mediante post
app.post('/login', (req, res)=>{
  let body = req.body;
  // verificiar si el correo existe
  Usuario.findOne({email:body.email}, (err, usuarioDB)=>{
    if(err){
      return res.status(500).json({
        ok:false,
        err
      });
    }
    // verificar si no viene un usuario es decir el usuario no existe por el correo mal escrito que no genera ningun vinculo con algun usuario
    if(!usuarioDB){
      return res.status(400).json({
        ok:false,
        err:{
          message: '(Usuario) o contraseña incorrectos'
        }
      })
    }

    // evaluar la contraseña
    if(!bcrypt.compareSync( body.password, usuarioDB.password)){
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Usuario o (contraseña) incorrectos'
        }
      });
    }
    let token = jwt.sign({
      usuario: usuarioDB
    }, process.env.SEED,{expiresIn: process.env.CADUCIDAD_TOKEN})
    res.json({
      ok:true,
      usuario:usuarioDB,
      token
    })
  })
 
})

module.exports = app;
