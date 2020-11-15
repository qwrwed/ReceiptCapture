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

const pickImage = async () => {
  return await getImage(ImagePicker.launchImageLibraryAsync);
};

const takeImage = async () => {
  return await getImage(ImagePicker.launchCameraAsync);
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
  const [imageUploadInfo, setImageUploadInfo] = useState(null);
  return (
    <AppScreenWrapper>
      <Text>{JSON.stringify(imageUploadInfo)}</Text>
      <Text style={{ fontSize: 170, backgroundColor: "#00F" }}>pad2</Text>
      <Text style={{ fontSize: 170, backgroundColor: "#00F" }}>pad3</Text>
      <Text style={{ fontSize: 170, backgroundColor: "#00F" }}>pad4</Text>
      <View>
        <AppButton
          icon="camera"
          title="Take Photo"
          onPress={async () => {
            setImageUploadInfo(await takeImage());
          }}
        />
        <AppButton
          icon="folder-image"
          title="Select Photo"
          onPress={async () => {
            setImageUploadInfo(await pickImage());
          }}
        />
        <AppButton
          icon="eraser"
          title="Clear"
          onPress={() => {
            setImageUploadInfo(null);
          }}
        />
      </View>
    </AppScreenWrapper>
  );
};

export default App;
