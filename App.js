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

import { AppScreenWrapper } from "./src/components/AppScreenWrapper";
import { AppButton } from "./src/components/AppButton";
import { ImageWithModal } from "./src/components/ImageWithModal";
import { styles } from "./src/styles";
import { fadeInThenOut, adjustColor } from "./src/utils";

const takeImage = async () => {
  const image = await getImage(ImagePicker.launchCameraAsync);
  return image;
};

const getImage = async (launcherAsync) => {
  const result = await launcherAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: false,
  });

  if (result.cancelled) {
    return;
  }
  const localUri = result.uri;
  const filename = localUri.split("/").pop();
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : "image";
  const uploadImageInfo = { uri: localUri, name: filename, type };

  return { uploadImageInfo };
};

const App = () => {
  return (
    <AppScreenWrapper>
      <Text style={{ fontSize: 170, backgroundColor: "#00F" }}>pad1</Text>
      <Text style={{ fontSize: 170, backgroundColor: "#00F" }}>pad2</Text>
      <Text style={{ fontSize: 170, backgroundColor: "#00F" }}>pad3</Text>
      <Text style={{ fontSize: 170, backgroundColor: "#00F" }}>pad4</Text>
      <View>
        <AppButton
          icon="camera"
          onPress={async () => {
            const imageUploadInfo = await takeImage();
            console.log(imageUploadInfo);
          }}
        >
          Take Photo
        </AppButton>
      </View>
    </AppScreenWrapper>
  );
};

export default App;
