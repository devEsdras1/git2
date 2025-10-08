const BASE_URL = "https://teresa-unspeculative-nondeviously.ngrok-free.dev";

interface LoginResponse {
  success: boolean;
  message?: string;
  usuario?: any;
}

// LOGIN
export const loginUser = async (correo: string, contrasena: string): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify({ correo, contrasena }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en loginUser:", error);
    return { success: false, message: "⚠️ Error al conectar con el servidor" };
  }
};

// GET tablas
export const getUsuarios = async () => {
  try {
    const response = await fetch(`${BASE_URL}/usuarios`, {
      headers: { "ngrok-skip-browser-warning": "true" },
    });
    return await response.json();
  } catch (error) {
    console.error("Error obteniendo usuarios:", error);
    return [];
  }
};

export const getEstados = async () => {
  try {
    const response = await fetch(`${BASE_URL}/estados`, {
      headers: { "ngrok-skip-browser-warning": "true" },
    });
    return await response.json();
  } catch (error) {
    console.error("Error obteniendo estados:", error);
    return [];
  }
};

export const getPedidos = async () => {
  try {
    const response = await fetch(`${BASE_URL}/pedidos`, {
      headers: { "ngrok-skip-browser-warning": "true" },
    });
    return await response.json();
  } catch (error) {
    console.error("Error obteniendo pedidos:", error);
    return [];
  }
};
