import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_KEY = "usuario_logueado";

export const saveUser = async (usuario: any) => {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(usuario));
  } catch (error) {
    console.error("Error guardando usuario:", error);
  }
};

export const getUser = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(USER_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error("Error obteniendo usuario:", error);
    return null;
  }
};

export const removeUser = async () => {
  try {
    await AsyncStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error("Error eliminando usuario:", error);
  }
};
