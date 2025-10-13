import React, { useState, useEffect } from "react";
import { View, TextInput, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { loginUser } from "../../src/services/api";
import { saveUser, getUser, removeUser } from "../../src/services/auth";

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [loading, setLoading] = useState(false);
  const [usuario, setUsuario] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const cargarUsuario = async () => {
      const usuarioGuardado = await getUser();
      if (usuarioGuardado) setUsuario(usuarioGuardado);
    };
    cargarUsuario();
  }, []);

  const handleLogin = async () => {
    const correoTrim = correo.trim();
    const contrasenaTrim = contrasena.trim();
    setError(null); // Limpiar error previo

    // Validación de campos
    if (!correoTrim && !contrasenaTrim) {
      setError("Por favor ingresa tu correo y contraseña");
      return;
    }
    if (!correoTrim) {
      setError("Por favor ingresa tu correo");
      return;
    }
    if (!contrasenaTrim) {
      setError("Por favor ingresa tu contraseña");
      return;
    }

    setLoading(true);
    try {
      const data = await loginUser(correoTrim, contrasenaTrim);

      if (data.success) {
        setUsuario(data.usuario);
        await saveUser(data.usuario);
      } else {
        setError(data.message || "Correo o contraseña incorrectos");
      }
    } catch (err) {
      console.error(err);
      setError("No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await removeUser();
    setUsuario(null);
    setCorreo("");
    setContrasena("");
    setError(null);
  };

  if (usuario) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Hola, {usuario.nombre}</Text>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/usuario')}>
          <Text style={styles.buttonText}>Usuarios</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/estado')}>
          <Text style={styles.buttonText}>Estados</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/pedido')}>
          <Text style={styles.buttonText}>Pedidos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: "#dc3545" }]} onPress={handleLogout}>
          <Text style={styles.buttonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo"
        placeholderTextColor="#999"
        value={correo}
        onChangeText={(text) => { setCorreo(text); if (error) setError(null); }}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#999"
        secureTextEntry
        value={contrasena}
        onChangeText={(text) => { setContrasena(text); if (error) setError(null); }}
      />

      {error && <Text style={styles.errorText}>{error}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Iniciar Sesión</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", marginBottom: 15, padding: 10, borderRadius: 5 },
  button: { backgroundColor: "#007BFF", padding: 15, borderRadius: 5, alignItems: "center", marginVertical: 5 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  errorText: { color: "red", marginBottom: 10, textAlign: "center" },
});
