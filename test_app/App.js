import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function App() {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          console.log("Permissão de localização não concedida.");
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        fetch(`http://192.168.1.67:3001/api/localizacao?latitude=${latitude}&longitude=${longitude}`)
          .then(response => response.json())
          .then(data => {
            console.log("Dados da API:", data);
            setLocation({ latitude: data.latitude, longitude: data.longitude });
          })
          .catch(error => {
            console.error("Erro ao chamar a API:", error);
          });
      } catch (error) {
        console.error("Erro ao obter a localização:", error);
      }
    };

    requestLocationPermission();
  }, []);

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            title="Minha Localização"
          />
        </MapView>
      ) : (
        <Text>Obtendo localização...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    flex: 1,
    width: '100%',
  },
});
