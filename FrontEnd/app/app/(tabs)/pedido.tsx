//app/(tabs)/pedidos.tsx
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
  ScrollView,
} from "react-native";
import { obtenerPedidos, agregarPedido, editarPedido, eliminarPedido } from "../../src/services/serPed";

const PedidosScreen = () => {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const [idUsuario, setIdUsuario] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [idEstado, setIdEstado] = useState("");

  const cargarPedidos = async () => {
    try {
      const data = await obtenerPedidos();
      setPedidos(data.filter((p) => p && (p.descripcion || p.id_usuario || p.id_estado)));
    } catch (error) {
      console.error(error);
      if (Platform.OS === "web") alert("No se pudieron cargar los pedidos");
      else Alert.alert("Error", "No se pudieron cargar los pedidos");
    }
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  const abrirAgregar = () => {
    setEditandoId(null);
    setIdUsuario("");
    setDescripcion("");
    setIdEstado("");
    setModalVisible(true);
  };

  const abrirEditar = (pedido: any) => {
    setEditandoId(pedido.id_pedido);
    setIdUsuario(pedido.id_usuario.toString());
    setDescripcion(pedido.descripcion);
    setIdEstado(pedido.id_estado.toString());
    setModalVisible(true);
  };

  const guardarPedido = async () => {
    if (!idUsuario || !descripcion || !idEstado) {
      if (Platform.OS === "web") alert("Todos los campos son obligatorios");
      else Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    const pedidoData = {
      id_usuario: Number(idUsuario),
      descripcion,
      id_estado: Number(idEstado),
    };

    try {
      if (editandoId === null) {
        await agregarPedido(pedidoData);
      } else {
        await editarPedido(editandoId, pedidoData);
      }
      setModalVisible(false);
      cargarPedidos();
    } catch (error) {
      console.error("Error guardando pedido:", error);
      if (Platform.OS === "web") alert("No se pudo guardar el pedido");
      else Alert.alert("Error", "No se pudo guardar el pedido");
    }
  };

  const handleEliminar = (id: number) => {
    if (!id) {
      if (Platform.OS === "web") alert("ID de pedido inválido");
      else Alert.alert("Error", "ID de pedido inválido");
      return;
    }

    const confirmar = () => {
      eliminarPedido(Number(id))
        .then(() => {
          if (Platform.OS === "web") alert("Pedido eliminado");
          else Alert.alert("Éxito", "Pedido eliminado");
          cargarPedidos();
        })
        .catch((error) => {
          console.error("Error al eliminar pedido:", error);
          if (Platform.OS === "web") alert("No se pudo eliminar el pedido");
          else Alert.alert("Error", "No se pudo eliminar el pedido");
        });
    };

    if (Platform.OS === "web") {
      if (window.confirm("¿Estás seguro de eliminar este pedido?")) {
        confirmar();
      }
    } else {
      Alert.alert("Eliminar Pedido", "¿Estás seguro de eliminar este pedido?", [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: confirmar },
      ]);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.fila}>
      <Text style={[styles.texto, styles.colUsuario]}>{item.id_usuario}</Text>
      <Text style={[styles.texto, styles.colDescripcion]}>{item.descripcion}</Text>
      <Text style={[styles.texto, styles.colEstado]}>{item.id_estado}</Text>
      <View style={[styles.botones, styles.colAcciones]}>
        <TouchableOpacity style={styles.botonEditar} onPress={() => abrirEditar(item)}>
          <Text style={styles.botonTexto}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botonEliminar} onPress={() => handleEliminar(item.id_pedido)}>
          <Text style={styles.botonTexto}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.botonAgregar} onPress={abrirAgregar}>
        <Text style={styles.botonTexto}>Agregar Pedido</Text>
      </TouchableOpacity>

      {pedidos.length === 0 ? (
        <Text style={styles.mensaje}>No hay pedidos registrados.</Text>
      ) : (
        <View style={{ flex: 1 }}>
          {/* Encabezados */}
          <View style={styles.encabezado}>
            <Text style={[styles.textoEncabezado, styles.colUsuario]}>Usuario</Text>
            <Text style={[styles.textoEncabezado, styles.colDescripcion]}>Descripción</Text>
            <Text style={[styles.textoEncabezado, styles.colEstado]}>Estado</Text>
            <Text style={[styles.textoEncabezado, styles.colAcciones]}>Acciones</Text>
          </View>

          <FlatList
            data={pedidos}
            keyExtractor={(item) => item.id_pedido.toString()}
            renderItem={renderItem}
          />
        </View>
      )}

      {/* Modal Agregar / Editar */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalFondo}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitulo}>{editandoId === null ? "Agregar Pedido" : "Editar Pedido"}</Text>
            <TextInput
              placeholder="ID Usuario"
              style={styles.input}
              value={idUsuario}
              onChangeText={setIdUsuario}
              keyboardType="numeric"
            />
            <TextInput
              placeholder="Descripción"
              style={styles.input}
              value={descripcion}
              onChangeText={setDescripcion}
            />
            <TextInput
              placeholder="ID Estado"
              style={styles.input}
              value={idEstado}
              onChangeText={setIdEstado}
              keyboardType="numeric"
            />
            <View style={styles.modalBotones}>
              <TouchableOpacity style={styles.botonGuardar} onPress={guardarPedido}>
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

export default PedidosScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  encabezado: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderColor: "#333",
    paddingVertical: 12,
    backgroundColor: "#eee",
  },
  fila: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 12,
  },
  colUsuario: { flex: 1, paddingHorizontal: 5, textAlign: "center" },
  colDescripcion: { flex: 3, paddingHorizontal: 5, textAlign: "center" },
  colEstado: { flex: 1, paddingHorizontal: 5, textAlign: "center" },
  colAcciones: { flex: 2, flexDirection: "row", justifyContent: "center" },
  textoEncabezado: { fontWeight: "bold", fontSize: 16, textAlign: "center" },
  texto: { fontSize: 16 },
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
  botonCancelar: { backgroundColor: "#f44336", padding: 10, borderRadius: 5, flex: 1, marginLeft: 5, alignItems: "center" },
});
