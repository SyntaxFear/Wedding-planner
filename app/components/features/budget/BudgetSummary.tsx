import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
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
        <View>
          <Text className="text-gray-500 mb-1">
            {t("screens.budget.totalBudget")}
          </Text>
          {isEditing ? (
            <View className="flex-row items-center">
              <TextInput
                value={newBudget}
                onChangeText={setNewBudget}
                keyboardType="numeric"
                className="border border-gray-200 rounded-lg p-2 w-32 mr-2"
                placeholder="Enter amount"
                autoFocus
              />
              <Pressable 
                onPress={handleSave} 
                className="bg-pink-500 px-3 py-2 rounded-lg mr-2"
              >
                <Text className="text-white">
                  {t("screens.budget.items.form.save")}
                </Text>
              </Pressable>
              <Pressable onPress={() => setIsEditing(false)}>
                <Text className="text-gray-500">
                  {t("screens.budget.items.form.cancel")}
                </Text>
              </Pressable>
            </View>
          ) : (
            <Pressable onPress={() => setIsEditing(true)}>
              <Text className="text-2xl font-semibold text-gray-900">
                ${totalBudget.toLocaleString()}
              </Text>
            </Pressable>
          )}
        </View>
        <View>
          <Text className="text-gray-500 mb-1">
            {t("screens.budget.remaining")}
          </Text>
          <Text 
            className={`text-2xl font-semibold ${
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
