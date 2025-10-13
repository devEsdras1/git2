// frontend/src/services/serPed.ts
import axios from "axios";
import { Platform } from "react-native";

const API_URL =
  Platform.OS === "web"
    ? "http://localhost:3000"
    : "https://teresa-unspeculative-nondeviously.ngrok-free.dev";

// 🔹 Obtener todos los pedidos
export const obtenerPedidos = async () => {
  try {
    if (Platform.OS === "web") {
      const res = await fetch(`${API_URL}/pedidos`);
      return await res.json();
    } else {
      const res = await axios.get(`${API_URL}/pedidos`);
      return res.data;
    }
  } catch (error) {
    console.error("Error al obtener pedidos:", error);
    return [];
  }
};

// 🔹 Agregar pedido
export const agregarPedido = async (pedido: any) => {
  try {
    if (Platform.OS === "web") {
      const res = await fetch(`${API_URL}/pedidos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedido),
      });
      return await res.json();
    } else {
      const res = await axios.post(`${API_URL}/pedidos`, pedido);
      return res.data;
    }
  } catch (error) {
    console.error("Error al agregar pedido:", error);
    return { success: false };
  }
};

// 🔹 Editar pedido
export const editarPedido = async (id: number, pedido: any) => {
  try {
    if (Platform.OS === "web") {
      const res = await fetch(`${API_URL}/pedidos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedido),
      });
      return await res.json();
    } else {
      const res = await axios.put(`${API_URL}/pedidos/${id}`, pedido);
      return res.data;
    }
  } catch (error) {
    console.error("Error al editar pedido:", error);
    return { success: false };
  }
};

// 🔹 Eliminar pedido
export const eliminarPedido = async (id: number) => {
  try {
    if (Platform.OS === "web") {
      const res = await fetch(`${API_URL}/pedidos/${id}`, { method: "DELETE" });
      return await res.json();
    } else {
      const res = await axios.delete(`${API_URL}/pedidos/${id}`);
      return res.data;
    }
  } catch (error) {
    console.error("Error al eliminar pedido:", error);
    return { success: false };
  }
};
