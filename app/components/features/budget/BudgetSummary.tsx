import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import * as storage from "../../../utils/storage";

interface BudgetSummaryProps {
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
  onBudgetUpdate: () => void;
}

export const BudgetSummary = ({ 
  totalBudget, 
  totalSpent, 
  remainingBudget,
  onBudgetUpdate 
}: BudgetSummaryProps) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(totalBudget.toString());

  const handleSave = async () => {
    try {
      const amount = Number(newBudget);
      if (isNaN(amount) || amount < 0) {
        Alert.alert(
          t("screens.budget.errors.invalidAmount"),
          t("screens.budget.errors.invalidAmountMessage")
        );
        return;
      }
      await storage.setTotalBudget(amount);
      setIsEditing(false);
      onBudgetUpdate();
    } catch (error) {
      console.error("Error saving total budget:", error);
      Alert.alert(
        t("screens.budget.errors.saveFailed"),
        t("screens.budget.errors.saveFailedMessage")
      );
    }
  };

  return (
    <View className="bg-white px-6 py-8 border-b border-gray-100">
      <Text className="text-3xl font-bold text-gray-900 mb-6">
        {t("screens.budget.title")}
      </Text>
      <View className="flex-row justify-between mb-4">
        <View className="flex-1 mr-4 justify-center">
          <Text className="text-gray-500 mb-1">
            {t("screens.budget.totalBudget")}
          </Text>
          {isEditing ? (
            <View className="max-w-[150px]">
              <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-lg p-2 mb-2">
                <Text className="text-gray-500 mr-2">$</Text>
                <TextInput
                  value={newBudget}
                  onChangeText={setNewBudget}
                  keyboardType="numeric"
                  className="flex-1 text-xl font-semibold text-gray-900"
                  placeholder="Enter amount"
                  autoFocus
                />
              </View>
              <View className="flex-row">
                <Pressable 
                  onPress={handleSave} 
                  className="flex-1 bg-pink-500 py-2 rounded-lg mr-2"
                >
                  <Text className="text-white font-semibold text-center">
                    {t("screens.budget.items.form.save")}
                  </Text>
                </Pressable>
                <Pressable 
                  onPress={() => setIsEditing(false)}
                  className="flex-1 bg-gray-100 py-2 rounded-lg"
                >
                  <Text className="text-gray-500 text-center">
                    {t("screens.budget.items.form.cancel")}
                  </Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <Pressable 
              onPress={() => setIsEditing(true)}
              className="flex-row items-center bg-pink-50 px-4 py-2 rounded-lg max-w-[150px]"
            >
              <Text className="text-2xl font-semibold text-gray-900 mr-2">
                ${totalBudget.toLocaleString()}
              </Text>
              <Ionicons name="pencil" size={20} color="#FF4B8C" />
            </Pressable>
          )}
        </View>
        <View>
          <Text className="text-gray-500 mb-1">
            {t("screens.budget.remaining")}
          </Text>
          <Text 
            className={`text-2xl font-semibold mt-2 ${
              remainingBudget >= 0 ? 'text-green-500' : 'text-red-500'
            }`}
          >
            ${remainingBudget.toLocaleString()}
          </Text>
        </View>
      </View>
      <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <View
          className="h-full bg-pink-500 rounded-full"
          style={{ 
            width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%` 
          }}
        />
      </View>
      <Text className="text-gray-500 text-sm mt-2">
        {t("screens.budget.budgetUsed", {
          percent: ((totalSpent / totalBudget) * 100).toFixed(1)
        })}
      </Text>
    </View>
  );
};
