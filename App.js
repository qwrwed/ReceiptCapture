// TODO: args

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
} from "react-native-paper";
import { RFValue } from "react-native-responsive-fontsize";
import { SafeAreaView } from "react-native-safe-area-context";

import StatusBar from "./src/components/ESLintCompatibleStatusBar";
import ImageWithModal from "./src/components/ImageWithModal";
import { styles } from "./src/styles";
import { fadeInThenOut } from "./src/utils";

const SERVER_ADDRESS = "http://192.168.0.2";
const SERVER_PORT = "5000";

const SERVER_ADDRESS_FULL =
  SERVER_ADDRESS + (SERVER_PORT ? `:${SERVER_PORT}` : "");

const ScreenView = (props) => {
  if (Platform.OS === "web") {
    return <View style={props.style}>{props.children}</View>;
  } else {
    return (
      <SafeAreaView style={props.style} edges={["right", "left", "top"]}>
        {props.children}
      </SafeAreaView>
    );
  }
};

const App = () => {
  const theme = useColorScheme() === "dark" ? DarkTheme : DefaultTheme;
  const { colors } = theme;

  const [imageUri, setImageUri] = useState(null);
  const [receivedInfo, setReceivedInfo] = useState(null);
  const [receivedImage, setReceivedImage] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [dontFlash, setDontFlash] = useState(true);

  const animatedValueInfoBackground = useRef(new Animated.Value(0)).current;
  const infoBackground = animatedValueInfoBackground.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.background, colors.primary],
  });

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const {
          status,
        } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  useEffect(() => {
    setLoadingUpload(false);
  }, [receivedInfo, receivedImage]);

  useEffect(() => {
    if (dontFlash) {
      setDontFlash(false);
    } else if (loadingUpload === false) {
      fadeInThenOut(animatedValueInfoBackground, 0, 0.7, 100, 2000);
    }
  }, [loadingUpload]);

  const pickImage = async () => {
    getImage(ImagePicker.launchImageLibraryAsync);
  };

  const takeImage = async () => {
    getImage(ImagePicker.launchCameraAsync);
  };

  const getImage = async (launcherAsync) => {
    const result = await launcherAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (result.cancelled) {
      return;
    }
    const localUri = result.uri;
    setImageUri(localUri);
    const filename = localUri.split("/").pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : "image";
    const formDataTemp = new FormData();
    formDataTemp.append("file", { uri: localUri, name: filename, type });
    setFormData(formDataTemp);
  };

  const uploadImage = async (formData, urlRoot) => {
    if (formData === null) {
      alert("No image attached!");
      return;
    }
    setLoadingUpload(true);
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
        if (json.image === receivedImage && json.info === receivedInfo) {
          setLoadingUpload(false);
        } else {
          setReceivedImage(json.image);
          setReceivedInfo(json.info);
        }
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
      if (receivedInfo === errorMessage) {
        setLoadingUpload(false);
      } else {
        setReceivedInfo(errorMessage);
      }
    }
  };

  return (
    <PaperProvider theme={theme}>
      <ScreenView
        style={[{ backgroundColor: colors.background }, styles.container]}
      >
        <ScrollView
          style={{
            width: "100%",
            // flexDirection: 'column-reverse'
          }}
          contentContainerStyle={{
            // flexDirection: 'column-reverse'
            flexGrow: 1,
            justifyContent: "flex-end",
            flexDirection: "column",
          }}
        >
          <StatusBar barStyle="auto" />

          <View style={{ flexDirection: "row", marginVertical: 2 }}>
            {imageUri && <ImageWithModal uri={imageUri} />}
            {receivedImage && (
              <ImageWithModal uri={`data:image/gif;base64,${receivedImage}`} />
            )}
          </View>

          <Animated.View
            style={{ backgroundColor: infoBackground, marginVertical: 2 }}
          >
            <Text style={styles.text}>Received info:</Text>
            <Text style={styles.textMono}>{receivedInfo}</Text>
          </Animated.View>

          <View
            style={
              {
                // flex: 1, justifyContent: 'flex-end',
              }
            }
          >
            <Button
              style={styles.button}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              icon="camera"
              mode="contained"
              onPress={takeImage}
            >
              Take Photo
            </Button>
            <Button
              style={styles.button}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              icon="folder-image"
              mode="contained"
              onPress={pickImage}
            >
              Select Image
            </Button>
            <Button
              style={styles.button}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              loading={loadingUpload}
              disabled={formData === null || loadingUpload}
              icon="upload"
              mode="contained"
              onPress={() => {
                uploadImage(formData, SERVER_ADDRESS_FULL);
              }}
            >
              Submit Image
            </Button>
            <Button
              style={styles.button}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              icon="eraser"
              mode="contained"
              onPress={() => {
                setImageUri(null);
                setFormData(null);
                setReceivedImage(null);
                setReceivedInfo("");
              }}
            >
              Clear
            </Button>
            <View style={{ height: RFValue(60) }} />
          </View>
        </ScrollView>
      </ScreenView>
    </PaperProvider>
  );
};

export default App;
