import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { loginUser } from "../../src/services/api"; // tu API fetch
import { saveUser, getUser, removeUser } from "../../src/services/auth"; // AsyncStorage

interface Usuario {
  id_usuario: number;
  nombre: string;
  correo: string;
  contrasena: string;
}

export default function Login() {
  const [correo, setCorreo] = useState<string>("");
  const [contrasena, setContrasena] = useState<string>("");
  const [mensaje, setMensaje] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    const cargarUsuario = async () => {
      const usuarioGuardado = await getUser();
      if (usuarioGuardado) {
        setUsuario(usuarioGuardado);
        setMensaje(`Bienvenido de nuevo, ${usuarioGuardado.nombre}`);
      }
    };
    cargarUsuario();
  }, []);

  const handleLogin = async () => {
    if (!correo || !contrasena) {
      Alert.alert("Campos vacíos", "Por favor ingresa tu correo y contraseña");
      return;
    }

    setLoading(true);
    try {
      const data = await loginUser(correo, contrasena);

      if (data.success) {
        setUsuario(data.usuario);
        setMensaje(`✅ Bienvenido ${data.usuario.nombre}`);
        await saveUser(data.usuario);
      } else {
        setMensaje(data.message || "❌ Credenciales inválidas");
      }
    } catch (error) {
      console.log(error);
      setMensaje("⚠️ Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await removeUser();
    setUsuario(null);
    setCorreo("");
    setContrasena("");
    setMensaje("Sesión cerrada");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {usuario ? (
        <>
          <Text style={styles.title}>Hola, {usuario.nombre}</Text>
          <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Text style={styles.buttonText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.title}>Login</Text>
          <TextInput
            style={styles.input}
            placeholder="Correo"
            value={correo}
            onChangeText={setCorreo}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            secureTextEntry
            value={contrasena}
            onChangeText={setContrasena}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Iniciar Sesión</Text>
            )}
          </TouchableOpacity>
        </>
      )}

      {mensaje ? <Text style={styles.mensaje}>{mensaje}</Text> : null}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, marginBottom: 15, padding: 10, borderRadius: 5 },
  button: { backgroundColor: "#007BFF", padding: 15, borderRadius: 5, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  mensaje: { marginTop: 20, textAlign: "center", fontSize: 16 },
});
