import { colors } from "@/ReactNativeFrontend/constants/theme";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import { scale, verticalScale } from "@/utils/styling";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/welcome");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/SplashScreen.png")}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral100,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: scale(300),
    height: verticalScale(500),
  },
});
