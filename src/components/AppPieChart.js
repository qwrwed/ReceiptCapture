/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
// import { PieChart } from "react-minimal-pie-chart";
import React, { useState, useEffect, useCallback } from "react";
import { View, Dimensions } from "react-native";
import { Text as NativeText } from "react-native-paper";
import { PieChart as PieChartKit } from "react-native-chart-kit";
import { PieChart as PieChartSVG } from "react-native-svg-charts";
import { Circle, G, Line, Text, Rect, ForeignObject } from "react-native-svg";
import { RFValue } from "react-native-responsive-fontsize";

import RectText from "./RectText";
import { objectMap } from "../utils";

const pressHandler = (data) => {
  console.log(`You pressed ${data.rawName}`);
};

const objDataToPieData = (data, config) => {
  const dataList = Object.entries(data)
    .map((entry) => ({ rawName: entry[0], value: entry[1] }))
    .filter((entry) => entry.rawName in config && !config[entry.rawName]?.disabled);

  const valueSum = dataList.reduce((acc, item) => acc + item.value, 0);
  const pieData = dataList
    .filter((item) => item.value > 0 && item.rawName in config)
    .map((item, index) => ({
      ...item,
      label: config[item.rawName].label,
      proportion: item.value / valueSum,
      percentage: Math.round(item.value / valueSum * 100),
      svg: {
        fill: config[item.rawName].color,
        onPress: () => { pressHandler(item); },
      },
      key: `pie-${item.rawName}`,
    }));
  return pieData;
};

const AppPieChartBase = ({
  data,
  config,
  children,
  angles = {},
  radii = {},
  style = {},
  sort = () => 0,
}) => {
  const _angles = { start: 0, end: 360, pad: 0, ...angles };
  const _radii = { inner: 0, outer: 0.8, label: 1, ...radii };
  const anglesRad = objectMap(_angles, (k, v) => [k, v * Math.PI / 180]);
  const radiiPercent = objectMap(_radii, (k, v) => [k, `${v * 100}%`]);

  return (
    <PieChartSVG
      data={objDataToPieData(data, config)}
      style={{ flex: 1, ...style }}
      startAngle={anglesRad.start}
      endAngle={anglesRad.end}
      padAngle={anglesRad.pad}
      innerRadius={radiiPercent.inner}
      outerRadius={radiiPercent.outer}
      labelRadius={radiiPercent.label}
      sort={sort}
    >
      {children}
    </PieChartSVG>
  );
};

const LabelsOuter = ({ slices }) => slices.map((slice, index) => {
  const screenWidth = Dimensions.get("window").width;
  const { labelCentroid, pieCentroid, data: sliceData } = slice;
  const xCoordText = screenWidth * 0.4;
  const strokeWidth = 2;
  return (
    <G
      key={`label-outer-${sliceData.rawName}`}
      onPress={() => { pressHandler(sliceData); }}
    >
      <Line
        x1={pieCentroid[0]}
        y1={pieCentroid[1]}
        x2={labelCentroid[0]}
        y2={labelCentroid[1]}
        stroke={sliceData.svg.fill}
        strokeWidth={strokeWidth}
      />
      <Circle
        cx={labelCentroid[0]}
        cy={labelCentroid[1]}
        r={strokeWidth / 2}
        fill={sliceData.svg.fill}
      />
      <Line
        x1={labelCentroid[0]}
        y1={labelCentroid[1]}
        x2={xCoordText}
        y2={labelCentroid[1]}
        stroke={sliceData.svg.fill}
        strokeWidth={strokeWidth}
      />
      <G
        // x={labelCentroid[0]}
        x={xCoordText}
        y={labelCentroid[1]}
      >
        <RectText rectFill={sliceData.svg.fill} textAnchor="start">
          {`${sliceData.percentage}%: ${sliceData.label}`}
        </RectText>
      </G>
    </G>
  );
});

const LabelsInner = ({ slices, height, width }) => slices.map((slice, index) => {
  const { labelCentroid, pieCentroid, data: sliceData } = slice;
  return (
    <Text
      key={`label-inner-${sliceData.rawName}`}
      x={pieCentroid[0]}
      y={pieCentroid[1]}
      fill="white"
      textAnchor="middle"
      letterSpacing="1.2"
      alignmentBaseline="middle"
      fontSize={RFValue(16)}
      stroke="white"
      strokeWidth={0.5}
    >
      {`${sliceData.percentage}%`}
    </Text>
  );
});

// https://github.com/JesperLekland/react-native-svg-charts#piechart
const AppPieChartSVG = ({ dataInner, dataOuter, config, children }) => (
  <AppPieChartBase
    data={dataOuter}
    config={config}
    style={{
      width: "200%",
      left: "-100%",
      // backgroundColor: "#00F",
    }}
    angles={{ start: 0, end: 180, pad: 3 }}
    radii={{ inner: 0.4, outer: 0.7, label: 0.8 }}
  >
    <LabelsOuter />
    <View>
      <AppPieChartBase
        data={dataInner}
        config={config}
        radii={{ inner: 0.2, outer: 0.36, label: 0.8 }}
        angles={{ start: 0, end: 180, pad: 5 }}
      >
        {/* <LabelsInner /> */}
      </AppPieChartBase>
    </View>
  </AppPieChartBase>
);

// legendFontColor: "#7F7F7F",
// legendFontSize: 15,
const AppPieChartKit = ({ data: myData }) => {
  const screenWidth = Dimensions.get("window").width;
  return (
    <View>
      <Text>Pie Chart Start</Text>
      <PieChartKit
        data={myData}
        width={screenWidth}
        height={220}
        chartConfig={{
          backgroundGradientFrom: "#1E2923",
          backgroundGradientTo: "#08130D",
          color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
        }}
        accessor="value"
        backgroundColor="transparent"
        paddingLeft="15"
      />
      <Text>Pie Chart End</Text>
    </View>
  );
};

const AppPieChart = AppPieChartSVG;
// const AppPieChart = PieChartWithCenteredLabels;

export default AppPieChart;
