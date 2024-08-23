import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import {
  GestureDetector,
  PanGestureHandler,
  State,
} from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import * as Font from "expo-font";

const fetchFonts = () => {
  x;
  return Font.loadAsync({
    poppins: require("../assets/Poppins-Medium.ttf"),
  });
};

const { height } = Dimensions.get("window");

const MapScreen = ({ route }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { destination } = route.params;

  const translateY = useSharedValue(0);
  const [commuteRegularly, setCommuteRegularly] = useState(false);

  const toggleValue = useSharedValue(commuteRegularly ? 1 : 0);
  const [seatsAvailable, setSeatsAvailable] = useState(1);

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

  const toggleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withSpring(toggleValue.value * 25) }],
  }));

  const handleToggle = () => {
    setCommuteRegularly((prevState) => !prevState);
    toggleValue.value = commuteRegularly ? 0 : 1;
  };

  const incrementSeats = () => {
    setSeatsAvailable((prev) => prev + 1);
  };

  const decrementSeats = () => {
    setSeatsAvailable((prev) => (prev > 1 ? prev - 1 : 1));
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
              <Image
                source={require("../assets/seat_icon.png")}
                style={styles.detailsIcon}
              />
              <Text style={styles.detailsLabel}>Seats Available</Text>
              <View style={styles.seatControlContainer}>
                <TouchableOpacity onPress={decrementSeats} style={styles.seatButton}>
                  <Text style={styles.seatButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.detailsValue}>{seatsAvailable} seat(s)</Text>
                <TouchableOpacity onPress={incrementSeats} style={styles.seatButton}>
                  <Text style={styles.seatButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.detailsRow}>
              <Image
                source={require("../assets/money_icon.png")}
                style={styles.detailsIcon}
              />
              <Text style={styles.detailsLabel}>Amount Per Seat</Text>
              <Text style={styles.detailsValue}>₹100.00</Text>
            </View>
            <View style={styles.detailsRow}>
              <Text style={styles.detailsLabel}>
                Do you commute to this destination regularly?
              </Text>
              <TouchableOpacity
      style={styles.toggleContainer}
      onPress={handleToggle}
    >
      <View style={styles.ovalShape}>
        <Animated.View
          style={[styles.toggleCircle, toggleStyle]}
        />
        <View style={styles.textContainer}>
        <Text style={styles.toggleText}>
        {commuteRegularly ? "Yes" : ""}
      </Text>
      <Text style={styles.toggleText}>
        {commuteRegularly ? "" : "No"}
      </Text>
        </View>
      </View>
    </TouchableOpacity>
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
    width: 24,
    height: 24,
  },
  topLeftIcon: {
    position: "absolute",
    top: 48,
    left: 20,
    width: 40,
    height: 40,
  },
  topRightIcon: {
    position: "absolute",
    top: 48,
    right: 20,
    width: 40,
    height: 40,
  },

 
  card: {
    width: "100%",
    height: "45%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    position: "absolute",
    bottom: 0,
    elevation: 5,
  },
  cardHeader: {
    marginBottom: 10,
    textAlign: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: "poppins",
    textAlign: 'center',
  },
  cardContent: {
    paddingVertical: 10,
  },
  driverInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  driverAvatar: {
    width: 60,
    height: 60,
    borderRadius: 15,
    marginRight: 10,
  },
  driverName: {
    fontFamily: "poppins",
  },
  driverLocation: {
    color: "#666",
  },
  carImage: {
    width: 50,
    height: 50,
    marginLeft: "auto",
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  detailsIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  detailsLabel: {
    fontFamily: "poppins",
    flex: 1,
    fontSize: 16,
  },
  detailsValue: {
    color: "#333",
  },
  seatControlContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop:1,
  },
  seatButton: {
    backgroundColor: "#000000",
    borderRadius: 15,
    width: 25,
    height: 25,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  seatButtonText: {
    fontSize: 18,
    fontFamily: "poppins",
    color: "#FFFFFF",
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
    borderRadius:30,
    backgroundColor: "#7C7C7C",
    color:"7C7C7C",
    marginTop: 10,
  },
  textContainer: {
    flexDirection: "row",
  },
  ovalShape: {
    backgroundColor: '#7C7C7C',
    borderRadius: 25,
    height: 30,
    width: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
  },
  toggleCircle: {
    width: 20,
    height: 20,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    position: "absolute",
    left: 5, // Start position (for 'Yes')
  },
  toggleText: {
    color: "#ffffff",
    fontFamily: "poppins",
    flexDirection: "row",
    fontSize: 12,
    flex: 1,
  },
  confirmButtonContainer: {
    marginTop: 20,
    backgroundColor: "#000000",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontFamily: "poppins",
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
});

export default MapScreen;
