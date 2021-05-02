/* eslint-disable react/no-array-index-key */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
// import { PieChart } from "react-minimal-pie-chart";
import React, { useState, useEffect, useCallback } from "react";
import { View, Dimensions, ScrollView, Image } from "react-native";
import { Text as NativeText, Modal, Portal, DataTable } from "react-native-paper";
import { PieChart as PieChartKit } from "react-native-chart-kit";
import { PieChart as PieChartSVG } from "react-native-svg-charts";
import { Circle, G, Line, Text, Rect, ForeignObject } from "react-native-svg";
import { RFValue } from "react-native-responsive-fontsize";
import color from "color";

import RectText from "./RectText";
import AppModal from "./AppModal";
import { objectMap, sumValues, titleCase } from "../utils";

const objDataToPieData = (data, config, scaleArcs, pressHandler) => {
  const dataList = Object.entries(data.summary)
    .map((entry) => ({ rawName: entry[0], value: entry[1] }))
    .filter((entry) => entry.rawName in config && !config[entry.rawName]?.disabled);

  const valueSum = dataList.reduce((acc, item) => acc + item.value, 0);
  const pieData = dataList
    .filter((item) => item.value > 0 && item.rawName in config)
    .map((item, index) => ({
      ...item,
      label: config[item.rawName].label,
      refProportion: config[item.rawName].refProportion,
      proportion: item.value / valueSum,
      arc: { cornerRadius: 3 },
      svg: {
        fill: config[item.rawName].color,
        onPress: () => { pressHandler(item, data); },
      },
      key: `pie-${item.rawName}`,
    }))
    .map((item, index) => ({
      ...item,
      percentage: Math.round(item.proportion * 100),
      refPercentage: Math.round(item.refProportion * 100),
    })).map((item, index) => ({
      ...item,
      arc: scaleArcs ? { ...item.arc, outerRadius: `${item.proportion / config[item.rawName].refProportion * 100}%` } : item.arc,
    }));
  return pieData;
};

const AppPieChartBase = ({
  data,
  scaleArcs,
  config,
  children,
  angles = {},
  radii = {},
  style = {},
  sort = () => 0,
  pressHandler = () => {},
}) => {
  const _angles = { start: 0, end: 360, pad: 0, ...angles };
  const _radii = { inner: 0, outer: 0.8, label: 1, ...radii };
  const anglesRad = objectMap(_angles, (k, v) => [k, v * Math.PI / 180]);
  const radiiPercent = objectMap(_radii, (k, v) => [k, `${v * 100}%`]);

  return (
    <PieChartSVG
      data={objDataToPieData(data, config, scaleArcs, pressHandler)}
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

const LabelsOuter = ({ slices, myData, pressHandler }) => slices.map((slice, index) => {
  const screenWidth = Dimensions.get("window").width;
  const { labelCentroid, pieCentroid, data: sliceData } = slice;
  const xCoordText = screenWidth * 0.4;
  const strokeWidth = 2;

  return (
    <G
      key={`label-outer-${sliceData.rawName}`}
      onPress={() => { pressHandler(sliceData, myData); }}
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
        <RectText
          fontSize={RFValue(18)}
          rectFill={sliceData.svg.fill}
          textAnchor="start"
        >
          {`${sliceData.percentage}%: ${sliceData.label}`}
        </RectText>
      </G>
    </G>
  );
});

const LabelsInner = ({ slices, height, width }) => slices.map((slice, index) => {
  const { labelCentroid, pieCentroid, data: sliceData } = slice;
  const dy = labelCentroid[1] - pieCentroid[1];
  const dx = labelCentroid[0] - pieCentroid[0];
  const rotation = Math.atan2(dy, dx) * 180 / Math.PI;
  const r = 0.0;

  return (
    <G
      key={`label-inner-${sliceData.rawName}`}
      x={(pieCentroid[0] * (1 - r)) + (labelCentroid[0] * r)}
      y={(pieCentroid[1] * (1 - r)) + (labelCentroid[1] * r)}
    >
      <Text
        rotation={rotation}
        fill="white"
        textAnchor="middle"
        letterSpacing="1.2"
        alignmentBaseline="middle"
        fontSize={RFValue(14)}
        stroke="white"
        strokeWidth={0.5}
      >
        {`${sliceData.percentage}%`}
      </Text>
    </G>

  );
});

// https://github.com/JesperLekland/react-native-svg-charts#piechart
const AppDoublePieChart = ({ dataOuter, dataInner, config, children, centreText }) => {
  const [showInfoModal, setShowInfoModal] = useState(false);
  // console.log(config);
  const pressHandler = (slice, data) => {
    console.log("\n\n\n");
    console.log(`You pressed ${slice.rawName}`);
    // console.log(slice);
    // console.log(data.list);
    setShowInfoModal(true);
  };

  const imgWidth = 50;
  const columnStyles = objectMap(config, (k, v) => [k, {
    flex: v.label.length + 5,
    backgroundColor: color(v.color).alpha(0.5).string(),
    padding: 5,
  }]);
  const imgStyle = {
    flex: 0,
    width: imgWidth,
  };
  const nameStyle = {
    width: "30%",
    padding: 5,
    flex: 0,

  };

  return (
    <>
      <AppModal
        visible={showInfoModal}
        setVisible={setShowInfoModal}
        style={{ width: "95%", padding: 0 }}
      >
        <ScrollView>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title style={imgStyle} />
              <DataTable.Title style={nameStyle}>Name</DataTable.Title>
              {Object.keys(config).map((field) => (
                <DataTable.Title
                  numeric
                  key={field}
                  style={columnStyles[field]}
                >
                  {config[field].label}
                </DataTable.Title>
              ))}
            </DataTable.Header>
            {dataOuter.list.map((item, index) => (
              <DataTable.Row key={index}>
                <DataTable.Cell style={{ flex: 0 }}>
                  <View><Image
                    style={{
                      width: imgWidth,
                      height: imgWidth,
                      resizeMode: "contain",
                      backgroundColor: "#FFF",
                    }}
                    source={{ uri: item.photo.thumb }}
                  />
                  </View>
                </DataTable.Cell>
                <DataTable.Cell style={nameStyle}>
                  {titleCase(item.food_name)}
                </DataTable.Cell>
                {Object.keys(config).map((field) => (
                  <DataTable.Cell
                    key={field}
                    numeric
                    style={columnStyles[field]}
                  >
                    {Math.round(item[field])} g
                  </DataTable.Cell>
                ))}
              </DataTable.Row>
            ))}
            <DataTable.Row>
              <DataTable.Cell style={imgStyle} />
              <DataTable.Cell style={nameStyle}>Total</DataTable.Cell>
              {Object.keys(config).map((field) => (
                <DataTable.Cell
                  key={field}
                  numeric
                  style={columnStyles[field]}
                >
                  {Math.round(dataOuter.summary[field])} g
                </DataTable.Cell>
              ))}
            </DataTable.Row>
          </DataTable>
        </ScrollView>

      </AppModal>

      <AppPieChartBase
        data={{ summary: dataOuter.summary, list: dataOuter.list }}
        config={config}
        pressHandler={pressHandler}
        style={{ width: "200%", left: "-100%" }}
        angles={{ start: 0, end: 180, pad: 2 * 3 / 5 }}
        radii={{ inner: 0.55, outer: 0.75, label: 0.85 }}
      >
        <LabelsOuter // extraProps: width, height, data, slices
          myData={{ summary: dataOuter.summary, list: dataOuter.list }}
          pressHandler={pressHandler}
        />
        <View>
          <AppPieChartBase
            data={{ summary: dataInner.summary, list: dataOuter.list }}
            config={config}
            radii={{ inner: 0.3, outer: 0.53, label: 0.8 }}
            angles={{ start: 0, end: 180, pad: 2 }}
          >
            {/* <ForeignObject>
          <View style={{
            height: "100%",
            // justifyContent: "center",
            // alignContent: "center",
            // alignItems: "center",
            // alignSelf: "flex-start",
            backgroundColor: "#0000fF77",
          }}
          >
            { {children} }
            <NativeText>native</NativeText>
          </View>

        </ForeignObject> */}
            <LabelsInner />

            <Text
              fill="white"
              textAnchor="start"
              letterSpacing="1.2"
              alignmentBaseline="middle"
              fontSize={RFValue(12)}
              stroke="white"
              strokeWidth={0.5}
            >
              {centreText}
            </Text>

          </AppPieChartBase>
        </View>
      </AppPieChartBase>
    </>
  );
};

const AppScalePieChart = ({ dataOuter, config, children }) => (
  <AppPieChartBase
    style={{ width: "200%", left: "-100%" }}
    data={{ _: 1 }}
    config={{ _: { label: "_", color: "#FFFFFF" } }}
    radii={{ inner: 0, outer: 0.7, label: 0.8 }}
    angles={{ start: 0, end: 180, pad: 0 }}

  >
    <View>
      <AppPieChartBase
        scaleArcs={true}
        data={dataOuter}
        config={config}
        angles={{ start: 0, end: 180, pad: 0 }}
        radii={{ inner: 0, outer: 0.7, label: 0.8 }}
      >
        <LabelsOuter />
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

export { AppDoublePieChart, AppScalePieChart };
