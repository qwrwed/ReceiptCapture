import { StatusBar } from "expo-status-bar";
import React from "react";

const AppStatusBar = (props) => {
  return (
    <StatusBar style={props.barStyle} backgroundColor={props.backgroundColor} />
  );
};

export default AppStatusBar;
