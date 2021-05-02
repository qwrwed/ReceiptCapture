import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // alignItems: "center",
    // paddingHorizontal: 10,
    // marginVertical: 10,
    // justifyContent: "flex-end",
    // width: "100%",
    // backgroundColor: "#F00",
  },
  button: {
    // alignSelf: "stretch",
    height: RFValue(60),
    // width: "100%",
    marginVertical: 2,
  },
  buttonContent: {
    height: RFValue(60),
  },
  buttonLabel: {
    fontSize: RFValue(21),
  },
  text: {
    fontSize: RFValue(20),
  },
  textTitle: {
    textAlign: "center",
    paddingTop: 5,
    fontSize: RFValue(20),
    fontWeight: "400",
    textDecorationLine: "underline",
  },
  textInfo: {
    fontSize: RFValue(18),
    textAlign: "center",
  },
  textMono: {
    fontSize: RFValue(18),
    // textAlign: 'center',
    fontFamily: "monospace",
  },
});

export { styles };
