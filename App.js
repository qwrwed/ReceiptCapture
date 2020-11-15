import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  View,
  //useColorScheme,
} from "react-native";
import {
  Text,
  //DarkTheme,
  //DefaultTheme,
} from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";

import { AppButton } from "./src/components/AppButton";
import { AppScreenWrapper } from "./src/components/AppScreenWrapper";
import { ImageWithModal } from "./src/components/ImageWithModal";
import { ViewFlashOnUpdate } from "./src/components/ViewFlashOnUpdate";
import { styles } from "./src/styles";

const SERVER_ADDRESS = "http://192.168.0.2";
const SERVER_PORT = "5000";
const CONNECTION_TIMEOUT = 20;

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
    return null;
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
  var receivedImage = null;
  var receivedInfo = "";

  const formData = new FormData();
  formData.append("file", uploadImageInfo);
  formData.append("args", JSON.stringify({ returnImg: willDownloadImage }));
  if (uploadImageInfo === null) {
    receivedInfo = "No image attached!";
    alert(receivedInfo);
    return { receivedInfo, receivedImage };
  }
  const controller = new AbortController();
  setTimeout(() => controller.abort(), CONNECTION_TIMEOUT * 1000);
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
      receivedImage = json.image;
      receivedInfo = json.info;
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
    var errorMessage;
    receivedInfo += "Operation failed: ";
    if (typeof err.status !== "undefined") {
      errorMessage = `${err.status} ${err.message}`;
    } else if (err.name === "AbortError") {
      errorMessage = `No response from server within ${CONNECTION_TIMEOUT} second`;
      if (CONNECTION_TIMEOUT !== 1) {
        errorMessage += "s";
      }
    } else if (err.message === "Network request failed") {
      errorMessage = "Could not connect to server";
    } else {
      errorMessage = "unknown error";
    }
    console.log("Error:");
    console.log(errorMessage);
    // console.log(err);
    receivedInfo += errorMessage;
  }
  return { receivedImage, receivedInfo };
};

const App = () => {
  // const theme = useColorScheme() === "dark" ? DarkTheme : DefaultTheme;
  // const { colors } = theme;

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
      <ViewFlashOnUpdate
        style={{ marginVertical: 2 }}
        trigger={isLoading}
        condition={(trigger) => !trigger}
      >
        <Text style={styles.text}>Received info:</Text>
        <Text style={styles.textMono}>{receivedInfo}</Text>
      </ViewFlashOnUpdate>
      <ViewFlashOnUpdate
        style={{ marginVertical: 2 }}
        trigger={willDownloadImage}
        condition={() => true}
      >
        <Text style={styles.text}>
          Operation: Get text{" "}
          {willDownloadImage ? "and processed image" : "only"}
        </Text>
      </ViewFlashOnUpdate>
      <View>
        <AppButton
          icon="camera"
          title="Take Photo"
          onPress={async () => {
            const info = await takeImage();
            if (info !== null) {
              setuploadImageInfo(info);
            }
          }}
        />
        <AppButton
          icon="folder-image"
          title="Select Photo"
          onPress={async () => {
            const info = await pickImage();
            if (info !== null) {
              setuploadImageInfo(info);
            }
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
            setReceivedImage(null);
            setReceivedInfo("No photo selected");
          }}
        />
      </View>
      <View style={{ height: RFValue(60) }} />
    </AppScreenWrapper>
  );
};

export default App;
