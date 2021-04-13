/* eslint-disable no-unused-vars */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useHeaderHeight } from "@react-navigation/stack";
import color from "color";
import React, { useEffect, useState, useRef } from "react";
import { View, ScrollView, Dimensions, Animated } from "react-native";
import {
  withTheme,
  Text,
  TextInput,
  Modal,
  Portal,
  Button,
} from "react-native-paper";

import AppButton from "../components/AppButton";
import AppPieChart from "../components/AppPieChart";
import CodeWithModal from "../components/CodeWithModal";
import ImageWithModal from "../components/ImageWithModal";
import ViewFlashOnUpdate from "../components/ViewFlashOnUpdate";
import { styles } from "../styles";
import { pickImage, takeImage, uploadImage, fadeTo } from "../utils";
import LoadingScreen from "./Loading";

const SHOW_CONFIG = true;

const DEFAULT_ADDRESS = "https://qrgk-fyp.nw.r.appspot.com/";
const CUSTOM_ADDRESS = "http://192.168.0.8";
const CUSTOM_PORT = "5000";
const CONNECTION_TIMEOUT = 30;

const CUSTOM_ADDRESS_FULL = CUSTOM_ADDRESS + (CUSTOM_PORT ? `:${CUSTOM_PORT}` : "");

const uploadImageInfoTemplate = {
  uri: null,
  name: null,
  type: null,
};

const pieConfig = {
  nf_protein: {
    label: "Protein",
    color: "#FF0000",
  },
  nf_total_carbohydrate: {
    label: "Carbohydrates",
    color: "#FFFF00",

  },
  nf_total_fat: {
    label: "Fat",
    color: "#FFFF00",
  },
};

// const sampleData = {
//   nf_protein: 54.98,
//   nf_total_carbohydrate: 130.53,
//   nf_total_fat: 41.37,
// };

const HomeScreen = (props) => {
  const { theme } = props;

  const [uploadImageInfo, setUploadImageInfo] = useState(uploadImageInfoTemplate);
  const [receivedImage, setReceivedImage] = useState({ uri: null });
  const [receivedSuccess, setReceivedSuccess] = useState(false);
  // const [receivedInfo, setReceivedInfo] = useState("(No info received yet)");
  const [receivedInfo, setReceivedInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [willDownloadImage, setWillDownloadImage] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [useCustomAddress, setUseCustomAddress] = useState(SHOW_CONFIG);

  const [serverAddress, setServerAddress] = useState(null);
  const [timeout, setTimeout] = useState(null);

  // only runs on first render:
  useEffect(() => {
    (async () => {
      const storedTimeoutText = await AsyncStorage.getItem("@timeout");
      const timeoutText = storedTimeoutText === null
        ? CONNECTION_TIMEOUT.toString() : storedTimeoutText;
      setTimeout({ text: timeoutText, num: parseInt(timeoutText, 10) });

      const storedUploadImageInfo = await AsyncStorage.getItem("@uploadImageInfo");
      if (storedUploadImageInfo !== null) {
        setUploadImageInfo(JSON.parse(storedUploadImageInfo));
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      let address;
      if (useCustomAddress) {
        address = await AsyncStorage.getItem("@customAddress");
        address = address === null ? CUSTOM_ADDRESS_FULL : address;
      } else {
        address = DEFAULT_ADDRESS;
      }
      setServerAddress(address);
    })();
  }, [useCustomAddress]);

  const scrollViewRef = useRef();
  const screenHeight = Dimensions.get("window").height - useHeaderHeight();
  const screenWidth = Dimensions.get("window").width;

  const isFlexRow = false;

  const animatedValueDownImgWidth = useRef(new Animated.Value(0)).current;
  const downImgWidth = animatedValueDownImgWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "50%"],
  });

  useEffect(() => {
    fadeTo(animatedValueDownImgWidth, +willDownloadImage, 1000);
  }, [willDownloadImage]);

  const downImgMargin = animatedValueDownImgWidth.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 4],
  });

  let modalButtonColor = theme.colors.primary;
  modalButtonColor = theme.dark
    ? color(modalButtonColor).lighten(0.7).string()
    : modalButtonColor;

  if (SHOW_CONFIG && (timeout === null || serverAddress === null)) {
    return <LoadingScreen />;
  }
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
        {/* <View
          style={{
            flex: 1,
            marginTop: 8,
            flexDirection: isFlexRow ? "row" : "column",
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: isFlexRow ? "column" : "row",
              marginVertical: 2,
            }}
          >
            <ImageWithModal
              style={{
                flex: 1,
                // width: "50%",
                backgroundColor: props.theme.colors.surface,
                borderRadius: props.theme.roundness,
                // marginRight: 2,
              }}
              uri={uploadImageInfo.uri}
            />
            <Animated.View
              style={{
                height: isFlexRow ? downImgWidth : null,
                width: isFlexRow ? null : downImgWidth,
                marginTop: isFlexRow ? downImgMargin : null,
                marginLeft: isFlexRow ? null : downImgMargin,
              }}
            >
              <ImageWithModal
                style={{
                  backgroundColor: props.theme.colors.surface,
                  borderRadius: props.theme.roundness,
                }}
                uri={receivedImage.uri}
              />
            </Animated.View>
          </View>

          <ViewFlashOnUpdate
            style={{
              height: isFlexRow ? null : "50%",
              width: isFlexRow ? "50%" : null,
              marginVertical: 2,
              marginLeft: isFlexRow ? 4 : null,
              marginRight: 0,
              borderRadius: theme.roundness,
              backgroundColor: props.theme.colors.surface,
              // {receivedInfo}
            }}
            trigger={isLoading}
            condition={(trigger) => !trigger}
          >
            <CodeWithModal title="Received Info">
              Received Info Temporarily Removed
            </CodeWithModal>
          </ViewFlashOnUpdate>
        </View> */}
        <View style={{ flex: 1 }}>
          {receivedInfo && <AppPieChart data={receivedInfo} config={pieConfig} />}
        </View>
        {/* {receivedSuccess && (
        )} */}

        <View>
          {/* <ViewFlashOnUpdate
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
          </ViewFlashOnUpdate> */}
          <View>
            <AppButton
              icon="camera-image"
              title="Add Photo"
              onPress={() => setShowAddModal(true)}
            />
            <Portal>
              <Modal
                visible={showAddModal}
                contentContainerStyle={{
                  backgroundColor: props.theme.colors.background,
                  alignSelf: "center",
                  borderRadius: props.theme.roundness,
                }}
                onDismiss={() => setShowAddModal(false)}
              >
                <View
                  style={{
                    backgroundColor: props.theme.colors.surface,
                    padding: 20,
                    borderRadius: props.theme.roundness,
                  }}
                >
                  <Button
                    color={modalButtonColor}
                    style={{ alignSelf: "stretch" }}
                    labelStyle={{ fontSize: 16 }}
                    onPress={async () => {
                      setShowAddModal(false);
                      const info = await takeImage();
                      if (info !== null) {
                        setUploadImageInfo(info);
                        await AsyncStorage.setItem("@uploadImageInfo", JSON.stringify(info));
                      }
                    }}
                  >
                    Take Photo
                  </Button>
                  <Button
                    color={modalButtonColor}
                    style={{ margin: 16, alignSelf: "stretch" }}
                    labelStyle={{ fontSize: 16 }}
                    onPress={async () => {
                      setShowAddModal(false);
                      const info = await pickImage();
                      if (info !== null) {
                        setUploadImageInfo(info);
                        await AsyncStorage.setItem("@uploadImageInfo", JSON.stringify(info));
                      }
                    }}
                  >
                    Select Photo
                  </Button>
                  <Button
                    color={modalButtonColor}
                    style={{ alignSelf: "stretch" }}
                    labelStyle={{ fontSize: 16 }}
                    onPress={() => setShowAddModal(false)}
                  >
                    Cancel
                  </Button>
                </View>
              </Modal>
            </Portal>
            <View style={{ flexDirection: "row" }}>
              <AppButton
                icon="upload"
                title="Upload Photo"
                style={{ flex: 3, marginRight: 2 }}
                disabled={uploadImageInfo.uri === null || isLoading}
                loading={isLoading}
                onPress={async () => {
                  setReceivedSuccess(false);
                  setIsLoading(true);
                  setReceivedImage({ uri: null });
                  const response = await uploadImage(
                    uploadImageInfo,
                    serverAddress,
                    willDownloadImage,
                    timeout.num,
                  );
                  setReceivedSuccess(response.success);
                  setReceivedInfo(response.receivedInfo);
                  if (willDownloadImage && response.receivedImage !== null) {
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
              // disabled={uploadImageInfo.uri === null}
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
                        setUploadImageInfo({
                          uri: null,
                          name: null,
                          type: null,
                        });
                        setReceivedImage({ uri: null });
                        setReceivedInfo("(No info received yet)");
                        setShowClearModal(false);
                        setUploadImageInfo(uploadImageInfoTemplate);
                        AsyncStorage.setItem("@uploadImageInfo", null);
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
            <AppButton
              icon={useCustomAddress ? "server" : "google-cloud"}
              style={{ flex: 1, marginTop: 6, marginRight: 2 }}
              compact={true}
              onPress={() => {
                setUseCustomAddress(!useCustomAddress);
              }}
            />
            <TextInput
              label="Server/Port"
              value={serverAddress}
              mode="outlined"
              disabled={!useCustomAddress}
              onChangeText={(text) => setServerAddress(text)}
              onEndEditing={async (e) => {
                const { text } = e.nativeEvent;
                await AsyncStorage.setItem("@customAddress", text);
              }}
              style={{ flex: 4, marginLeft: 2, marginRight: 2 }}
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
                let { text } = e.nativeEvent;
                let num = parseInt(text, 10);
                num = Number.isInteger(num) ? num : timeout.num;
                text = num.toString();
                setTimeout({ num, text });
                await AsyncStorage.setItem("@timeout", text);
              }}
              style={{ flex: 1.5, marginLeft: 2 }}
              right={<TextInput.Affix text="sec" />}
            />
          </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};
// <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}></Pressable>
export default withTheme(HomeScreen);
