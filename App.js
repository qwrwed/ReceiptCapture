/* eslint-disable no-unused-vars */
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import color from "color";
import merge from "deepmerge";
import React from "react";
import { useColorScheme, View } from "react-native";
import {
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
  Provider as PaperProvider,
  Switch,
  Text,
} from "react-native-paper";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

import AppStatusBar from "./src/components/AppStatusBar";
import HomeScreen from "./src/screens/Home";
import TestScreen from "./src/screens/Test";
import useAsyncStorage from "./src/useAsyncStorage";

const DefaultTheme = merge(NavigationDefaultTheme, PaperDefaultTheme);
const DarkTheme = merge(NavigationDarkTheme, PaperDarkTheme);

const Stack = createStackNavigator();

const App = () => {
  const [useLightTheme, setUseLightTheme] = useAsyncStorage("@useLightTheme", useColorScheme() !== "dark");
  const themeImported = useLightTheme ? DefaultTheme : DarkTheme;

  const theme = {
    ...themeImported,
    colors: {
      ...themeImported.colors,
      notification: "#0AA",
      primary: "#6200ee",
      surface: "#7773",
      onSurface: useLightTheme ? "#BBB" : "#333",
      textAccent: useLightTheme ? "#099" : "#0FF",
      // primary: isPreferDark ? "magenta" : "orange",
    },
  };
  theme.colors.modalButton = useLightTheme ? theme.colors.primary : color(theme.colors.primary).lighten(0.7).string();

  return (
    <PaperProvider theme={theme}>
      <AppStatusBar barStyle="light" backgroundColor="#0005" />
      <NavigationContainer theme={theme}>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            // component={TestScreen}
            options={{
              title: "Receipt Nutrition",
              headerStyle: {
                backgroundColor: theme.colors.primary,
              },
              headerTintColor: "#EEE",
              headerTitleStyle: {
                // fontWeight: "bold",
              },
              headerRight: () => (
                <View style={{
                  paddingRight: "10%",
                  flexDirection: "row",
                  // backgroundColor: "#FF0",
                  alignItems: "center" }}
                >
                  <Switch
                    value={useLightTheme}
                    onValueChange={() => setUseLightTheme(!useLightTheme)}
                  />
                  {useLightTheme
                    ? <MaterialIcons name="wb-sunny" size={24} color="white" />
                    : <MaterialCommunityIcons name="moon-waning-crescent" size={24} color="white" />}
                  {/* <MaterialCommunityIcons name="theme-light-dark" size={24} color="white" /> */}

                </View>
              ),
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
