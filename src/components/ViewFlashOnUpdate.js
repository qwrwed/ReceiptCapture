import React, { useRef, useEffect, useState } from "react";
import { Animated } from "react-native";
import { withTheme } from "react-native-paper";

import { fadeInThenOut } from "../utils";

const ViewFlashOnUpdate = (props) => {
  // const theme = useColorScheme() === "dark" ? DarkTheme : DefaultTheme;
  const { theme } = props;
  const { colors } = theme;
  const { backgroundColor = colors.background } = props.style;

  const { trigger, condition } = props;

  const animatedValueInfoBackground = useRef(new Animated.Value(0)).current;
  const infoBackground = animatedValueInfoBackground.interpolate({
    inputRange: [0, 1],
    outputRange: [backgroundColor, colors.notification],
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
    <Animated.View style={[props.style, { backgroundColor: infoBackground }]}>
      {props.children}
    </Animated.View>
  );
};

export default withTheme(ViewFlashOnUpdate);
