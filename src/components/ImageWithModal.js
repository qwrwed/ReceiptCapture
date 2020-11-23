import { setStatusBarHidden } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { Pressable, View, Image, Modal } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import { Text } from "react-native-paper";

const ImageWithModal = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [actualSize, setActualSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    Image.getSize(props.uri, (width, height) => {
      setActualSize({ width, height });
    });
  });

  return (
    <View>
      {false && <Text>{JSON.stringify(actualSize)}</Text>}
      <Pressable
        onPress={() => {
          setStatusBarHidden(true);
          setShowModal(true);
        }}
      >
        <Image
          source={{ uri: props.uri }}
          style={{ width: 200, height: 177 }}
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

export default ImageWithModal;
