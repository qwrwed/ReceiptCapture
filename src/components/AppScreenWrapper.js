import React from "react";
import { ScrollView } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";

import { styles } from "../styles";
import { AppSafeAreaView } from "./AppSafeAreaView";
import { AppStatusBar } from "./AppStatusBar";

export const AppScreenWrapper = (props) => {
  return (
    <PaperProvider theme={props.theme}>
      <AppStatusBar barStyle="auto" />
      <AppSafeAreaView
        style={[
          { backgroundColor: props.theme.colors.background },
          styles.container,
          props.style,
        ]}
      >
        <ScrollView
          style={{ width: "100%" }}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "flex-end",
          }}
        >
          {props.children}
        </ScrollView>
      </AppSafeAreaView>
    </PaperProvider>
  );
};
