import {StyleSheet, Text, View} from "react-native";

export default function Index() {
  return (
    //View = div
    //Text = p, span
    <View style={styles.container}>
      <Text>Edit app/index.tsx to edit this screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "red",
  },
});
