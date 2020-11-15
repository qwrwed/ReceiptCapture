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

const SERVER_ADDRESS = "http://192.168.0.2";
const SERVER_PORT = "5000";

const SERVER_ADDRESS_FULL =
  SERVER_ADDRESS + (SERVER_PORT ? `:${SERVER_PORT}` : "");

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

  return uploadImageInfo;
};

const uploadImage = async (
  uploadImageInfo,
  urlRoot,
  willDownloadImage = false
) => {
  const formData = new FormData();
  formData.append("file", uploadImageInfo);
  formData.append("args", JSON.stringify({ returnImg: willDownloadImage }));
  if (uploadImageInfo === null) {
    alert("No image attached!");
    return;
  }
  const controller = new AbortController();
  const timeout = 60; // seconds
  setTimeout(() => controller.abort(), timeout * 1000);
  try {
    var response = await fetch(urlRoot + "\\upload", {
      method: "POST",
      body: formData,
      headers: {
        "content-type": "multipart/form-data",
      },
      signal: controller.signal,
    });
    if (response.ok) {
      const json = await response.json();
      return { receivedImage: json.image, receivedInfo: json.info };
    } else {
      const text = await response.text();
      try {
        const json = await JSON.parse(text);
        throw { message: json.message, status: response.status };
      } catch (err) {
        if (
          err.message.startsWith("JSON Parse error:") &&
          response.status === 500
        ) {
          throw {
            name: "JSONParseError",
            message: "Internal Server Error",
            status: response.status,
          };
        } else {
          throw err;
        }
      }
    }
  } catch (err) {
    let errorMessage;
    console.log("Error:");
    console.log(err);
    if (typeof err.status !== "undefined") {
      errorMessage = `${err.status} ${err.message}`;
    } else if (err.name === "AbortError") {
      errorMessage = `Could not connect to server within ${timeout} seconds`;
    } else if (err.message === "Network request failed") {
      errorMessage = "Could not connect to server";
    } else {
      errorMessage = "unknown error";
      console.log("Error was unknown");
    }
    return { receivedImage: null, receivedInfo: errorMessage };
  }
};

const App = () => {
  const [uploadImageInfo, setuploadImageInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [willDownloadImage, setWillDownloadImage] = useState(false);
  const [receivedImage, setReceivedImage] = useState(null);
  const [receivedInfo, setReceivedInfo] = useState("No photo selected");

  return (
    <AppScreenWrapper>
      <View style={{ flexDirection: "row", marginVertical: 2 }}>
        {uploadImageInfo && <ImageWithModal uri={uploadImageInfo.uri} />}
        {receivedImage && (
          <ImageWithModal uri={`data:image/gif;base64,${receivedImage}`} />
        )}
      </View>
      <Text style={styles.text}>Received Info:</Text>
      <Text style={styles.textMono}>{receivedInfo}</Text>
      <View>
        <AppButton
          icon="camera"
          title="Take Photo"
          onPress={async () => {
            setuploadImageInfo(await takeImage());
          }}
        />
        <AppButton
          icon="folder-image"
          title="Select Photo"
          onPress={async () => {
            setuploadImageInfo(await pickImage());
          }}
        />
        <View style={{ flexDirection: "row" }}>
          <AppButton
            icon="upload"
            title="Upload Photo"
            style={{ flex: 3, marginRight: 2 }}
            disabled={uploadImageInfo === null}
            loading={isLoading}
            onPress={async () => {
              setIsLoading(true);
              setReceivedImage(null);
              const response = await uploadImage(
                uploadImageInfo,
                SERVER_ADDRESS_FULL,
                willDownloadImage
              );
              setReceivedInfo(response.receivedInfo);
              setReceivedImage(response.receivedImage);
              setIsLoading(false);
            }}
          />
          <AppButton
            icon={willDownloadImage ? "download" : "download-off"}
            compact={true}
            style={{ flex: 1, marginLeft: 2 }}
            onPress={async () => {
              setWillDownloadImage(!willDownloadImage);
            }}
          />
        </View>
        <AppButton
          icon="eraser"
          title="Clear"
          onPress={() => {
            setuploadImageInfo(null);
          }}
        />
      </View>
    </AppScreenWrapper>
  );
};

export default App;
