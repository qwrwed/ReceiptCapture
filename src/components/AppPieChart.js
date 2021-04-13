/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
// import { PieChart } from "react-minimal-pie-chart";
import React, { useState, useEffect, useCallback } from "react";
import { View, Dimensions } from "react-native";
import { PieChart as PieChartKit } from "react-native-chart-kit";
import { PieChart as PieChartSVG } from "react-native-svg-charts";
import { Circle, G, Line, Text, Rect } from "react-native-svg";

import RectText from "./RectText";

const pressHandler = (data) => {
  console.log(`You pressed ${data.label}`);
};

// https://github.com/JesperLekland/react-native-svg-charts#piechart
const AppPieChartSVG = ({ data, config }) => {
  const screenWidth = Dimensions.get("window").width;

  const dataList = Object.entries(data)
    .map((entry) => ({ rawName: entry[0], value: entry[1] }))
    .filter((entry) => entry.rawName in config);

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

  const Labels = ({ slices }) => slices.map((slice, index) => {
    const { labelCentroid, pieCentroid, data: sliceData } = slice;
    const xCoordText = screenWidth * 0.4;
    return (
      <G
        key={`label-${sliceData.rawName}`}
        onPress={() => { pressHandler(sliceData); }}
      >
        <Line
          x1={pieCentroid[0]}
          y1={pieCentroid[1]}
          x2={labelCentroid[0]}
          y2={labelCentroid[1]}
          stroke={sliceData.svg.fill}
        />
        <Line
          x1={labelCentroid[0]}
          y1={labelCentroid[1]}
          x2={xCoordText}
          y2={labelCentroid[1]}
          stroke={sliceData.svg.fill}
        />
        <G
          // x={labelCentroid[0]}
          x={xCoordText}
          y={labelCentroid[1]}
        >
          <RectText rectFill={sliceData.svg.fill} textAnchor="start">
            {sliceData.percentage}%: {sliceData.label}
          </RectText>
        </G>
      </G>
    );
  });

  return (
    <PieChartSVG
      data={pieData}
      // style={{ height: 200 }}
      style={{
        flex: 1,
        width: "200%",
        left: "-100%",
        // backgroundColor: "#00F",
      }}
      startAngle={0}
      endAngle={Math.PI * 1}
      innerRadius="40%"
      outerRadius="70%"
      labelRadius="80%"
      padAngle={3 * (Math.PI / 180)}
      sort={() => 0}
    >
      <Labels />
    </PieChartSVG>
  );
};

// legendFontColor: "#7F7F7F",
// legendFontSize: 15,
const AppPieChartKit = ({ data: myData }) => {
  const screenWidth = Dimensions.get("window").width;
  return (
    <View>
      <Text>Pie Chart Start</Text>
      <PieChartKit
      // data={receivedInfo[0]}
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
