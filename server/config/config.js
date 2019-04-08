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
//  Base de datos
//=====================
let urlDB;
if(process.env.NODE_ENV === 'dev'){
  urlDB = 'mongodb://localhost:27017/cafe';
} else {
  urlDB = 'mongodb+srv://scarn:iPj482To3Iz7JXXj@cluster0-4lthx.mongodb.net/cafe';
}
process.env.URLDB = urlDB;