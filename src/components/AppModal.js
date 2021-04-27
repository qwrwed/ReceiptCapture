import React, { } from "react";
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
        padding: 20,
        // margin: 20,
        ...style,
      }}
    >
      {children}
    </Modal>
  </Portal>
);

export default withTheme(AppModal);
