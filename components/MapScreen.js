import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Image } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';

const MapScreen = ({ route }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { destination } = route.params;

  useEffect(() => {
    (async () => {
      try {
        // Request location permissions
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Permission to access location was denied');
          setLoading(false);
          return;
        }

        // Get current location
        let location = await Location.getCurrentPositionAsync({});
        const currentLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setCurrentLocation(currentLocation);

        // Fetch route
        if (destination) {
          fetchRoute(currentLocation, destination);
        } else {
          setError('Destination is not available');
          setLoading(false);
        }
      } catch (err) {
        setError('Error fetching location');
        setLoading(false);
      }
    })();
  }, [destination]);

  const fetchRoute = async (origin, destination) => {
    const MAPBOX_TOKEN =  "sk.eyJ1IjoibmV4dHJpbGxpb24tdGVjaCIsImEiOiJjbHpnaHdiaTkxb29xMmpxc3V5bTRxNWNkIn0.l4AsMHEMhAEO90klTb3oCQ"; // Replace with your actual Mapbox API key
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?geometries=geojson&access_token=${MAPBOX_TOKEN}`;

    try {
      const response = await axios.get(url);
      const coordinates = response.data.routes[0]?.geometry?.coordinates;

      if (coordinates) {
        const routeCoords = coordinates.map(point => ({
          latitude: point[1],
          longitude: point[0],
        }));
        setRouteCoords(routeCoords);
      } else {
        setError('No route found');
      }
    } catch (error) {
      setError('Error fetching route');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {currentLocation && destination ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: (currentLocation.latitude + destination.latitude) / 2,
            longitude: (currentLocation.longitude + destination.longitude) / 2,
            latitudeDelta: Math.abs(currentLocation.latitude - destination.latitude) * 2,
            longitudeDelta: Math.abs(currentLocation.longitude - destination.longitude) * 2,
          }}
        >
          <Marker
            coordinate={currentLocation}
            title="You are here"
            description="Current Location"
          >
            <Image
              source={require('../assets/car_loc.png')} // Replace with your custom car icon
              style={styles.icon}
            />
          </Marker>
          <Marker
            coordinate={destination}
            title="Destination"
          >
            <Image
              source={require('../assets/map1.png')} // Replace with your custom location icon
              style={styles.icon}
            />
          </Marker>
          {routeCoords.length > 0 && (
            <Polyline
              coordinates={routeCoords}
              strokeWidth={4}
              strokeColor="black" // Route line color
            />
          )}
        </MapView>
      ) : (
        <Text style={styles.errorText}>{error || 'No data available'}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  icon: {
    width: 30,
    height: 50,
  },
  errorText: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
    margin: 10,
  },
});

export default MapScreen;
