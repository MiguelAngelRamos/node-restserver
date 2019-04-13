// ====================
//  Puerto
//=====================
process.env.PORT = process.env.PORT || 3000;

// ====================
//  Entorno
//=====================
/* Para saber si estoy en desarroll o en produccion*/
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ====================
//  Vencimiento del token
//=====================
// 60 segundos * 60 minutos * 24 horas * 30 días
process.env.CADUCIDAD_TOKEN = '48h';

// ====================
//  SEED de autenticación
//=====================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo'; // en heroku existe una variable para produccion


// ====================
//  Base de datos
//=====================
let urlDB;
if(process.env.NODE_ENV === 'dev'){
  urlDB = 'mongodb://localhost:27017/cafe';
} else {
  urlDB = process.env.MONGO_URI; // MONGO_URI es una variable de configuracion que defini en heroku
}
process.env.URLDB = urlDB;

// ====================
//  Google Client ID
//=====================

process.env.CLIENT_ID = process.env.CLIENT_ID || '94580173554-4anfkuqjilmfs325ht2q0rsq8dvisqnh.apps.googleusercontent.com'