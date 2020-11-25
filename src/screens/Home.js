import AsyncStorage from "@react-native-async-storage/async-storage";
import { useHeaderHeight } from "@react-navigation/stack";
import color from "color";
import React, { useEffect, useState, useRef } from "react";
import { View, ScrollView, Dimensions } from "react-native";
import {
  withTheme,
  Text,
  TextInput,
  Modal,
  Portal,
  Button,
} from "react-native-paper";

import AppButton from "../components/AppButton";
import CodeWithModal from "../components/CodeWithModal";
import ImageWithModal from "../components/ImageWithModal";
import ViewFlashOnUpdate from "../components/ViewFlashOnUpdate";
import { styles } from "../styles";
import { pickImage, takeImage, uploadImage } from "../utils";
import LoadingScreen from "./Loading";

const SHOW_CONFIG = true;
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
  const [receivedImage, setReceivedImage] = useState({ uri: null });
  const [receivedInfo, setReceivedInfo] = useState("(No info received yet)");
  const [isLoading, setIsLoading] = useState(false);
  const [willDownloadImage, setWillDownloadImage] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);

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

  const scrollViewRef = useRef();
  const screenHeight = Dimensions.get("window").height - useHeaderHeight();

  var modalButtonColor = theme.colors.primary;
  modalButtonColor = theme.dark
    ? color(modalButtonColor).lighten(0.7).string()
    : modalButtonColor;

  if (SHOW_CONFIG && (timeout === null || serverAddress === null)) {
    return <LoadingScreen />;
  } else {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            height: screenHeight,
            marginHorizontal: 10,
            paddingBottom: 8,
          }}
          ref={scrollViewRef}
          onLayout={() => scrollViewRef.current.scrollToEnd({ animated: true })}
        >
          <View style={{ flex: 1, marginVertical: 8 }}>
            <View
              style={{
                height: "50%",
                flexDirection: "row",
                marginVertical: 2,
              }}
            >
              <ImageWithModal
                style={{
                  flex: 1,
                  //width: "50%",
                  backgroundColor: props.theme.colors.surface,
                  borderRadius: props.theme.roundness,
                  marginRight: 2,
                }}
                uri={uploadImageInfo.uri}
              />
              <ImageWithModal
                style={{
                  flex: 1,
                  //width: "50%",
                  backgroundColor: props.theme.colors.surface,
                  borderRadius: props.theme.roundness,
                  marginLeft: 2,
                }}
                uri={receivedImage.uri}
              />
            </View>

            <ViewFlashOnUpdate
              style={{
                height: "50%",
                marginVertical: 2,
                borderRadius: theme.roundness,
                backgroundColor: props.theme.colors.surface,
              }}
              trigger={isLoading}
              condition={(trigger) => !trigger}
            >
              <CodeWithModal title="Received Info">
                {receivedInfo}
              </CodeWithModal>
            </ViewFlashOnUpdate>
          </View>

          <View>
            <ViewFlashOnUpdate
              style={{
                marginVertical: 2,
                paddingVertical: 2,
                paddingHorizontal: 5,
                borderRadius: theme.roundness,
                backgroundColor: props.theme.colors.surface,
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
                //disabled={uploadImageInfo.uri === null}
                onPress={() => {
                  setShowClearModal(true);
                }}
              />
              <Portal>
                <Modal
                  visible={showClearModal}
                  onDismiss={() => setShowClearModal(false)}
                  contentContainerStyle={{
                    backgroundColor: props.theme.colors.background,
                    width: "85%",
                    alignSelf: "center",
                    borderRadius: props.theme.roundness,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: props.theme.colors.surface,
                      padding: 20,
                      borderRadius: props.theme.roundness,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 20,
                        fontFamily: "sans-serif-light",
                      }}
                    >
                      Clear all?
                    </Text>
                    <Text style={{ fontSize: 16 }}>
                      Are you sure you want to clear all selected and received
                      items?
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Button
                        onPress={() => setShowClearModal(false)}
                        color={modalButtonColor}
                      >
                        Cancel
                      </Button>
                      <Button
                        onPress={() => {
                          setuploadImageInfo({
                            uri: null,
                            name: null,
                            type: null,
                          });
                          setReceivedImage({ uri: null });
                          setReceivedInfo("(No info received yet)");
                          setShowClearModal(false);
                        }}
                        color={modalButtonColor}
                      >
                        Clear
                      </Button>
                    </View>
                  </View>
                </Modal>
              </Portal>
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
                    setTimeout({
                      ...timeout,
                      text: text.replace(/[^0-9]/g, ""),
                    });
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
        </ScrollView>
      </View>
    );
  }
};
//<Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}></Pressable>
export default withTheme(HomeScreen);
