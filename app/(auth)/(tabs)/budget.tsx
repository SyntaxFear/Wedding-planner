import { View, Text, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";

export default function BudgetScreen() {
  const { t } = useTranslation();

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold text-gray-900">
        {t("tabs.budget")}
      </Text>
    </View>
  );
}
