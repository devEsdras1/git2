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
  ScrollView,
} from "react-native";
import { loginUser, getUsuarios, getEstados, getPedidos } from "../../src/services/api";
import { saveUser, getUser, removeUser } from "../../src/services/auth";

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [usuario, setUsuario] = useState<any>(null);

  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [estados, setEstados] = useState<any[]>([]);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [cargandoDatos, setCargandoDatos] = useState(false);

  useEffect(() => {
    const cargarUsuario = async () => {
      const usuarioGuardado = await getUser();
      if (usuarioGuardado) {
        setUsuario(usuarioGuardado);
        setMensaje(`Bienvenido de nuevo, ${usuarioGuardado.nombre}`);
        fetchTablas();
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
        fetchTablas();
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
    setUsuarios([]);
    setEstados([]);
    setPedidos([]);
  };

  const fetchTablas = async () => {
    setCargandoDatos(true);
    try {
      const [u, e, p] = await Promise.all([getUsuarios(), getEstados(), getPedidos()]);
      setUsuarios(u);
      setEstados(e);
      setPedidos(p);
    } catch (error) {
      console.error(error);
    } finally {
      setCargandoDatos(false);
    }
  };

  const renderTabla = (titulo: string, data: any[]) => (
    <View style={{ marginVertical: 10 }}>
      <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 5 }}>{titulo}</Text>
      {data.length === 0 ? (
        <Text style={{ fontStyle: "italic" }}>No hay datos</Text>
      ) : (
        data.map((item, index) => (
          <View key={index} style={{ padding: 10, borderWidth: 1, borderRadius: 5, marginBottom: 5, backgroundColor: "#f9f9f9" }}>
            {Object.entries(item).map(([key, value]) => (
              <Text key={key}>
                {key}: {value}
              </Text>
            ))}
          </View>
        ))
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      {usuario ? (
        <ScrollView>
          <Text style={styles.title}>Hola, {usuario.nombre}</Text>
          <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Text style={styles.buttonText}>Cerrar Sesión</Text>
          </TouchableOpacity>

          {cargandoDatos ? (
            <ActivityIndicator size="large" style={{ marginTop: 20 }} />
          ) : (
            <>
              {renderTabla("Usuarios", usuarios)}
              {renderTabla("Estados", estados)}
              {renderTabla("Pedidos", pedidos)}
            </>
          )}
        </ScrollView>
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
          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Iniciar Sesión</Text>}
          </TouchableOpacity>
        </>
      )}
      {mensaje ? <Text style={styles.mensaje}>{mensaje}</Text> : null}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
<<<<<<< Updated upstream
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, marginBottom: 15, padding: 10, borderRadius: 5 },
  button: { backgroundColor: "#007BFF", padding: 15, borderRadius: 5, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  mensaje: { marginTop: 20, textAlign: "center", fontSize: 16 },
=======
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center", color: "#000" },
  input: { borderWidth: 1, borderColor: "#ccc", marginBottom: 15, padding: 10, borderRadius: 5, backgroundColor: "#fff", color: "#000" },
  button: { backgroundColor: "#007BFF", padding: 15, borderRadius: 5, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  mensaje: { marginTop: 20, textAlign: "center", fontSize: 16, color: "#000" },
>>>>>>> Stashed changes
});
