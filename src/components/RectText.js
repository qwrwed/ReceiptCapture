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
  const [layout, setLayout] = useState({ width: 0, height: 0, x: 0, y: 0 });
  const xOffset = {
    start: 0,
    middle: 0.5,
    end: 1,
  };
  return (
    <G x={x} y={y - (layout.height / 2)} onPress={onPress}>
      <Rect
        rx={3}
        x={-(layout.width * xOffset[textAnchor]) - pad}
        y={0 - pad}
        width={layout.width + (pad * 2)}
        height={layout.height + (pad * 2)}
        fill={rectFill}
      />
      <Text
        textAnchor={textAnchor}
        alignmentBaseline="hanging"
        fill="white"
        fontSize={20}
        stroke="white"
        strokeWidth={0}
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
