const jwt = require('jsonwebtoken');
// =======================
// Verificar Token
// =======================
let verificaToken = (req, res, next)=>{
  let token = req.get('Authorization');
  // comprobar que el token sea valido
  jwt.verify(token, process.env.SEED, (err, decoded) => {
    // decoded es el payload (informacion del usuario)
    if(err){
      return res.status(401).json({
        ok:'false',
        err:{
          message: 'Token no válido'
        }
      });
    }
    req.usuario = decoded.usuario;
    next();
  });
  
};
// =======================
// Verificar AdminRole
// =======================
let verificaAdmin_Role = (req, res, next)=>{
  let usuario = req.usuario;
  if(usuario.role === 'ADMIN_ROLE'){
    next();
  }else{
    return res.json({
      ok: false,
      err: {
        message: 'El usuario no es administrador'
      }
    })
  }
  }

  // ============================
  // Verificar Token Img por Url
  // ===========================
  let verificaTokenImg = (req, res, next) => {
    let token = req.query.token;
    jwt.verify(token, process.env.SEED, (err, decoded) => {
      // decoded es el payload (informacion del usuario)
      if (err) {
        return res.status(401).json({
          ok: 'false',
          err: {
            message: 'Token no válido'
          }
        });
      }
      req.usuario = decoded.usuario;
      next();
    });
  }

module.exports = {
  verificaToken,
  verificaAdmin_Role,
  verificaTokenImg
}