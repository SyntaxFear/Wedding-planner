import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BudgetItem } from "../../../utils/storage";

interface AddEditBudgetItemProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (item: BudgetItem) => void;
  initialItem?: BudgetItem;
}

export const AddEditBudgetItem = ({
  isVisible,
  onClose,
  onSave,
  initialItem,
}: AddEditBudgetItemProps) => {
  const { t } = useTranslation();
  const [name, setName] = useState(initialItem?.name || "");
  const [category, setCategory] = useState(initialItem?.category || "");
  const [estimatedCost, setEstimatedCost] = useState(
    initialItem?.estimatedCost?.toString() || ""
  );
  const [actualCost, setActualCost] = useState(
    initialItem?.actualCost?.toString() || ""
  );
  const [paid, setPaid] = useState(initialItem?.paid?.toString() || "");
  const [notes, setNotes] = useState(initialItem?.notes || "");

  if (!isVisible) return null;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="absolute inset-0"
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <Pressable className="flex-1 bg-black/50" onPress={onClose}>
        <View className="flex-1 justify-end">
          <Pressable
            className="bg-white rounded-t-2xl p-6 max-h-[90%]"
            onPress={(e) => e.stopPropagation()}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text className="text-xl font-semibold text-gray-900 mb-4">
                {initialItem
                  ? t("screens.budget.items.editItem")
                  : t("screens.budget.items.addItem")}
              </Text>

              <View className="mb-4">
                <Text className="text-gray-500 mb-1">
                  {t("screens.budget.items.form.name")}
                </Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  className="border border-gray-200 rounded-lg p-2"
                  placeholder={t("screens.budget.items.form.namePlaceholder")}
                />
              </View>

              <View className="mb-4">
                <Text className="text-gray-500 mb-1">
                  {t("screens.budget.items.form.category")}
                </Text>
                <TextInput
                  value={category}
                  onChangeText={setCategory}
                  className="border border-gray-200 rounded-lg p-2"
                  placeholder={t(
                    "screens.budget.items.form.categoryPlaceholder"
                  )}
                />
              </View>

              <View className="mb-4">
                <Text className="text-gray-500 mb-1">
                  {t("screens.budget.items.form.estimatedCost")}
                </Text>
                <TextInput
                  value={estimatedCost}
                  onChangeText={setEstimatedCost}
                  keyboardType="numeric"
                  className="border border-gray-200 rounded-lg p-2"
                  placeholder="0"
                />
              </View>

              <View className="mb-4">
                <Text className="text-gray-500 mb-1">
                  {t("screens.budget.items.form.actualCost")}
                </Text>
                <TextInput
                  value={actualCost}
                  onChangeText={setActualCost}
                  keyboardType="numeric"
                  className="border border-gray-200 rounded-lg p-2"
                  placeholder="0"
                />
              </View>

              <View className="mb-4">
                <Text className="text-gray-500 mb-1">
                  {t("screens.budget.items.form.amountPaid")}
                </Text>
                <TextInput
                  value={paid}
                  onChangeText={setPaid}
                  keyboardType="numeric"
                  className="border border-gray-200 rounded-lg p-2"
                  placeholder="0"
                />
              </View>

              <View className="mb-6">
                <Text className="text-gray-500 mb-1">
                  {t("screens.budget.items.form.notes")}
                </Text>
                <TextInput
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  numberOfLines={3}
                  className="border border-gray-200 rounded-lg p-2"
                  placeholder={t("screens.budget.items.form.notesPlaceholder")}
                />
              </View>

              <View className="flex-row justify-end">
                <View className="flex-row justify-end">
                  <Pressable
                    onPress={onClose}
                    className="px-4 py-2 rounded-lg mr-2"
                  >
                    <Text className="text-gray-500">
                      {t("screens.budget.items.form.cancel")}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      const item: BudgetItem = {
                        id: initialItem?.id || Date.now().toString(),
                        name,
                        category,
                        estimatedCost: Number(estimatedCost) || 0,
                        actualCost: actualCost ? Number(actualCost) : undefined,
                        paid: paid ? Number(paid) : undefined,
                        notes: notes || undefined,
                      };
                      onSave(item);
                      onClose();
                    }}
                    className="bg-pink-500 px-4 py-2 rounded-lg"
                  >
                    <Text className="text-white font-semibold">
                      {t("screens.budget.items.form.save")}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </ScrollView>
          </Pressable>
        </View>
      </Pressable>
    </KeyboardAvoidingView>
  );
};
