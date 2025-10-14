import {useSignIn} from "@clerk/clerk-expo";
import {Link, useRouter} from "expo-router";
import {Text, TextInput, TouchableOpacity, View, Image} from "react-native";
import React, {useState} from "react";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {styles} from "@/assets/styles/auth.styles";
import {Ionicons} from "@expo/vector-icons";
import {COLORS} from "@/constants/colors";

export default function Page() {
  const {signIn, setActive, isLoaded} = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return;

    setError("");
    try {
      const result = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (result.status === "complete") {
        await setActive({session: result.createdSessionId});
        router.replace("/");
      } else {
        console.log(result);
      }
    } catch (err: any) {
      console.log(JSON.stringify(err, null, 2)); // để debug

      if (err.errors?.[0]?.code === "too_many_requests") {
        setError(
          "Too many attempts. Please wait a few minutes before trying again."
        );
      } else if (err.errors?.[0]?.code === "form_identifier_not_found") {
        setError("No account found with that email address.");
      } else if (err.errors?.[0]?.code === "form_password_incorrect") {
        setError("Incorrect password.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <KeyboardAwareScrollView
      style={{flex: 1}}
      contentContainerStyle={{flexGrow: 1}}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      extraScrollHeight={150}
    >
      <View style={styles.container}>
        <View style={{alignItems: "center"}}>
          <Image
            source={require("../../assets/images/revenue-i4.png")}
            style={styles.illustration}
          />
        </View>
        <Text style={styles.title}>Welcome Back</Text>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError("")}>
              <Ionicons name="close" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        ) : null}

        <TextInput
          style={[styles.input, error && styles.errorInput]}
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter email"
          placeholderTextColor="#9A8478"
          onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        />
        <TextInput
          style={[styles.input, error && styles.errorInput]}
          value={password}
          placeholder="Enter password"
          placeholderTextColor="#9A8478"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
        <TouchableOpacity style={styles.button} onPress={onSignInPress}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Don&apos;t have an account?</Text>
          <Link href="/sign-up" asChild>
            <TouchableOpacity>
              <Text style={styles.linkText}>Sign up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
