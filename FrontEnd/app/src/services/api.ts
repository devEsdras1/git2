// src/services/api.ts
const BASE_URL = "https://teresa-unspeculative-nondeviously.ngrok-free.dev";

interface LoginResponse {
  success: boolean;
  message?: string;
  usuario?: any;
}

export const loginUser = async (correo: string, contrasena: string): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo, contrasena }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en loginUser:", error);
    return { success: false, message: "⚠️ Error al conectar con el servidor" };
  }
};
