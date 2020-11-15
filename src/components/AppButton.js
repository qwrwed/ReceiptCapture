import { MaterialCommunityIcons } from "@ref/vector-icons";
import React from "react";
import { useColorScheme } from "react-native";
import { DarkTheme, DefaultTheme, Button } from "react-native-paper";

import { styles } from "../styles";

export const AppButton = (props) => {
  const colorScheme = useColorScheme();
  const { theme = colorScheme === "dark" ? DarkTheme : DefaultTheme } = {
    props,
  };
  const { colors } = theme;
  const { iconSize = 24 } = { props };
  return (
    <Button
      style={[styles.button, props.style]}
      contentStyle={styles.buttonContent}
      labelStyle={styles.buttonLabel}
      mode="contained"
      onPress={props.onPress}
      disabled={props.disabled}
      loading={props.loading}
      compact={props.compact}
      icon={() => (
        <MaterialCommunityIcons
          name={props.icon}
          size={iconSize}
          color={colors.background}
        />
      )}
    >
      {props.title}
    </Button>
  );
};
