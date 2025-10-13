// frontend/src/services/serEst.ts
import axios from "axios";
import { Platform } from "react-native";

const API_URL =
  Platform.OS === "web"
    ? "http://localhost:3000"
    : "https://teresa-unspeculative-nondeviously.ngrok-free.dev";

// 🔹 Obtener todos los estados
export const obtenerEstados = async () => {
  try {
    if (Platform.OS === "web") {
      const res = await fetch(`${API_URL}/estados`);
      return await res.json();
    } else {
      const res = await axios.get(`${API_URL}/estados`);
      return res.data;
    }
  } catch (error) {
    console.error("Error al obtener estados:", error);
    return [];
  }
};

// 🔹 Agregar estado
export const agregarEstado = async (estado: any) => {
  try {
    if (Platform.OS === "web") {
      const res = await fetch(`${API_URL}/estados`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(estado),
      });
      return await res.json();
    } else {
      const res = await axios.post(`${API_URL}/estados`, estado);
      return res.data;
    }
  } catch (error) {
    console.error("Error al agregar estado:", error);
    return { success: false };
  }
};

// 🔹 Editar estado
export const editarEstado = async (id: number, estado: any) => {
  try {
    if (Platform.OS === "web") {
      const res = await fetch(`${API_URL}/estados/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(estado),
      });
      return await res.json();
    } else {
      const res = await axios.put(`${API_URL}/estados/${id}`, estado);
      return res.data;
    }
  } catch (error) {
    console.error("Error al editar estado:", error);
    return { success: false };
  }
};

// 🔹 Eliminar estado
export const eliminarEstado = async (id: number) => {
  try {
    if (Platform.OS === "web") {
      const res = await fetch(`${API_URL}/estados/${id}`, { method: "DELETE" });
      return await res.json();
    } else {
      const res = await axios.delete(`${API_URL}/estados/${id}`);
      return res.data;
    }
  } catch (error) {
    console.error("Error al eliminar estado:", error);
    return { success: false };
  }
};
