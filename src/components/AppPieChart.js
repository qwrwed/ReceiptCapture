/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
// import { PieChart } from "react-minimal-pie-chart";
import React, { useState, useEffect, useCallback } from "react";
import { View, Dimensions } from "react-native";
import { PieChart as PieChartKit } from "react-native-chart-kit";
import { PieChart as PieChartSVG } from "react-native-svg-charts";
import { Circle, G, Line, Text, Rect } from "react-native-svg";

import RectText from "./RectText";

const myData = [
  {
    label: "Protein",
    rawName: "nf_protein",
    value: 54.98,
    color: "red",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
  },
  {
    label: "Carbohydrates",
    rawName: "nf_total_carbohydrate",
    value: 130.53,
    color: "yellow",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
  },
  {
    label: "Fat",
    rawName: "nf_total_fat",
    value: 41.37,
    color: "orange",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
  },
];

// eslint-disable-next-line no-bitwise
const randomColor = () => (`#${((Math.random() * 0xffffff) << 0).toString(16)}000000`).slice(0, 7);

const pressHandler = (data) => {
  console.log(`You pressed ${data.label}`);
};

// https://github.com/JesperLekland/react-native-svg-charts#piechart
const AppPieChartSVG = () => {
  const screenWidth = Dimensions.get("window").width;
  const valueSum = myData.reduce((acc, item) => acc + item.value, 0);
  const pieData = myData
    .filter((item) => item.value > 0)
    .map((item, index) => ({
      ...item,
      proportion: item.value / valueSum,
      percentage: Math.round(item.value / valueSum * 100),
      svg: {
        fill: item.color,
        onPress: () => { pressHandler(item); },
      },
      key: `pie-${item.rawName}`,
    }));

  const Labels = ({ slices }) => slices.map((slice, index) => {
    const { labelCentroid, pieCentroid, data } = slice;
    const xCoordText = screenWidth * 0.4;
    return (
      <G
        key={`label-${data.rawName}`}
        onPress={() => { pressHandler(data); }}
      >
        <Line
          x1={pieCentroid[0]}
          y1={pieCentroid[1]}
          x2={labelCentroid[0]}
          y2={labelCentroid[1]}
          stroke={data.svg.fill}
        />
        <Line
          x1={labelCentroid[0]}
          y1={labelCentroid[1]}
          x2={xCoordText}
          y2={labelCentroid[1]}
          stroke={data.svg.fill}
        />
        <G
          // x={labelCentroid[0]}
          x={xCoordText}
          y={labelCentroid[1]}
        >
          <RectText rectFill={data.svg.fill} textAnchor="start">
            {data.percentage}%: {data.label}
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
const AppPieChartKit = () => {
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
