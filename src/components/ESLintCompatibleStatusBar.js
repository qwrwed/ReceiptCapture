import { StatusBar } from "expo-status-bar";
import React from "react";

export const ESLintCompatibleStatusBar = (props) => {
  return <StatusBar style={props.barStyle} />;
};
