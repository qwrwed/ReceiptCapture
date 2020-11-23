import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { withTheme, Text, TextInput } from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";

import AppButton from "../components/AppButton";
import AppScreenWrapper from "../components/AppScreenWrapper";
import ImageWithModal from "../components/ImageWithModal";
import ViewFlashOnUpdate from "../components/ViewFlashOnUpdate";
import { styles } from "../styles";
import { pickImage, takeImage, uploadImage } from "../utils";

const SHOW_CONFIG = true;
const SERVER_ADDRESS = "http://0.0.0.0";
const SERVER_PORT = "0000";
const CONNECTION_TIMEOUT = 30;

const SERVER_ADDRESS_FULL =
  SERVER_ADDRESS + (SERVER_PORT ? `:${SERVER_PORT}` : "");

const HomeScreen = (props) => {
  const theme = props.theme;

  const [uploadImageInfo, setuploadImageInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [willDownloadImage, setWillDownloadImage] = useState(false);
  const [receivedImage, setReceivedImage] = useState(null);
  const [receivedInfo, setReceivedInfo] = useState("(No info received yet)");

  const [serverAddress, setServerAddress] = useState(SERVER_ADDRESS_FULL);
  const [timeout, setTimeout] = useState(CONNECTION_TIMEOUT);
  const [timeoutString, setTimeoutString] = useState(timeout.toString());

  useEffect(() => {
    (async () => {
      const address = await AsyncStorage.getItem("@serverAddress");
      if (address !== null) {
        setServerAddress(address);
      }
      const timeoutText = await AsyncStorage.getItem("@timeout");
      if (timeout !== null) {
        const timeout = parseInt(timeoutText, 10);
        setTimeoutString(timeoutText);
        setTimeout(timeout);
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
            style={{ flex: 1.2, marginLeft: 2 }}
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
            setReceivedInfo("(No info received yet)");
          }}
        />
      </View>
      {SHOW_CONFIG && (
        <View style={{ flexDirection: "row" }}>
          <TextInput
            label="Server/Port"
            value={serverAddress}
            mode="outlined"
            onChangeText={(text) => setServerAddress(text)}
            onEndEditing={async (e) => {
              const text = e.nativeEvent.text;
              await AsyncStorage.setItem("@serverAddress", text);
            }}
            style={{ flex: 4, marginRight: 2 }}
          />
          <TextInput
            label="Timeout"
            value={timeoutString}
            mode="outlined"
            keyboardType="numeric"
            onChangeText={(text) => {
              setTimeoutString(text.replace(/[^0-9]/g, ""));
            }}
            onEndEditing={async (e) => {
              var text = e.nativeEvent.text;
              var num = parseInt(text, 10);
              num = Number.isInteger(num) ? num : CONNECTION_TIMEOUT;
              text = num.toString();
              setTimeout(num);
              setTimeoutString(text);
              await AsyncStorage.setItem("@timeout", text);
            }}
            style={{ flex: 1.2, marginLeft: 2 }}
          />
        </View>
      )}
      {false && <View style={{ height: RFValue(10) }} />}
    </AppScreenWrapper>
  );
};

export default withTheme(HomeScreen);
