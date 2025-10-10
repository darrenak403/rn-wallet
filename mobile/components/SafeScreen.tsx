"use client";
import {View} from "react-native";
import React from "react";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {COLORS} from "../constants/colors";

const SafeScreen: React.FC<React.PropsWithChildren<object>> = ({children}) => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        paddingTop: insets.top,
        flex: 1,
        backgroundColor: COLORS.background,
      }}
    >
      {children}
    </View>
  );
};

export default SafeScreen;
