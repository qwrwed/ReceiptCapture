import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import merge from "deepmerge";
import React from "react";
import { useColorScheme } from "react-native";
import {
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
  Provider as PaperProvider,
} from "react-native-paper";

import AppStatusBar from "./src/components/AppStatusBar";
import HomeScreen from "./src/screens/Home";

const DefaultTheme = merge(PaperDefaultTheme, NavigationDefaultTheme);
const DarkTheme = merge(PaperDarkTheme, NavigationDarkTheme);

const Stack = createStackNavigator();

const App = () => {
  const isPreferDark = useColorScheme() === "dark";
  const themeImported = isPreferDark ? DarkTheme : DefaultTheme;

  const theme = {
    ...themeImported,
    colors: {
      ...themeImported.colors,
      notification: "#0AA",
      primary: "#6200ee",
      //primary: "cyan",
      //background: "#F77",
      //primary: isPreferDark ? "magenta" : "orange",
    },
  };

  return (
    <PaperProvider theme={theme}>
      <AppStatusBar barStyle="light" backgroundColor="#0005" />
      <NavigationContainer theme={theme}>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: "Receipt Capture",
              headerStyle: {
                backgroundColor: theme.colors.primary,
              },
              headerTintColor: "#FFF",
              headerTitleStyle: {
                //fontWeight: "bold",
              },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
