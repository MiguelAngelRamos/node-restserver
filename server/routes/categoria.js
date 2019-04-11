const express = require('express');

let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
let app = express();
let Categoria = require('../models/categoria');

// ==============================
// Mostrar todas las categorias
// ==============================
app.get('/categoria', verificaToken,(req, res)=>{
  // populate reviza los objectid es como la clave foranea
  Categoria.find({})
    .sort('descripcion')
    .populate('usuario','nombre email') 
    .exec((err, categorias) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }
    res.json({
      ok: true,
      categorias
    })
  })
});

// ==============================
// Mostrar una categoria por ID
// ==============================
app.get('/categoria/:id', verificaToken, (req, res)=>{
  // Categoria.findById(..);
  let id = req.params.id;
  Categoria.findById(id, (err, categoriaDB)=>{
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        err:{
          message: 'El ID no es correcto'
        }
      });
    }
    res.json({
      ok:true,
      categoria:categoriaDB
    })
  })
});

// ==============================
// Crear nueva Categoria
// ==============================
app.post('/categoria', verificaToken, (req, res)=>{
  // Regresa la nueva categoria
  // req.usuario._id
  let body = req.body;
  let categoria = new Categoria({
    descripcion: body.descripcion,
    usuario : req.usuario._id

  })
  // Guardamos la categoria
  categoria.save((err, categoriaDB)=>{

    if(err){
      return res.status(500).json({
        ok:false,
        err
      });
    }
    if(!categoriaDB){
      return res.status(400).json({
        ok:false,
        err
      });
    }
    res.json({
      ok:true,
      categoria:categoriaDB
    })
  });
});

// ==============================
// Actualizar Categoria
// ==============================
app.put('/categoria/:id', verificaToken, (req, res)=>{
  // Regresa la nueva categoria
  // req.usuario._id
  let id = req.params.id;
  let body = req.body;
  let desCategoria = {
    descripcion: body.descripcion
  }
  Categoria.findByIdAndUpdate(id,desCategoria, {new:true, runValidators:true, useFindAndModify:false},(err, categoriaDB)=>{

    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        err
      });
    }
    res.json({
      ok:true,
      categoria: categoriaDB
    })
  })
});

// ==============================
// Borrado de Categoria
// ==============================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res)=>{
  // Solo un admin puede borrar categorias
  // req.usuario._id
  let id = req.params.id;
  Categoria.findByIdAndRemove(id, (err, categoriaDB)=>{
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }
    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        err:{
          message:'El id no existe'
        }
      });
    }
    res.json({
      ok:true,
      message: 'Categoria Borrada'
    })
  })
});

module.exports = app;
