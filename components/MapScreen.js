import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  Image,
  Dimensions,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import {
  GestureDetector,
  PanGestureHandler,
  State,
} from "react-native-gesture-handler";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";

const { height } = Dimensions.get("window");

const MapScreen = ({ route }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { destination } = route.params;

  const translateY = useSharedValue(0);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError("Permission to access location was denied");
          setLoading(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const currentLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setCurrentLocation(currentLocation);

        if (destination) {
          fetchRoute(currentLocation, destination);
        } else {
          setError("Destination is not available");
          setLoading(false);
        }
      } catch (err) {
        setError("Error fetching location");
        setLoading(false);
      }
    })();
  }, [destination]);

  const fetchRoute = async (origin, destination) => {
    const MAPBOX_TOKEN =
      "sk.eyJ1IjoibmV4dHJpbGxpb24tdGVjaCIsImEiOiJjbHpnaHdiaTkxb29xMmpxc3V5bTRxNWNkIn0.l4AsMHEMhAEO90klTb3oCQ"; // Replace with your token
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?geometries=geojson&access_token=${MAPBOX_TOKEN}`;

    try {
      const response = await axios.get(url);
      const coordinates = response.data.routes[0]?.geometry?.coordinates;

      if (coordinates) {
        const routeCoords = coordinates.map((point) => ({
          latitude: point[1],
          longitude: point[0],
        }));
        setRouteCoords(routeCoords);
      } else {
        setError("No route found");
      }
    } catch (error) {
      setError("Error fetching route");
    } finally {
      setLoading(false);
    }
  };

  const panGesture = (event) => {
    const { nativeEvent } = event;

    switch (nativeEvent.state) {
      case State.BEGAN:
        // Handle gesture began
        break;
      case State.ACTIVE:
        translateY.value = nativeEvent.translationY;
        break;
      case State.END:
        translateY.value = withSpring(
          translateY.value > -height / 4 ? 0 : -height / 2
        );
        break;
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
            latitudeDelta:
              Math.abs(currentLocation.latitude - destination.latitude) * 2,
            longitudeDelta:
              Math.abs(currentLocation.longitude - destination.longitude) * 2,
          }}
        >
          <Marker
            coordinate={currentLocation}
            title="You are here"
            description="Current Location"
          >
            <Image
              source={require("../assets/car_loc.png")}
              style={styles.icon}
            />
          </Marker>
          <Marker coordinate={destination} title="Destination">
            <Image
              source={require("../assets/location_icon.png")}
              style={styles.icon}
            />
          </Marker>

          <Polyline
            coordinates={routeCoords}
            strokeWidth={3}
            strokeColor="black"
          />
        </MapView>
      ) : (
        <Text style={styles.errorText}>{error || "No data available"}</Text>
      )}

      <Image
        source={require("../assets/nav_icon.png")}
        style={styles.topLeftIcon}
      />
      <Image
        source={require("../assets/Bell_icon.png")}
        style={styles.topRightIcon}
      />

      <PanGestureHandler onGestureEvent={panGesture}>
        <Animated.View
          style={[
            styles.card,
            { transform: [{ translateY: translateY.value }], zIndex: 2 },
          ]}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>
              Please fill the below details to proceed...
            </Text>
          </View>
          <View style={styles.cardContent}>
            {/* Your card content here */}
            <View style={styles.driverInfo}>
              <Image
                source={require("../assets/driver_avatar.png")}
                style={styles.driverAvatar}
              />
              <View>
                <Text style={styles.driverName}>HR26EM3749 (now)</Text>
                <Text style={styles.driverLocation}>
                  Udyog Vihar, Phase 1, 122001
                </Text>
                <Text style={styles.driverLocation}>
                  Ambience Mall, Gurugram
                </Text>
              </View>
              <Image
                source={require("../assets/driver_car.png")}
                style={styles.carImage}
              />
            </View>
            <View style={styles.detailsRow}>
              <Text style={styles.detailsLabel}>Seats Available</Text>
              <Text style={styles.detailsValue}>1 seat(s)</Text>
            </View>
            <View style={styles.detailsRow}>
              <Text style={styles.detailsLabel}>Amount Per Seat</Text>
              <Text style={styles.detailsValue}>₹100.00</Text>
            </View>
            <View style={styles.detailsRow}>
              <Text style={styles.detailsLabel}>
                Do you commute to this destination regularly?
              </Text>
              <Text style={styles.detailsValue}>No</Text>
            </View>
            <View style={styles.confirmButtonContainer}>
              <Text style={styles.confirmButtonText}>Confirm Details</Text>
            </View>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  icon: {
    width: 30,
    height: 30,
  },
  topLeftIcon: {
    position: "absolute",
    top: 40,
    left: 10,
    width: 40,
    height: 40,
    zIndex: 1,
  },
  topRightIcon: {
    position: "absolute",
    top: 40,
    right: 10,
    width: 40,
    height: 40,
    zIndex: 1,
  },
  card: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: height / 2,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    padding: 20,
    zIndex: 2,
  },
  cardHeader: {
    alignItems: "center",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  cardContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  driverInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  driverAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  driverName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
  },
  driverLocation: {
    fontSize: 14,
    color: "#777",
  },
  carImage: {
    width: 60,
    height: 60,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  detailsLabel: {
    fontSize: 14,
    color: "#333",
  },
  detailsValue: {
    fontSize: 14,
    color: "#777",
  },
  confirmButtonContainer: {
    backgroundColor: "#000",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "black",
    fontSize: 16,
    textAlign: "center",
    margin: 10,
  },
});

export default MapScreen;
