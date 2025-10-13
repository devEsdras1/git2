// app/(tabs)/usuario.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Platform,
  Dimensions,
  ScrollView
} from "react-native";
import { obtenerUsuarios, agregarUsuario, editarUsuario, eliminarUsuario } from "../../src/services/serUsu";

const { width: screenWidth } = Dimensions.get("window");

const UsuarioScreen = () => {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [rol, setRol] = useState("cliente");

  const cargarUsuarios = async () => {
    try {
      const data = await obtenerUsuarios();
      setUsuarios(data.filter(u => u && (u.nombre || u.correo || u.rol)));
    } catch (error) {
      console.error(error);
      if (Platform.OS === "web") alert("No se pudieron cargar los usuarios");
      else Alert.alert("Error", "No se pudieron cargar los usuarios");
    }
  };

  useEffect(() => { cargarUsuarios(); }, []);

  const abrirAgregar = () => {
    setEditandoId(null);
    setNombre(""); setCorreo(""); setContrasena(""); setRol("cliente");
    setModalVisible(true);
  };

  const abrirEditar = (usuario: any) => {
    setEditandoId(usuario.id_usuario);
    setNombre(usuario.nombre); setCorreo(usuario.correo); setContrasena(usuario.contrasena); setRol(usuario.rol);
    setModalVisible(true);
  };

  const guardarUsuario = async () => {
    if (!nombre || !correo || !contrasena || !rol) {
      if (Platform.OS === "web") alert("Todos los campos son obligatorios");
      else Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    const usuarioData = { nombre, correo, contrasena, rol };
    try {
      if (editandoId === null) await agregarUsuario(usuarioData);
      else await editarUsuario(editandoId, usuarioData);
      setModalVisible(false);
      cargarUsuarios();
    } catch (error) {
      console.error("Error guardando usuario:", error);
    }
  };

  const handleEliminar = (id: number) => {
    const confirmar = () => {
      eliminarUsuario(id)
        .then(() => cargarUsuarios())
        .catch(err => console.error(err));
    };
    if (Platform.OS === "web") {
      if (window.confirm("¿Estás seguro de eliminar este usuario?")) confirmar();
    } else {
      Alert.alert(
        "Eliminar Usuario",
        "¿Estás seguro de eliminar este usuario?",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Eliminar", style: "destructive", onPress: confirmar },
        ]
      );
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.fila}>
      <Text style={[styles.texto, styles.colNombre]}>{item.nombre}</Text>
      <Text style={[styles.texto, styles.colCorreo]}>{item.correo}</Text>
      <Text style={[styles.texto, styles.colRol]}>{item.rol}</Text>
      <View style={[styles.botones, { flex: 1 }]}>
        <TouchableOpacity style={styles.botonEditar} onPress={() => abrirEditar(item)}>
          <Text style={styles.botonTexto}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botonEliminar} onPress={() => handleEliminar(item.id_usuario)}>
          <Text style={styles.botonTexto}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.botonAgregar} onPress={abrirAgregar}>
        <Text style={styles.botonTexto}>Agregar Usuario</Text>
      </TouchableOpacity>

      {usuarios.length === 0 ? (
        <Text style={styles.mensaje}>No hay usuarios registrados.</Text>
      ) : (
        <ScrollView horizontal>
          <View style={{ width: screenWidth - 32 }}>
            <View style={styles.encabezado}>
              <Text style={[styles.textoEncabezado, styles.colNombre]}>Nombre</Text>
              <Text style={[styles.textoEncabezado, styles.colCorreo]}>Correo</Text>
              <Text style={[styles.textoEncabezado, styles.colRol]}>Rol</Text>
              <Text style={[styles.textoEncabezado, { flex: 1 }]}>Acciones</Text>
            </View>
            <FlatList
              data={usuarios}
              keyExtractor={(item) => item.id_usuario.toString()}
              renderItem={renderItem}
            />
          </View>
        </ScrollView>
      )}

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalFondo}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitulo}>{editandoId === null ? "Agregar Usuario" : "Editar Usuario"}</Text>
            <TextInput placeholder="Nombre" style={styles.input} value={nombre} onChangeText={setNombre} />
            <TextInput placeholder="Correo" style={styles.input} value={correo} onChangeText={setCorreo} keyboardType="email-address" />
            <TextInput placeholder="Contraseña" style={styles.input} value={contrasena} onChangeText={setContrasena} secureTextEntry />
            <TextInput placeholder="Rol (cliente/admin)" style={styles.input} value={rol} onChangeText={setRol} />
            <View style={styles.modalBotones}>
              <TouchableOpacity style={styles.botonGuardar} onPress={guardarUsuario}>
                <Text style={styles.botonTexto}>Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.botonCancelar} onPress={() => setModalVisible(false)}>
                <Text style={styles.botonTexto}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default UsuarioScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  encabezado: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderColor: "#333",
    paddingVertical: 12,
    backgroundColor: "#eee",
  },
  fila: { flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderColor: "#ccc", paddingVertical: 12 },
  colNombre: { flex: 2, paddingHorizontal: 5 },
  colCorreo: { flex: 3, paddingHorizontal: 5 },
  colRol: { flex: 1, paddingHorizontal: 5 },
  textoEncabezado: { fontWeight: "bold", fontSize: 16, textAlign: "center" },
  texto: { fontSize: 16, textAlign: "center" },
  botones: { flexDirection: "row" },
  botonAgregar: { backgroundColor: "#4CAF50", padding: 10, marginBottom: 10, borderRadius: 5, alignItems: "center" },
  botonEditar: { backgroundColor: "#2196F3", padding: 8, borderRadius: 5, marginRight: 5 },
  botonEliminar: { backgroundColor: "#f44336", padding: 8, borderRadius: 5 },
  botonTexto: { color: "#fff", fontWeight: "bold" },
  mensaje: { textAlign: "center", marginTop: 20, fontSize: 16 },
  modalFondo: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContainer: { backgroundColor: "#fff", padding: 20, borderRadius: 10, width: "90%" },
  modalTitulo: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 8, marginBottom: 10, borderRadius: 5 },
  modalBotones: { flexDirection: "row", justifyContent: "space-between" },
  botonGuardar: { backgroundColor: "#4CAF50", padding: 10, borderRadius: 5, flex: 1, marginRight: 5, alignItems: "center" },
  botonCancelar: { backgroundColor: "#f44336", padding: 10, borderRadius: 5, flex: 1, marginLeft: 5, alignItems: "center" }
});
