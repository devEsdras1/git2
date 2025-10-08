import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { getTablas } from "../../src/services/api";

interface Props {
  onLogout: () => void;
}

export default function Tablas({ onLogout }: Props) {
  const [tablas, setTablas] = useState<string[]>([]);

  useEffect(() => {
    const fetchTablas = async () => {
      const data = await getTablas();
      setTablas(data);
    };
    fetchTablas();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tablas de la Base de Datos</Text>
      <FlatList
        data={tablas}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>{item}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={[styles.button, { backgroundColor: "red" }]} onPress={onLogout}>
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  button: { padding: 15, backgroundColor: "#007BFF", marginBottom: 10, borderRadius: 5 },
  buttonText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
});
