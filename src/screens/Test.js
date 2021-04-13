/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { View, Dimensions } from "react-native";
import { Props } from "react-native-image-zoom-viewer/built/image-viewer.type";
import { Text as NativeText } from "react-native-paper";
import { Svg, Circle, G, Line, Text, Rect } from "react-native-svg";

import AppPieChart from "../components/AppPieChart";

const RectText = ({ pad = 10, children, rectFill, x, y, viewBoxX = 100, viewBoxY = 100 }) => {
  const [layout, setLayout] = useState({});
  const scaleX = viewBoxX / 400;
  const scaleY = viewBoxX / 400;
  return (
    <G x={x} y={y}>
      <Rect
        x={0 - (pad / 2)}
        y={typeof (layout?.height) !== "undefined" ? -(layout.height + pad) * scaleY : 0}
        width={typeof (layout?.width) !== "undefined" ? (layout.width * scaleX) + pad : 25}
        height={typeof (layout?.height) !== "undefined" ? (layout.height * scaleY) + pad : 50}
        fill={rectFill}
      />
      <Text
        fill="white"
        fontSize={23}
        stroke="black"
        strokeWidth={0.5}
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

const TestScreen = () => (
  <>
    <View style={{ height: 300 }} />
    <Svg height="300" width="300" viewBox="0 0 100 100">
      <RectText
        pad={0}
        x={10}
        y={10}
        rectFill="blue"
        viewBoxX={100}
        // viewBoxY={150}
      >
        AAAA
      </RectText>
    </Svg>
  </>
);

export default TestScreen;
