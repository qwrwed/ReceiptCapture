import * as ImagePicker from "expo-image-picker";
import { Animated } from "react-native";

// https://stackoverflow.com/a/55724273
export const padding = (a, b, c, d) => ({
  paddingTop: a,
  paddingRight: b || a,
  paddingBottom: c || a,
  paddingLeft: d || (b || a),
});

// const chartFieldsPie = [
//   { rawName: "nf_protein" },
//   { rawName: "nf_total_carbohydrate" },
//   { rawName: "nf_total_fat" },
// ];

// https://stackoverflow.com/a/32589289
export const titleCase = (str) => str.toLowerCase().split(" ").map((word) => word.charAt(0).toUpperCase() + word.substring(1)).join(" ");

const getImage = async (launcherAsync) => {
  const result = await launcherAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
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

const postFile = async ({ url, file, args, timeout = 20 }) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("args", JSON.stringify(args));

  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeout * 1000);

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
      headers: {
        "content-type": "multipart/form-data",
      },
      signal: controller.signal,
    });
    if (response.ok) {
      const responseJson = await response.json();
      return { success: true, responseJson };
    } // else:
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
  } catch (err) {
    let errorMessage;

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
    return { success: false, error: `Operation failed: ${errorMessage}` };
  }
};

export const uploadImage = async (uploadImageInfo, urlRoot, willDownloadImage, timeout) => {
  let receivedInfo = null;
  let receivedImage = null;

  if (uploadImageInfo === null) {
    receivedInfo = "No image attached!";
    alert(receivedInfo);
    return { receivedInfo, receivedImage };
  }

  const result = await postFile({
    url: `${urlRoot}\\upload`,
    file: uploadImageInfo,
    args: { returnImg: willDownloadImage },
    timeout,
  });

  if (!result.success) {
    return { receivedImage: null, receivedInfo: null, success: false };
  }

  receivedImage = result.responseJson.image;
  receivedInfo = result.responseJson.info;

  const summary = receivedInfo[0];

  return { receivedImage, receivedInfo: summary, success: true };
};

export const fadeTo = (animatedValue, toValue, duration, callback) => {
  Animated.timing(animatedValue, {
    toValue,
    duration,
    useNativeDriver: false,
  }).start(callback);
};

// https://github.com/JesperLekland/react-native-svg-charts#piechart
// eslint-disable-next-line no-bitwise
export const randomColor = () => (`#${((Math.random() * 0xffffff) << 0).toString(16)}000000`).slice(0, 7);

// https://stackoverflow.com/questions/16449295/how-to-sum-the-values-of-a-javascript-object
export const sumValues = (obj) => Object.values(obj).reduce((a, b) => a + b);

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
