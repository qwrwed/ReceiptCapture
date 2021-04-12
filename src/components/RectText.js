/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { View, Dimensions } from "react-native";
import { Props } from "react-native-image-zoom-viewer/built/image-viewer.type";
import { Text as NativeText } from "react-native-paper";
import { Svg, Circle, G, Line, Text, Rect } from "react-native-svg";

const RectText = ({
  pad = 10,
  rectFill = "grey",
  x = 0,
  y = 0,
  textAnchor = "middle",
  children,
  onPress,
}) => {
// const RectText = (props) => {
  // const { pad = 10, rectFill = "grey", x = 0, y = 0 } = props;
  const [layout, setLayout] = useState({});
  const xOffset = {
    start: 0,
    middle: 1,
    end: 2,
  };
  return (
    <G x={x} y={y} onPress={onPress}>
      <Rect
        x={typeof (layout?.width) !== "undefined" ? -((layout.width * xOffset[textAnchor]) + pad) * 0.5 : 0}
        y={typeof (layout?.height) !== "undefined" ? -(layout.height + pad) * 0.75 : 0}
        width={typeof (layout?.width) !== "undefined" ? layout.width + pad : 25}
        height={typeof (layout?.height) !== "undefined" ? layout.height + pad : 50}
        fill={rectFill}
      />
      <Text
        textAnchor={textAnchor}
        // alignmentBaseline="middle"
        fill="white"
        fontSize={20}
        stroke="black"
        strokeWidth={0.6}
        onLayout={({ nativeEvent: { layout: newLayout } }) => {
          if (newLayout.height === 0 || newLayout === 0) {
            return;
          }
          setLayout(newLayout);
        }}
      >
        { children }
      </Text>
    </G>
  );
};

export default RectText;
