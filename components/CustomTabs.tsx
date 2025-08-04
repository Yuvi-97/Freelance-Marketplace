import { StyleSheet, TouchableOpacity, View } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { colors, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import * as Icons from "phosphor-react-native";

export function CustomTabs({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const tabBarIcons: any = {
    index: (isFocused: boolean) => {
      return (
        <Icons.House
          size={verticalScale(30)}
          weight={isFocused ? "fill" : "regular"}
          color={isFocused ? colors.primary : colors.neutral400}
        />
      );
    },
    statistics: (isFocused: boolean) => {
      return (
        <Icons.ChartBar
          size={verticalScale(30)}
          weight={isFocused ? "fill" : "regular"}
          color={isFocused ? colors.primary : colors.neutral400}
        />
      );
    },
    wallet: (isFocused: boolean) => {
      return (
        <Icons.Wallet
          size={verticalScale(30)}
          weight={isFocused ? "fill" : "regular"}
          color={isFocused ? colors.primary : colors.neutral400}
        />
      );
    },
    profile: (isFocused: boolean) => {
      return (
        <Icons.User
          size={verticalScale(30)}
          weight={isFocused ? "fill" : "regular"}
          color={isFocused ? colors.primary : colors.neutral400}
        />
      );
    },
  };
  return (
    <View style={styles.tabbar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabbarItems}
          >
            {tabBarIcons[route.name] && tabBarIcons[route.name](isFocused)}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
const styles = StyleSheet.create({
  tabbar: {
    flexDirection: "row",
    width: "100%",
    height: verticalScale(73),
    backgroundColor: colors.neutral800,
    justifyContent: "space-around",
    alignItems: "center",
    borderTopColor: colors.neutral700,
    paddingBottom: spacingY._10,
    borderTopWidth: 1,
  },
  tabbarItems: {
    marginBottom: spacingY._10,
    justifyContent: "center",
    alignItems: "center",
  },
});
