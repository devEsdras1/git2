//backend/api.ts
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

<<<<<<< HEAD




=======
// 🗑️ DELETE pedido
export const deletePedido = async (id: number) => {
  try {
    const response = await fetch(`${BASE_URL}/pedidos/${id}`, {
      method: "DELETE",
      headers: { "ngrok-skip-browser-warning": "true" },
    });
    return await response.json();
  } catch (error) {
    console.error("Error eliminando pedido:", error);
    return { success: false, message: "Error al eliminar" };
  }
};

// ✏️ UPDATE pedido
export const updatePedido = async (id: number, descripcion: string, id_estado: number) => {
  try {
    const response = await fetch(`${BASE_URL}/pedidos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify({ descripcion, id_estado }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error actualizando pedido:", error);
    return { success: false, message: "Error al actualizar" };
  }
};
>>>>>>> 2a72b18 (Modificacion del delet y update)
