import { Alert, Pressable, StyleSheet, View } from "react-native";
import React, { useRef, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import BackButton from "@/components/BackButton";
import { colors, spacingX, spacingY } from "@/constants/theme";
import Input from "@/components/Input";
import * as Icons from "phosphor-react-native";
import { verticalScale } from "@/utils/styling";
import Button from "@/components/Button";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native";

export default function Register() {
  const [role, setRole] = useState<"freelancer" | "client" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Common fields
  const nameRef = useRef("");
  const emailRef = useRef("");
  const passwordRef = useRef("");

  // Freelancer-specific fields
  const skillsRef = useRef("");
  const experienceRef = useRef("");
  const rateRef = useRef("");

  // Client-specific fields
  const companyRef = useRef("");
  const phoneRef = useRef("");
  const profileUrlRef = useRef("");

  const handleSubmit = async () => {
    if (!nameRef.current || !emailRef.current || !passwordRef.current) {
      Alert.alert("Register", "Please fill all the required fields");
      return;
    }

    if (
      role === "freelancer" &&
      (!skillsRef.current || !experienceRef.current || !rateRef.current)
    ) {
      Alert.alert("Register", "Please fill all freelancer details");
      return;
    }

    if (
      role === "client" &&
      (!companyRef.current || !phoneRef.current || !profileUrlRef.current)
    ) {
      Alert.alert("Register", "Please fill all client details");
      return;
    }

    setIsLoading(true);

    // Build the request body for both roles
    let body: any = {
      username: emailRef.current,
      password: passwordRef.current,
      role: role?.toUpperCase(),
      email: emailRef.current,
    };

    if (role === "client") {
      body = {
        ...body,
        clientName: nameRef.current,
        company: companyRef.current,
        phone: phoneRef.current,
        profileUrl: profileUrlRef.current,
      };
    } else if (role === "freelancer") {
      body = {
        ...body,
        name: nameRef.current,
        skills: skillsRef.current,
        hourlyRate: parseFloat(rateRef.current),
        bio: experienceRef.current,
        profileUrl: profileUrlRef.current,
      };
    }

    try {
      const res = await fetch("http://172.16.80.158:8080/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      setIsLoading(false);

      if (!res.ok) {
        Alert.alert("Error", data.msg || "Something went wrong");
        return;
      }

      Alert.alert("Success", "Registered successfully");
      router.replace("/(auth)/login");
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      Alert.alert("Network Error", "Could not connect to the server.");
    }
  };

  const RoleSelector = () => (
    <View style={styles.roleContainer}>
      <Pressable
        style={[
          styles.roleCard,
          role === "client" && { backgroundColor: colors.primaryLight },
        ]}
        onPress={() => setRole("client")}
      >
        <Typo fontWeight="700">I’m a Client</Typo>
      </Pressable>
      <Pressable
        style={[
          styles.roleCard,
          role === "freelancer" && { backgroundColor: colors.primaryLight },
        ]}
        onPress={() => setRole("freelancer")}
      >
        <Typo fontWeight="700">Im a Freelancer</Typo>
      </Pressable>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <ScreenWrapper>
        <View
          style={[
            styles.container,
            { flex: 1, justifyContent: "space-between" },
          ]}
        >
          <View>
            <BackButton iconSize={28} />
            <View style={{ gap: 5, marginTop: spacingY._20 }}>
              <Typo size={30} fontWeight="800">
                Lets
              </Typo>
              <Typo size={30} fontWeight="800">
                Get Started
              </Typo>
            </View>
            <View style={styles.form}>
              <Typo size={16} color={colors.black}>
                Choose your role to continue
              </Typo>

              {RoleSelector()}

              {role && (
                <>
                  <Input
                    placeholder="Full Name"
                    onChangeText={(val) => (nameRef.current = val)}
                    icon={
                      <Icons.User
                        size={26}
                        color={colors.neutral300}
                        weight="fill"
                      />
                    }
                  />
                  <Input
                    placeholder="Email"
                    onChangeText={(val) => (emailRef.current = val)}
                    icon={
                      <Icons.At
                        size={26}
                        color={colors.neutral300}
                        weight="fill"
                      />
                    }
                  />
                  <Input
                    placeholder="Password"
                    secureTextEntry
                    onChangeText={(val) => (passwordRef.current = val)}
                    icon={
                      <Icons.Lock
                        size={26}
                        color={colors.neutral300}
                        weight="fill"
                      />
                    }
                  />

                  {role === "client" && (
                    <>
                      <Input
                        placeholder="Company"
                        onChangeText={(val) => (companyRef.current = val)}
                        icon={
                          <Icons.Buildings
                            size={26}
                            color={colors.neutral300}
                            weight="fill"
                          />
                        }
                      />
                      <Input
                        placeholder="Phone"
                        onChangeText={(val) => (phoneRef.current = val)}
                        icon={
                          <Icons.Phone
                            size={26}
                            color={colors.neutral300}
                            weight="fill"
                          />
                        }
                      />
                      <Input
                        placeholder="Profile URL"
                        onChangeText={(val) => (profileUrlRef.current = val)}
                        icon={
                          <Icons.Link
                            size={26}
                            color={colors.neutral300}
                            weight="fill"
                          />
                        }
                      />
                    </>
                  )}

                  {role === "freelancer" && (
                    <>
                      <Input
                        placeholder="Skills (e.g., React, Java)"
                        onChangeText={(val) => (skillsRef.current = val)}
                        icon={
                          <Icons.Code
                            size={26}
                            color={colors.neutral300}
                            weight="fill"
                          />
                        }
                      />
                      <Input
                        placeholder="Experience (e.g., 2 years)"
                        onChangeText={(val) => (experienceRef.current = val)}
                        icon={
                          <Icons.Briefcase
                            size={26}
                            color={colors.neutral300}
                            weight="fill"
                          />
                        }
                      />
                      <Input
                        placeholder="Hourly Rate"
                        onChangeText={(val) => (rateRef.current = val)}
                        icon={
                          <Icons.CurrencyDollar
                            size={26}
                            color={colors.neutral300}
                            weight="fill"
                          />
                        }
                      />
                      <Input
                        placeholder="Profile URL"
                        onChangeText={(val) => (profileUrlRef.current = val)}
                        icon={
                          <Icons.Link
                            size={26}
                            color={colors.neutral300}
                            weight="fill"
                          />
                        }
                      />
                    </>
                  )}
                </>
              )}

              {role && (
                <Button loading={isLoading} onPress={handleSubmit}>
                  <Typo fontWeight="700" color={colors.black} size={21}>
                    Register as{" "}
                    {role === "freelancer" ? "Freelancer" : "Client"}
                  </Typo>
                </Button>
              )}
            </View>
          </View>

          <View style={styles.footer}>
            <Typo size={15}>Already have an account?</Typo>
            <Pressable onPress={() => router.navigate("/(auth)/login")}>
              <Typo size={15} fontWeight="700" color={colors.primary}>
                Log in
              </Typo>
            </Pressable>
          </View>
        </View>
      </ScreenWrapper>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacingY._30,
    paddingHorizontal: spacingX._20,
  },
  form: {
    gap: spacingY._20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  roleContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: spacingX._10,
    marginVertical: spacingY._10,
  },
  roleCard: {
    flex: 1,
    paddingVertical: spacingY._15,
    borderWidth: 1,
    borderColor: colors.neutral200,
    backgroundColor: colors.neutral100,
    borderRadius: verticalScale(10),
    alignItems: "center",
  },
});
