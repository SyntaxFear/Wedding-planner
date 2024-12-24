import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { BudgetItem } from "../../../utils/storage";

interface BudgetItemCardProps {
  item: BudgetItem;
  onPress: () => void;
  onDelete: () => void;
}

export const BudgetItemCard = ({ item, onPress, onDelete }: BudgetItemCardProps) => {
  const { t } = useTranslation();

  return (
    <Pressable 
      onPress={onPress}
      className="bg-white p-4 rounded-2xl border border-gray-100 mb-4"
    >
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center">
          <View className="bg-pink-50 p-2 rounded-lg mr-3">
            <Ionicons name="wallet-outline" size={20} color="#FF4B8C" />
          </View>
          <View>
            <Text className="text-gray-900 font-semibold">{item.name}</Text>
            <Text className="text-gray-500 text-sm">{item.category}</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#666" />
      </View>
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-gray-500 text-sm">
            {t("screens.budget.items.form.estimatedCost")}
          </Text>
          <Text className="text-gray-900">
            ${item.estimatedCost.toLocaleString()}
          </Text>
        </View>
        {item.actualCost && (
          <View>
            <Text className="text-gray-500 text-sm">
              {t("screens.budget.items.form.actualCost")}
            </Text>
            <Text className="text-gray-900">
              ${item.actualCost.toLocaleString()}
            </Text>
          </View>
        )}
        <View className="flex-1">
          <Text className="text-gray-500 text-sm">
            {t("screens.budget.items.form.amountPaid")}
          </Text>
          <Text className="text-gray-900">
            ${(item.paid || 0).toLocaleString()}
          </Text>
        </View>
        <Pressable 
          onPress={onDelete}
          className="bg-red-50 p-2 rounded-lg ml-2"
        >
          <Ionicons name="trash-outline" size={20} color="#EF4444" />
        </Pressable>
      </View>
    </Pressable>
  );
};
