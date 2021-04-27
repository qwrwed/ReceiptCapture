import React, { } from "react";
import { View } from "react-native";
import { Portal, Modal, withTheme } from "react-native-paper";

const AppModal = ({ visible, setVisible, children, theme, style }) => (
  <Portal>
    <Modal
      visible={visible}
      onDismiss={() => setVisible(false)}
      contentContainerStyle={{
        backgroundColor: theme.colors.background,
        alignSelf: "center",
        borderRadius: theme.roundness,
        ...style,
      }}
    >
      <View
        style={{
          backgroundColor: theme.colors.surface,
          padding: 20,
          borderRadius: theme.roundness,
        }}
      >
        {children}
      </View>
    </Modal>
  </Portal>
);

export default withTheme(AppModal);
