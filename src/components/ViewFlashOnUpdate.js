import React, { useRef, useEffect, useState } from "react";
import { Animated } from "react-native";
import { withTheme } from "react-native-paper";

import { fadeInThenOut } from "../utils";

const ViewFlashOnUpdate = (props) => {
  //const theme = useColorScheme() === "dark" ? DarkTheme : DefaultTheme;
  const { theme } = props;
  const { colors } = theme;

  const trigger = props.trigger;
  const condition = props.condition;

  const animatedValueInfoBackground = useRef(new Animated.Value(0)).current;
  const infoBackground = animatedValueInfoBackground.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.background, colors.notification],
  });

  const [flashEnabled, setFlashEnabled] = useState(false);

  useEffect(() => {
    if (!flashEnabled) {
      setFlashEnabled(true);
    } else if (condition(trigger)) {
      fadeInThenOut(animatedValueInfoBackground, 0, 0.7, 100, 2000);
    }
  }, [trigger]);

  return (
    <Animated.View style={[{ backgroundColor: infoBackground }, props.style]}>
      {props.children}
    </Animated.View>
  );
};

export default withTheme(ViewFlashOnUpdate);
