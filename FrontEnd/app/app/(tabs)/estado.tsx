// app/(tabs)/estado.tsx
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
import { obtenerEstados, agregarEstado, editarEstado, eliminarEstado } from "../../src/services/serEst";

const { width: screenWidth } = Dimensions.get("window");

const EstadoScreen = () => {
  const [estados, setEstados] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [nombreEstado, setNombreEstado] = useState("");

  const cargarEstados = async () => {
    try {
      const data = await obtenerEstados();
      setEstados(data);
    } catch (error) {
      console.error(error);
      if (Platform.OS === "web") alert("No se pudieron cargar los estados");
      else Alert.alert("Error", "No se pudieron cargar los estados");
    }
  };

  useEffect(() => {
    cargarEstados();
  }, []);

  const abrirAgregar = () => {
    setEditandoId(null);
    setNombreEstado("");
    setModalVisible(true);
  };

  const abrirEditar = (estado: any) => {
    setEditandoId(estado.id_estado);
    setNombreEstado(estado.nombre_estado);
    setModalVisible(true);
  };

  const guardarEstado = async () => {
    if (!nombreEstado) {
      if (Platform.OS === "web") alert("El nombre del estado es obligatorio");
      else Alert.alert("Error", "El nombre del estado es obligatorio");
      return;
    }

    try {
      if (editandoId === null) {
        await agregarEstado({ nombre_estado: nombreEstado });
      } else {
        await editarEstado(editandoId, { nombre_estado: nombreEstado });
      }
      setModalVisible(false);
      cargarEstados();
    } catch (error) {
      console.error("Error guardando estado:", error);
      if (Platform.OS === "web") alert("No se pudo guardar el estado");
      else Alert.alert("Error", "No se pudo guardar el estado");
    }
  };

  const handleEliminar = (id: number) => {
    const confirmar = () => {
      eliminarEstado(id)
        .then(() => cargarEstados())
        .catch(err => console.error(err));
    };

    if (Platform.OS === "web") {
      if (window.confirm("¿Estás seguro de eliminar este estado?")) confirmar();
    } else {
      Alert.alert(
        "Eliminar Estado",
        "¿Estás seguro de eliminar este estado?",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Eliminar", style: "destructive", onPress: confirmar },
        ]
      );
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.fila}>
      <Text style={[styles.texto, styles.colNombre]}>{item.nombre_estado}</Text>
      <View style={[styles.botones, styles.colAcciones]}>
        <TouchableOpacity style={styles.botonEditar} onPress={() => abrirEditar(item)}>
          <Text style={styles.botonTexto}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botonEliminar} onPress={() => handleEliminar(item.id_estado)}>
          <Text style={styles.botonTexto}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.botonAgregar} onPress={abrirAgregar}>
        <Text style={styles.botonTexto}>Agregar Estado</Text>
      </TouchableOpacity>

      {estados.length === 0 ? (
        <Text style={styles.mensaje}>No hay estados registrados.</Text>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={true} contentContainerStyle={{ minWidth: screenWidth }}>
          <View style={{ width: screenWidth * 1.2 }}> {/* ancho dinámico */}
            <View style={styles.encabezado}>
              <Text style={[styles.textoEncabezado, styles.colNombre]}>Nombre Estado</Text>
              <Text style={[styles.textoEncabezado, styles.colAcciones]}>Acciones</Text>
            </View>
            <FlatList
              data={estados}
              keyExtractor={(item) => item.id_estado.toString()}
              renderItem={renderItem}
            />
          </View>
        </ScrollView>
      )}

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalFondo}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitulo}>{editandoId === null ? "Agregar Estado" : "Editar Estado"}</Text>
            <TextInput
              placeholder="Nombre Estado"
              style={styles.input}
              value={nombreEstado}
              onChangeText={setNombreEstado}
            />
            <View style={styles.modalBotones}>
              <TouchableOpacity style={styles.botonGuardar} onPress={guardarEstado}>
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

export default EstadoScreen;

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
  colNombre: { flex: 3, paddingHorizontal: 10, textAlign: "center" },
  colAcciones: { flex: 2, flexDirection: "row", justifyContent: "center" },
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
