import React from "react";
import { View, ScrollView } from "react-native";
import "react-native-gesture-handler";

import { styles } from "../styles";

const AppScreenWrapper = (props) => (
  <View
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
        paddingVertical: 10,
      }}
    >
      {props.children}
    </ScrollView>
  </View>
);

export default AppScreenWrapper;
