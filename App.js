import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import OpeningScreen from './components/OpeningScreen';
import InitialScreens from './components/InitialScreens';
import LocationScreen from './components/LocationScreen';
import ChooseRoleScreen from './components/ChooseRoleScreen';
import TravellerWelcome from './components/TravellerWelcome';
import DriverWelcome from './components/DriverWelcome';
import DriverLogin from './components/DriverLogin';
import DriverSignup from './components/DriverSignup';
 


const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='OpeningScreen'>
        <Stack.Screen name='OpeningScreen' component={OpeningScreen} options={{headerShown: false}}  />
        <Stack.Screen name='InitialScreens' component={InitialScreens} options={{headerShown: false}}  />
        <Stack.Screen name='LocationScreen' component={LocationScreen} options={{headerShown: false}}  />
        <Stack.Screen name='ChooseRole' component={ChooseRoleScreen} options={{headerShown: false}}  />
        <Stack.Screen name='TravellerWelcome' component={TravellerWelcome} options={{headerShown: false}}  />
        <Stack.Screen name='DriverWelcome' component={DriverWelcome} options={{headerShown: false}}  />
        <Stack.Screen name='DriverLogin' component={DriverLogin} options={{headerShown: false}}  />
        <Stack.Screen name='DriverSignup' component={DriverSignup} options={{headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );

}

export default App;

