import * as ImagePicker from "expo-image-picker";
import { Animated } from "react-native";

// https://stackoverflow.com/a/55724273
export const padding = (a, b, c, d) => ({
  paddingTop: a,
  paddingRight: b || a,
  paddingBottom: c || a,
  paddingLeft: d || (b || a),
});

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

export const pickImage = async () => getImage(ImagePicker.launchImageLibraryAsync);
export const takeImage = async () => getImage(ImagePicker.launchCameraAsync);

export const uploadImage = async (
  uploadImageInfo,
  urlRoot,
  willDownloadImage = false,
  timeout = 20,
) => {
  let receivedImage = null;
  let receivedInfo = "";

  const formData = new FormData();
  formData.append("file", uploadImageInfo);
  formData.append("args", JSON.stringify({ returnImg: willDownloadImage }));
  if (uploadImageInfo === null) {
    receivedInfo = "No image attached!";
    alert(receivedInfo);
    return { receivedInfo, receivedImage };
  }
  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeout * 1000);
  try {
    const response = await fetch(`${urlRoot}\\upload`, {
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
          err.message.startsWith("JSON Parse error:")
          && response.status === 500
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
    receivedInfo += "Operation failed: ";
    if (typeof err.status !== "undefined") {
      errorMessage = `${err.status} ${err.message}`;
    } else if (err.name === "AbortError") {
      errorMessage = `No response from server within ${timeout} second`;
      if (timeout !== 1) {
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

export const fadeTo = (animatedValue, toValue, duration, callback) => {
  Animated.timing(animatedValue, {
    toValue,
    duration,
    useNativeDriver: false,
  }).start(callback);
};

export const fadeInThenOut = (
  animatedValue,
  min = 0,
  max = 1,
  inTime = 1000,
  outTime = 1000,
) => {
  fadeTo(animatedValue, max, inTime, () => fadeTo(animatedValue, min, outTime));
};

// https://stackoverflow.com/a/57401891
export const adjustColor = (color, amount) => (
  `#${
    color
      .replace(/^#/, "")
      .replace(/../g, (color_) => (
        `0${Math.min(255, Math.max(0, parseInt(color_, 16) + amount)).toString(16)}`
      ).substr(-2))}`
);
