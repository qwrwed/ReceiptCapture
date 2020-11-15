import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 10,
    //backgroundColor: "#F00",
  },
  button: {
    alignSelf: "stretch",
    height: RFValue(60),
    width: "100%",
    marginVertical: 2,
  },
  buttonContent: {
    height: "100%",
  },
  buttonLabel: {
    fontSize: RFValue(21),
  },
  text: {
    fontSize: RFValue(20),
  },
  textMono: {
    fontSize: RFValue(18),
    // textAlign: 'center',
    fontFamily: "monospace",
  },
});

export { styles };
