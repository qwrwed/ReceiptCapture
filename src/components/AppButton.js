// import { MaterialCommunityIcons } from "@ref/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import color from "color";
import React from "react";
import { withTheme, Button } from "react-native-paper";

import { styles } from "../styles";

const AppButton = (props) => {
  const { iconSize = 24 } = { props };
  const { color: buttonColor, disabled, theme, mode = "contained" } = props;
  const { colors } = theme;
  let textColor;
  let backgroundColor;

  if (mode === "contained") {
    if (disabled) {
      backgroundColor = color(theme.dark ? "#FFF" : "#000")
        .alpha(0.12)
        .rgb()
        .string();
    } else if (buttonColor) {
      backgroundColor = buttonColor;
    } else {
      backgroundColor = colors.primary;
    }
  } else {
    backgroundColor = "transparent";
  }

  if (disabled) {
    textColor = color(theme.dark ? "#FFF" : "#000")
      .alpha(0.32)
      .rgb()
      .string();
  } else if (mode === "contained") {
    const isDark = backgroundColor === "transparent"
      ? false
      : !color(backgroundColor).isLight();

    textColor = isDark ? "#FFF" : "#000";
  } else if (buttonColor) {
    textColor = buttonColor;
  } else {
    textColor = colors.primary;
  }

  return (
    <Button
      style={[styles.button, props.style]}
      contentStyle={[styles.buttonContent, props.contentStyle]}
      labelStyle={styles.buttonLabel}
      mode={mode}
      color={buttonColor}
      onPress={props.onPress}
      disabled={props.disabled}
      loading={props.loading}
      compact={props.compact}
      icon={() => (
        <MaterialCommunityIcons
          name={props.icon}
          size={iconSize}
          color={textColor}
        />
      )}
    >
      {props.title}
    </Button>
  );
};

export default withTheme(AppButton);
