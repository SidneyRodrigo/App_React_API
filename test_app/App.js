import React, {useEffect, useState, useRef} from 'react';
import {View} from 'react-native';
import {styles} from './styles.js';
import {requestForegroundPermissionsAsync, getCurrentPositionAsync, LocationObject, watchPositionAsync, LocationAccuracy} from 'expo-location';
import MapView, {Marker} from 'react-native-maps';

export default function App() 
{
  const [location, setLocation] = useState(null);

  const mapRef = useRef(null);

  async function requestLocationPermission()
  {
    const { granted } = await requestForegroundPermissionsAsync();

    if(granted)
    {
      const currentPosition = await getCurrentPositionAsync();
      setLocation(currentPosition);
    }
  }

  useEffect(() => 
  {
    requestLocationPermission();
    watchPositionAsync(
      {
        accuracy: LocationAccuracy.Highest,
        timeInterval: 1000,
        distanceInterval: 1,
      }, 
      (response) => 
      {
        setLocation(response);
        mapRef.current?.animateCamera(
          {
            center: response.coords,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          });
      });
  }, []);

  return (
    <View style = {styles.container}>
      {
        location &&
        <MapView ref = {mapRef} style = {styles.map} initialRegion = {{latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: 0.005, longitudeDelta: 0.005}}>
          <Marker coordinate = {{latitude: location.coords.latitude, longitude: location.coords.longitude}}></Marker>
        </MapView>
      }      
    </View>
  );
}