import { setStatusBarHidden } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { Pressable, View, Image, Modal } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import { withTheme } from "react-native-paper";

const ImageWithModal = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [actualSize, setActualSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    if (props.uri !== null) {
      Image.getSize(props.uri, (width, height) => {
        setActualSize({ width, height });
      });
    }
  }, [props.uri]);

  return (
    <View
      style={[
        props.style,
        {
          flex: 1,
        },
      ]}
    >
      <Pressable
        onPress={() => {
          if (props.uri !== null) {
            setStatusBarHidden(true);
            setShowModal(true);
          }
        }}
      >
        <Image
          source={{ uri: props.uri }}
          style={[
            {
              borderRadius: props.style.borderRadius,
              width: "100%",
              height: "100%",
            },
          ]}
        />
      </Pressable>
      <Modal
        visible={showModal}
        transparent={true}
        statusBarTranslucent={true}
        onRequestClose={() => {
          setShowModal(false);
          setStatusBarHidden(false);
        }}
      >
        <ImageViewer
          imageUrls={[
            {
              url: "",
              width: actualSize.width,
              height: actualSize.height,
              props: { source: { uri: props.uri } },
            },
          ]}
        />
      </Modal>
    </View>
  );
};

export default withTheme(ImageWithModal);
