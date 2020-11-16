import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { View, useColorScheme } from "react-native";
import { Text, TextInput, DarkTheme, DefaultTheme } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";

import AppButton from "./src/components/AppButton";
import { AppScreenWrapper } from "./src/components/AppScreenWrapper";
import { ImageWithModal } from "./src/components/ImageWithModal";
import ViewFlashOnUpdate from "./src/components/ViewFlashOnUpdate";
import { styles } from "./src/styles";
import { pickImage, takeImage, uploadImage } from "./src/utils";

const SHOW_SERVER_CONFIG = false;
const SERVER_ADDRESS = "http://0.0.0.0";
const SERVER_PORT = "0000";
const CONNECTION_TIMEOUT = 20;

const SERVER_ADDRESS_FULL =
  SERVER_ADDRESS + (SERVER_PORT ? `:${SERVER_PORT}` : "");

const App = () => {
  const isPreferDark = useColorScheme() === "dark";
  const themePaper = isPreferDark ? DarkTheme : DefaultTheme;

  const theme = {
    ...themePaper,
    colors: {
      ...themePaper.colors,
      notification: "#0AA",
      //primary: isPreferDark ? "magenta" : "orange",
    },
  };
  // const { colors } = theme;

  const [uploadImageInfo, setuploadImageInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [willDownloadImage, setWillDownloadImage] = useState(false);
  const [receivedImage, setReceivedImage] = useState(null);
  const [receivedInfo, setReceivedInfo] = useState("No photo selected");
  const [serverAddress, setServerAddress] = useState(SERVER_ADDRESS_FULL);

  useEffect(() => {
    (async () => {
      const address = await AsyncStorage.getItem("@serverAddress");
      if (address !== null) {
        setServerAddress(address);
      }
    })();
  }, []);

  return (
    <AppScreenWrapper theme={theme}>
      <View style={{ flexDirection: "row", marginVertical: 2 }}>
        {uploadImageInfo && <ImageWithModal uri={uploadImageInfo.uri} />}
        {receivedImage && (
          <ImageWithModal uri={`data:image/gif;base64,${receivedImage}`} />
        )}
      </View>
      <ViewFlashOnUpdate
        style={{
          marginVertical: 2,
          borderRadius: theme.roundness,
          paddingVertical: 2,
        }}
        trigger={isLoading}
        condition={(trigger) => !trigger}
      >
        <Text style={styles.text}>Received info:</Text>
        <Text style={styles.textMono}>{receivedInfo}</Text>
      </ViewFlashOnUpdate>
      <ViewFlashOnUpdate
        style={{
          marginVertical: 2,
          paddingVertical: 2,
          borderRadius: theme.roundness,
        }}
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
                serverAddress,
                willDownloadImage,
                CONNECTION_TIMEOUT
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
      {SHOW_SERVER_CONFIG && (
        <TextInput
          label="Server/Port"
          value={serverAddress}
          mode="outlined"
          onChangeText={(text) => setServerAddress(text)}
          onEndEditing={async (e) => {
            const text = e.nativeEvent.text;
            console.log(`Setting server address to ${text}`);
            await AsyncStorage.setItem("@serverAddress", text);
          }}
        />
      )}
      <View style={{ height: RFValue(60) }} />
    </AppScreenWrapper>
  );
};

export default App;
