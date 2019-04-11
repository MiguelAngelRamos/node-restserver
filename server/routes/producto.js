const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');

// =======================================
// Obtener los productos
// =======================================


app.get('/producto', verificaToken, (req, res)=>{
  // trae todos los productos
  // populate: usuario categoria
  // paginado
  let desde = req.query.desde || 0;
  desde = Number(desde);
  Producto.find({ disponible: true})
          .skip(desde)
          .limit(5)
          .populate('usuario','nombre email')
          .populate('categoria','descripcion')
          .exec((err, productos)=>{
            if(err){
              return res.status(500).json({
                ok: false,
                err
              });
            }
            res.json({
              ok:true,
              productos
            })
          })
});

// =======================================
// Obtener los producto por ID
// =======================================
app.get('/producto/:id',verificaToken, (req, res)=>{
  // trae un producto
  // populate: usuario categoria
  let id = req.params.id;

  Producto.findById(id)
           .populate('usuario', 'nombre email')
           .populate('categoria', 'descripcion')
           .exec((err, productoDB) => {
           if (err) {
             return res.status(500).json({
               ok:false,
               err
             });
           }
           // Si no existe un producto
           if (!productoDB) {
             return res.status(400).json({
               ok: false,
               err: {
                 message: 'ID no existe'
               }
             });
           }
           res.json({
             ok:true,
             producto:productoDB
           })
           }); // fin del exec
          
  
});

// =======================================
// Buscar productos
// =======================================

app.get('/productos/buscar/:termino', verificaToken, (req, res)=>{
  let termino = req.params.termino;
  // expresion regular
  let regex = new RegExp(termino,'i')
  Producto.find({nombre:regex})
          .populate('categoria','descripcion')
          .exec((err, productos)=>{
            if(err){
              return res.status(500).json({
                ok:false,
                err
              })
            }
            res.json({
              ok:true,
              productos
            })
          })
})


// =======================================
// Para crear un producto
// =======================================
app.post('/producto',verificaToken,(req, res) => {
  // Grabar el usuario
  // Grabar una categoria del listado
  let body = req.body;
  let producto = new Producto({
    usuario: req.usuario._id,
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    disponible: body.disponible,
    categoria: body.categoria
  });

  producto.save((err, productoDB)=>{
    if(err){
      return res.status(500).json({
        ok:false,
        err
      });
    }
    res.status(201).json({
      ok:true,
      producto: productoDB
    })
  })
});

// =======================================
// Actualizar un nuevo producto
// =======================================
app.put('/producto/:id', verificaToken, (req, res) => {
 
  let id = req.params.id;
  let body = req.body;
 
 Producto.findById(id, (err, productoDB)=>{

   if(err){
     return res.status(500).json({
       ok:false,
       err
     })
   }
   if(!productoDB){
     return res.status(400).json({
       ok:false,
       err: {
         message: 'El ID no existe'
       }
     });
   }

   // Actualizar el producto
   productoDB.nombre = body.nombre;
   productoDB.precioUni = body.precioUni;
   productoDB.categoria = body.categoria;
   productoDB.disponible = body.disponible;
   productoDB.descripcion = body.descripcion;

   // Guadar el producto actualizado
   productoDB.save((err, productoGuardado)=>{
     if(err){
       return res.status(500).json({
         ok:false,
         err
       })
     }
     // si logro guardar
     res.json({
       ok:true,
       producto: productoGuardado
     });
   })

 });

});

// =======================================
// Borrar un nuevo producto
// =======================================
app.delete('/producto/:id',verificaToken,(req, res) => {
  // Cambiar el estado de disponible a false
  let id = req.params.id;
  Producto.findById(id,(err, productoDB)=>{
    if(err){
      return res.status(500).json({
        ok:false,
        err
      })
    }
    if(!productoDB){
      return res.status(400).json({
        ok:false,
        err:{
          message: 'ID no existe'
        }
      })
    }
    productoDB.disponible = false;
    productoDB.save((err, productoBorrado)=>{
      if(err){
        return res.status(500).json({
          ok: false,
          err
        })
      }
      res.json({
        ok:true,
        producto:productoBorrado,
        message: 'Producto borrado'
      })
    })
  })

});


module.exports = app;
