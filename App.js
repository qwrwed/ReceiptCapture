import { MaterialCommunityIcons } from "@ref/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useRef, useState, useEffect } from "react";
import {
  Animated,
  Platform,
  View,
  ScrollView,
  useColorScheme,
} from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  Provider as PaperProvider,
  Button,
  Text,
  ToggleButton,
  IconButton,
} from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";

import { ESLintCompatibleStatusBar as StatusBar } from "./src/components/ESLintCompatibleStatusBar";
import { ImageWithModal } from "./src/components/ImageWithModal";
import { ScreenView } from "./src/components/ScreenView";
import { styles } from "./src/styles";
import { fadeInThenOut, adjustColor } from "./src/utils";

const App = () => {
  return <Text>To be refactored</Text>;
};

export default App;
