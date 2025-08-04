import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import { colors, spacingY, spacingX } from "@/constants/theme";
import Typo from "@/components/Typo";
import { verticalScale } from "@/utils/styling";
import Button from "@/components/Button";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";

export default function Welcome() {
  const router = useRouter();

  return (
    <ScreenWrapper>
      <Animated.View entering={FadeIn} style={styles.container}>
        <TouchableOpacity
          onPress={() => router.push("/(auth)/login")}
          style={styles.loginButton}
        >
          <Typo fontWeight={"500"} size={16}>
            Sign In
          </Typo>
        </TouchableOpacity>

        {/* Welcome image */}
        <Animated.Image
          entering={FadeIn.duration(1500)}
          source={require("@/assets/images/welcome.png")}
          style={styles.WelcomeImage}
          resizeMode="contain"
        />

        {/* Footer */}
        <View style={styles.footer}>
          <View style={{ alignItems: "center" }}>
            <Typo size={28} fontWeight={"800"}>
              Work. Hire. Grow.
            </Typo>
            <Typo size={28} fontWeight={"800"}>
              Your journey starts here
            </Typo>
          </View>

          <View style={{ alignItems: "center", gap: 2 }}>
            <Typo size={16} color={colors.textLight}>
              Connect with clients and freelancers
            </Typo>
            <Typo size={16} color={colors.textLight}>
              All in one trusted platform
            </Typo>
          </View>

          <Animated.View
            entering={FadeInDown.duration(1000).delay(200).springify()}
            style={styles.buttoncontainer}
          >
            <Button onPress={() => router.push("/(auth)/register")}>
              <Typo size={20} color={colors.black} fontWeight={"600"}>
                Get Started
              </Typo>
            </Button>
          </Animated.View>
        </View>
      </Animated.View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: spacingY._10,
  },
  loginButton: {
    alignSelf: "flex-end",
    paddingHorizontal: spacingX._25,
    paddingTop: spacingY._5,
  },
  WelcomeImage: {
    width: "100%",
    height: verticalScale(280),
    alignSelf: "center",
    marginTop: verticalScale(10),
  },
  footer: {
    backgroundColor: colors.white,
    alignItems: "center",
    paddingTop: verticalScale(30),
    paddingBottom: verticalScale(50),
    gap: spacingY._20,
    shadowColor: "white",
    shadowOffset: { width: 0, height: -8 },
    elevation: 10,
    shadowRadius: 25,
    shadowOpacity: 0.5,
  },
  buttoncontainer: {
    width: "100%",
    paddingHorizontal: spacingX._25,
  },
});
