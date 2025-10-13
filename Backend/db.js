//backend/db.js

const mysql = require("mysql2");

// 🔹 Configuración de la conexión
const connection = mysql.createConnection({
  host: "localhost",    
  user: "root",          
  password: "12345",       
  database: "seguimiento_pedidos"
});

// 🔹 Conexión
connection.connect((err) => {
  if (err) {
    console.error("❌ Error al conectar a la base de datos:", err.message);
    return;
  }
  console.log("✅ Conectado a la base de datos MySQL");
});

module.exports = connection;
