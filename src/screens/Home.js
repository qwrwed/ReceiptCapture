import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { View, Alert } from "react-native";
import { withTheme, Text, TextInput } from "react-native-paper";

import AppButton from "../components/AppButton";
import CodeWithModal from "../components/CodeWithModal";
import ImageWithModal from "../components/ImageWithModal";
import ViewFlashOnUpdate from "../components/ViewFlashOnUpdate";
import { styles } from "../styles";
import { pickImage, takeImage, uploadImage } from "../utils";
import LoadingScreen from "./Loading";

const SHOW_CONFIG = false;
const SERVER_ADDRESS = "http://0.0.0.0";
const SERVER_PORT = "0000";
const CONNECTION_TIMEOUT = 30;

const SERVER_ADDRESS_FULL =
  SERVER_ADDRESS + (SERVER_PORT ? `:${SERVER_PORT}` : "");

const HomeScreen = (props) => {
  const theme = props.theme;

  const [uploadImageInfo, setuploadImageInfo] = useState({
    uri: null,
    name: null,
    type: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [willDownloadImage, setWillDownloadImage] = useState(false);
  const [receivedImage, setReceivedImage] = useState({ uri: null });
  const [receivedInfo, setReceivedInfo] = useState("(No info received yet)");

  const [serverAddress, setServerAddress] = useState(null);
  const [timeout, setTimeout] = useState(null);

  useEffect(() => {
    (async () => {
      var address = await AsyncStorage.getItem("@serverAddress");
      address = address === null ? SERVER_ADDRESS_FULL : address;
      setServerAddress(address);
      var timeoutText = await AsyncStorage.getItem("@timeout");
      timeoutText =
        timeoutText === null ? CONNECTION_TIMEOUT.toString() : timeoutText;
      setTimeout({ text: timeoutText, num: parseInt(timeoutText, 10) });
    })();
  }, []);

  if (SHOW_CONFIG && (timeout === null || serverAddress === null)) {
    return <LoadingScreen />;
  } else {
    return (
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              marginVertical: 2,
              flex: 1,
            }}
          >
            <ImageWithModal
              style={{
                backgroundColor: "#7773",
                borderRadius: props.theme.roundness,
                marginRight: 2,
              }}
              uri={uploadImageInfo.uri}
            />
            <ImageWithModal
              style={{
                backgroundColor: "#7773",
                borderRadius: props.theme.roundness,
                marginLeft: 2,
              }}
              uri={receivedImage.uri}
            />
          </View>
          <ViewFlashOnUpdate
            style={{
              marginVertical: 2,
              borderRadius: theme.roundness,
              backgroundColor: "#7773",
              flex: 1,
            }}
            trigger={isLoading}
            condition={(trigger) => !trigger}
          >
            <CodeWithModal title="Received Info">{receivedInfo}</CodeWithModal>
          </ViewFlashOnUpdate>
        </View>
        <View>
          <ViewFlashOnUpdate
            style={{
              marginVertical: 2,
              paddingVertical: 2,
              paddingHorizontal: 5,
              borderRadius: theme.roundness,
              backgroundColor: "#7773",
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
                disabled={uploadImageInfo.uri === null || isLoading}
                loading={isLoading}
                onPress={async () => {
                  setIsLoading(true);
                  setReceivedImage({ uri: null });
                  const response = await uploadImage(
                    uploadImageInfo,
                    serverAddress,
                    willDownloadImage,
                    timeout.num
                  );
                  setReceivedInfo(response.receivedInfo);
                  if (willDownloadImage) {
                    setReceivedImage({
                      uri: `data:image/gif;base64,${response.receivedImage}`,
                    });
                  }
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
                disabled={isLoading}
              />
            </View>
            <AppButton
              icon="eraser"
              title="Clear all"
              onPress={() => {
                Alert.alert(
                  "Clear all?",
                  "Are you sure you want to clear all selected and received items?",
                  [
                    {
                      text: "Cancel",
                      style: "cancel",
                    },
                    {
                      text: "Clear",
                      onPress: () => {
                        setuploadImageInfo({
                          uri: null,
                          name: null,
                          type: null,
                        });
                        setReceivedImage({ uri: null });
                        setReceivedInfo("(No info received yet)");
                      },
                    },
                  ]
                );
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
                value={timeout.text}
                mode="outlined"
                keyboardType="numeric"
                onChangeText={(text) => {
                  setTimeout({ ...timeout, text: text.replace(/[^0-9]/g, "") });
                }}
                onEndEditing={async (e) => {
                  var text = e.nativeEvent.text;
                  var num = parseInt(text, 10);
                  num = Number.isInteger(num) ? num : timeout.num;
                  text = num.toString();
                  setTimeout({ num, text });
                  await AsyncStorage.setItem("@timeout", text);
                }}
                style={{ flex: 1.2, marginLeft: 2 }}
                right={<TextInput.Affix text="sec" />}
              />
            </View>
          )}
        </View>
      </View>
    );
  }
};

export default withTheme(HomeScreen);
