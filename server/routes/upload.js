const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs  = require('fs');
const path = require('path');


app.use(fileUpload({useTempFiles:true}));
// cuando se carga esta funcion todos los archivo que se carguen caen en req.files

app.put('/upload/:tipo/:id', (req, res)=>{

  let tipo = req.params.tipo;
  let id = req.params.id;
  if(!req.files){
    return res.status(400).json({
      ok: false,
      err: {
        message: 'No se ha seleccionado ningun archivo'
      }
    });
  }

  // valida tipo
  let tiposValidos=['usuarios', 'productos'];
  // si es menor a cero quire decir que no encontro nada
  if(tiposValidos.indexOf(tipo)<0){
      return res.status(400).json({
        ok:false,
        err:{
          message: 'Los tipos permitidos son: '+tiposValidos.join(', '),
          tipo
        }
      })
  }
  // si viene un archivo
  let archivo = req.files.archivo;
  let nombreCortado = archivo.name.split('.');
  let extension = nombreCortado[nombreCortado.length-1]

  // Extensiones Permitidas
  let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    if(extensionesValidas.indexOf(extension)<0){
      return res.status(400).json({
        ok:false,
        err:{
          message: 'Las extensiones permitadas son: '+extensionesValidas.join(', '),
          ext: extension
        }
      })
    }
  // cambiar el nombre al archivo
  let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;
  // mover el archivo al directorio que queremos
  console.log(nombreArchivo)
  archivo.mv(`uploads/${tipo}/${nombreArchivo}`,(err)=>{
    if(err){
     return res.status(500).json({
       ok: false,
       err
     })
    }
    // Aqui, en este punto la imagen esta cargada
    if(tipo === 'usuarios'){
      imagenUsuario(id, res, nombreArchivo);
    }
    else{
      imagenProducto(id, res, nombreArchivo)
    }

  });
});

function imagenUsuario(id, res, nombreArchivo){
  Usuario.findById(id, (err, usuarioDB)=>{
    if(err){
      // aunque suceda un error la imagen se carga igual entonces necesito eliminarla
      // no puedo usar el usuarioDB.img dado que no existe por que hubo un error en su
      // lugar uso nombreArchivo
      borraArchivo(nombreArchivo, 'usuarios');
      return res.status(500).json({
        ok:false,
        err
      });
    }

    if (!usuarioDB) {
      borraArchivo(nombreArchivo, 'usuarios');
      return res.status(400).json({
        ok: false,
        err:{
          message: 'Usuario no existe'
        }
      });
    }
    borraArchivo(usuarioDB.img, 'usuarios');

    usuarioDB.img = nombreArchivo;
    usuarioDB.save((err, usuarioGuardado)=>{
      res.json({
        ok:true,
        usuario: usuarioGuardado,
        img: nombreArchivo
      })
    })
  })
}

function imagenProducto(id, res, nombreArchivo){

  Producto.findById(id, (err, productoDB) => {
    if (err) {
      // aunque suceda un error la imagen se carga igual entonces necesito eliminarla
      // no puedo usar el usuarioDB.img dado que no existe por que hubo un error en su
      // lugar uso nombreArchivo
      
      borraArchivo(nombreArchivo, 'productos');
      return res.status(500).json({
        ok: false,
        err,
        message:'Erro al buscar el producto en la base de datos'
      });
    }

    if (!productoDB) {
      borraArchivo(nombreArchivo, 'productos');
      return res.status(400).json({
        ok: false,
        err: {
          message: 'El producto no existe'
        }
      });
    }
    borraArchivo(productoDB.img, 'productos');

    productoDB.img = nombreArchivo;
    productoDB.save((err, productoGuardado) => {
      res.json({
        ok: true,
        producto: productoGuardado,
        img: nombreArchivo
      })
    })
  })
}
function borraArchivo(nombreImagen, tipo){
    // confirmar que la imagen exista
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImagen)) {
      // en caso que exista tengo que borrar este path
      fs.unlinkSync(pathImagen);
    }
}
module.exports = app;