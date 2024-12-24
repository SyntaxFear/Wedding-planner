import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import * as storage from "../../utils/storage";
import { BudgetSummary, BudgetItemCard, AddEditBudgetItem } from "../../components/features/budget";

export default function Budget() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [budgetDetails, setBudgetDetails] = useState<storage.BudgetDetails | null>(null);
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [selectedItem, setSelectedItem] = useState<storage.BudgetItem | undefined>();

  useEffect(() => {
    loadBudgetDetails();
  }, []);

  const loadBudgetDetails = async () => {
    try {
      const details = await storage.getBudgetDetails();
      setBudgetDetails(details);
    } catch (error) {
      console.error("Error loading budget details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await storage.deleteBudgetItem(itemId);
      loadBudgetDetails();
    } catch (error) {
      console.error("Error deleting budget item:", error);
      Alert.alert(
        t("screens.budget.errors.deleteFailed"),
        t("screens.budget.errors.deleteFailedMessage")
      );
    }
  };

  const handleSaveItem = async (item: storage.BudgetItem) => {
    try {
      if (selectedItem) {
        await storage.updateBudgetItem(selectedItem.id, item);
      } else {
        await storage.addBudgetItem(item);
      }
      loadBudgetDetails();
    } catch (error) {
      console.error("Error saving budget item:", error);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>{t("common.loading")}</Text>
      </View>
    );
  }

  const totalBudget = budgetDetails?.totalBudget || 0;
  const totalSpent = budgetDetails?.items.reduce((sum: number, item: storage.BudgetItem) => 
    sum + (item.actualCost || item.estimatedCost), 0) || 0;
  const remainingBudget = totalBudget - totalSpent;

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView>
        <BudgetSummary
          totalBudget={totalBudget}
          totalSpent={totalSpent}
          remainingBudget={remainingBudget}
          onBudgetUpdate={loadBudgetDetails}
        />

        <View className="p-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-semibold text-gray-900">
              {t("screens.budget.items.title")}
            </Text>
            <Pressable
              onPress={() => {
                setSelectedItem(undefined);
                setShowAddEdit(true);
              }}
              className="bg-pink-500 px-4 py-2 rounded-lg"
            >
              <Text className="text-white font-semibold">
                {t("screens.budget.items.addItem")}
              </Text>
            </Pressable>
          </View>

          {budgetDetails?.items.map((item) => (
            <BudgetItemCard
              key={item.id}
              item={item}
              onPress={() => {
                setSelectedItem(item);
                setShowAddEdit(true);
              }}
              onDelete={() => {
                Alert.alert(
                  t("screens.budget.items.deleteItem.title"),
                  t("screens.budget.items.deleteItem.message"),
                  [
                    {
                      text: t("screens.budget.items.deleteItem.cancel"),
                      style: "cancel"
                    },
                    {
                      text: t("screens.budget.items.deleteItem.confirm"),
                      onPress: () => handleDeleteItem(item.id),
                      style: "destructive"
                    }
                  ]
                );
              }}
            />
          ))}
        </View>
      </ScrollView>

      <AddEditBudgetItem
        isVisible={showAddEdit}
        onClose={() => {
          setShowAddEdit(false);
          setSelectedItem(undefined);
        }}
        onSave={handleSaveItem}
        initialItem={selectedItem}
      />
    </View>
  );
}
