//backend/server.js
const express = require("express");
const cors = require("cors");
const db = require("./db"); // Asegúrate que db.js esté correcto
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ==========================================================
// 🔹 Ruta principal
// ==========================================================
app.get("/", (req, res) => {
  res.send("🚀 Servidor funcionando correctamente!");
});




// ==========================================================
// 🔹 Login
// ==========================================================
app.post("/login", (req, res) => {
  const { correo, contrasena } = req.body;
  const sql = "SELECT * FROM usuarios WHERE correo = ? AND contrasena = ?";
  db.query(sql, [correo, contrasena], (err, results) => {
    if (err) return res.status(500).json({ success: false, error: "Error en el servidor" });

    if (results.length > 0) {
      res.json({ success: true, message: "Login correcto", usuario: results[0] });
    } else {
      res.status(401).json({ success: false, message: "Credenciales inválidas" });
    }
  });
});

// ==========================================================
// 🔹 CRUD de Usuarios
// ==========================================================

// Obtener todos los usuarios
app.get("/usuarios", (req, res) => {
  const sql = "SELECT * FROM usuarios";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ success: false, error: err });
    res.json(results);
  });
});

// Agregar un usuario
app.post("/usuarios", (req, res) => {
  const { nombre, correo, contrasena, rol } = req.body;
  const sql = "INSERT INTO usuarios (nombre, correo, contrasena, rol) VALUES (?, ?, ?, ?)";
  db.query(sql, [nombre, correo, contrasena, rol], (err, result) => {
    if (err) return res.status(500).json({ success: false, error: err });
    res.json({ success: true, id_usuario: result.insertId });
  });
});

// Editar usuario
app.put("/usuarios/:id", (req, res) => {
  const { id } = req.params;
  const { nombre, correo, contrasena, rol } = req.body;
  const sql = "UPDATE usuarios SET nombre = ?, correo = ?, contrasena = ?, rol = ? WHERE id_usuario = ?";
  db.query(sql, [nombre, correo, contrasena, rol, id], (err) => {
    if (err) return res.status(500).json({ success: false, error: err });
    res.json({ success: true });
  });
});

// Eliminar usuario
app.delete("/usuarios/:id", (req, res) => {
  const id = parseInt(req.params.id, 10); // 🔹 Convertir a number
  if (isNaN(id)) return res.status(400).json({ success: false, error: "ID inválido" });

  const sql = "DELETE FROM usuarios WHERE id_usuario = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ success: false, error: "Error al eliminar usuario" });
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    res.json({ success: true, message: "Usuario eliminado" });
  });
});
// ==========================================================
// 🔹 CRUD de Pedidos
// ==========================================================

// Obtener todos los pedidos (incluyendo info del usuario y estado)
app.get("/pedidos", (req, res) => {
  const sql = `
    SELECT p.id_pedido, p.descripcion, p.fecha_pedido, 
           u.id_usuario, u.nombre AS nombre_usuario, 
           e.id_estado, e.nombre_estado
    FROM pedidos p
    JOIN usuarios u ON p.id_usuario = u.id_usuario
    JOIN estados_pedido e ON p.id_estado = e.id_estado
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ success: false, error: err });
    res.json(results);
  });
});

// Agregar un pedido
app.post("/pedidos", (req, res) => {
  const { id_usuario, descripcion, id_estado } = req.body;
  const sql = "INSERT INTO pedidos (id_usuario, descripcion, id_estado) VALUES (?, ?, ?)";
  db.query(sql, [id_usuario, descripcion, id_estado], (err, result) => {
    if (err) return res.status(500).json({ success: false, error: err });
    res.json({ success: true, id_pedido: result.insertId });
  });
});

// Editar un pedido
app.put("/pedidos/:id", (req, res) => {
  const { id } = req.params;
  const { id_usuario, descripcion, id_estado } = req.body;
  const sql = "UPDATE pedidos SET id_usuario = ?, descripcion = ?, id_estado = ? WHERE id_pedido = ?";
  db.query(sql, [id_usuario, descripcion, id_estado, id], (err, result) => {
    if (err) return res.status(500).json({ success: false, error: err });
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "Pedido no encontrado" });
    res.json({ success: true });
  });
});

// Eliminar un pedido
app.delete("/pedidos/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ success: false, error: "ID inválido" });

  const sql = "DELETE FROM pedidos WHERE id_pedido = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ success: false, error: "Error al eliminar pedido" });
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "Pedido no encontrado" });
    res.json({ success: true, message: "Pedido eliminado" });
  });
});


// ==========================================================
// 🔹 CRUD de Estados de Pedido
// ==========================================================

// Obtener todos los estados
app.get("/estados", (req, res) => {
  const sql = `SELECT * FROM estados_pedido`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ success: false, error: err });
    res.json(results);
  });
});

// Obtener un estado por ID
app.get("/estados/:id", (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM estados_pedido WHERE id_estado = ?`;
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ success: false, error: err });
    if (results.length === 0) return res.status(404).json({ success: false, message: "Estado no encontrado" });
    res.json(results[0]);
  });
});

// Agregar un nuevo estado
app.post("/estados", (req, res) => {
  const { nombre_estado } = req.body;
  if (!nombre_estado) return res.status(400).json({ success: false, message: "Nombre del estado es requerido" });

  const sql = `INSERT INTO estados_pedido (nombre_estado) VALUES (?)`;
  db.query(sql, [nombre_estado], (err, results) => {
    if (err) return res.status(500).json({ success: false, error: err });
    res.json({ success: true, id_estado: results.insertId });
  });
});

// Editar un estado existente
app.put("/estados/:id", (req, res) => {
  const { id } = req.params;
  const { nombre_estado } = req.body;
  if (!nombre_estado) return res.status(400).json({ success: false, message: "Nombre del estado es requerido" });

  const sql = `UPDATE estados_pedido SET nombre_estado = ? WHERE id_estado = ?`;
  db.query(sql, [nombre_estado, id], (err, results) => {
    if (err) return res.status(500).json({ success: false, error: err });
    res.json({ success: true });
  });
});

// Eliminar un estado
app.delete("/estados/:id", (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM estados_pedido WHERE id_estado = ?`;
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ success: false, error: err });
    res.json({ success: true });
  });
});



// ==========================================================
// 🔹 Iniciar servidor
// ==========================================================
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Servidor corriendo en http://0.0.0.0:${PORT}`);
});
// === NUEVA RUTA PARA OBTENER TODAS LAS TABLAS ===
app.get('/tablas', async (req, res) => {
  try {
    const [usuarios] = await db.query('SELECT * FROM usuarios');
    const [pedidos] = await db.query('SELECT * FROM pedidos');
    const [estados_pedido] = await db.query('SELECT * FROM estados_pedido');
    
    res.json({
      usuarios,
      pedidos,
      estados_pedido
    });
  } catch (error) {
    console.error('Error al obtener las tablas:', error);
    res.status(500).json({ error: 'Error al obtener las tablas' });
  }
});
