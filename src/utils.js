import { Animated } from "react-native";

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
  outTime = 1000
) => {
  fadeTo(animatedValue, max, inTime, () => fadeTo(animatedValue, min, outTime));
};

// https://stackoverflow.com/a/57401891
export const adjustColor = (color, amount) => {
  return (
    "#" +
    color
      .replace(/^#/, "")
      .replace(/../g, (color) =>
        (
          "0" +
          Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)
        ).substr(-2)
      )
  );
};
