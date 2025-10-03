const express = require("express");
const app = express();
const PORT = 3000;

// Importamos conexión MySQL
const db = require("./db");

// Middleware para manejar JSON
app.use(express.json());

// Habilitar CORS para permitir conexiones desde el frontend
const cors = require("cors");
app.use(cors());

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("🚀 Servidor funcionando correctamente!");
});


//  SELECT de tabla usuarios
// ================================
app.get("/usuarios", (req, res) => {
  const sql = "SELECT * FROM usuarios";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error en la consulta:", err);
      return res.status(500).json({ error: "Error al obtener usuarios" });
    }
    res.json(results);
  });
});

// SELECT de tabla estados_pedido
app.get("/estados", (req, res) => {
  const sql = "SELECT * FROM estados_pedido";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error en la consulta:", err);
      return res.status(500).json({ error: "Error al obtener estados" });
    }
    res.json(results);
  });
});

//SELECT de tabla pedidos
app.get("/pedidos", (req, res) => {
  const sql = `
    SELECT p.id_pedido, u.nombre AS cliente, p.descripcion, p.fecha_pedido, e.nombre_estado
    FROM pedidos p
    INNER JOIN usuarios u ON p.id_usuario = u.id_usuario
    INNER JOIN estados_pedido e ON p.id_estado = e.id_estado
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error en la consulta:", err);
      return res.status(500).json({ error: "Error al obtener pedidos" });
    }
    res.json(results);
  });
});

// LOGIN de usuarios
app.post("/login", (req, res) => {
  const { correo, contrasena } = req.body;

  const sql = "SELECT * FROM usuarios WHERE correo = ? AND contrasena = ?";
  db.query(sql, [correo, contrasena], (err, results) => {
    if (err) {
      console.error("❌ Error en la consulta:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }

    if (results.length > 0) {
      res.json({ success: true, message: "✅ Login correcto", usuario: results[0] });
    } else {
      res.status(401).json({ success: false, message: "❌ Credenciales inválidas" });
    }
  });
});

// Iniciar servidor
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Servidor corriendo en http://0.0.0.0:${PORT}`);
});
