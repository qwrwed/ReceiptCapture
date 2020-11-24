import { setStatusBarHidden } from "expo-status-bar";
import React, { useState } from "react";
import { Pressable, View, ScrollView, Modal } from "react-native";
import { Text, withTheme } from "react-native-paper";

import { styles } from "../styles";

const CodeWithModal = (props) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <View>
      <ScrollView
        style={{
          borderRadius: props.theme.roundness,
          backgroundColor: "#7773",
          height: 100,
          padding: 5,
          marginVertical: 2,
        }}
      >
        <Pressable
          onPress={() => {
            setShowModal(true);
            setStatusBarHidden(true);
          }}
        >
          <Text style={styles.text}>{props.title} (press to expand):</Text>
          <Text style={styles.textMono}>{props.children}</Text>
        </Pressable>
      </ScrollView>

      <Modal
        visible={showModal}
        transparent={true}
        onRequestClose={() => {
          setShowModal(false);
          setStatusBarHidden(false);
        }}
      >
        <View
          style={{ flex: 1, backgroundColor: props.theme.colors.background }}
        >
          <ScrollView style={{ flex: 1, backgroundColor: "#7773" }}>
            <View style={{ padding: 10 }}>
              <Text style={styles.text}>{props.title}:</Text>
              <Text style={styles.textMono}>{props.children}</Text>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

export default withTheme(CodeWithModal);
