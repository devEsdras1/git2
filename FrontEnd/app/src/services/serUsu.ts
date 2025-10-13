// frontend/src/services/serUsu.ts
import axios from "axios";
import { Platform } from "react-native";

const API_URL =
  Platform.OS === "web"
    ? "http://localhost:3000"
    : "https://teresa-unspeculative-nondeviously.ngrok-free.dev";

// 🔹 Obtener todos los usuarios
export const obtenerUsuarios = async () => {
  try {
    if (Platform.OS === "web") {
      const res = await fetch(`${API_URL}/usuarios`);
      return await res.json();
    } else {
      const res = await axios.get(`${API_URL}/usuarios`);
      return res.data;
    }
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return [];
  }
};

// 🔹 Agregar usuario
export const agregarUsuario = async (usuario: any) => {
  try {
    if (Platform.OS === "web") {
      const res = await fetch(`${API_URL}/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario),
      });
      return await res.json();
    } else {
      const res = await axios.post(`${API_URL}/usuarios`, usuario);
      return res.data;
    }
  } catch (error) {
    console.error("Error al agregar usuario:", error);
    return { success: false };
  }
};

// 🔹 Editar usuario
export const editarUsuario = async (id: number, usuario: any) => {
  try {
    if (Platform.OS === "web") {
      const res = await fetch(`${API_URL}/usuarios/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario),
      });
      return await res.json();
    } else {
      const res = await axios.put(`${API_URL}/usuarios/${id}`, usuario);
      return res.data;
    }
  } catch (error) {
    console.error("Error al editar usuario:", error);
    return { success: false };
  }
};

// 🔹 Eliminar usuario
export const eliminarUsuario = async (id: number) => {
  try {
    if (Platform.OS === "web") {
      const res = await fetch(`${API_URL}/usuarios/${id}`, { method: "DELETE" });
      return await res.json();
    } else {
      const res = await axios.delete(`${API_URL}/usuarios/${id}`);
      return res.data;
    }
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    return { success: false };
  }
};
