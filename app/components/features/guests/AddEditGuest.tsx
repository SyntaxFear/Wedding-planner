import { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  TextInput,
  Pressable,
  Switch,
} from "react-native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { Guest, Table, AgeRange, GuestStatus, DietaryRestriction } from "../../../utils/storage";

interface AddEditGuestProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (guest: Omit<Guest, "id">) => void;
  initialGuest?: Guest;
  tables: Table[];
}

export const AddEditGuest = ({
  isVisible,
  onClose,
  onSave,
  initialGuest,
  tables,
}: AddEditGuestProps) => {
  const { t } = useTranslation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [ageRange, setAgeRange] = useState<AgeRange>("adult");
  const [status, setStatus] = useState<GuestStatus>("invited");
  const [tableId, setTableId] = useState<string | undefined>(undefined);
  const [dietaryRestrictions, setDietaryRestrictions] = useState<DietaryRestriction[]>([]);
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [plusOne, setPlusOne] = useState(false);
  const [plusOneName, setPlusOneName] = useState("");

  useEffect(() => {
    if (initialGuest) {
      setFirstName(initialGuest.firstName);
      setLastName(initialGuest.lastName);
      setEmail(initialGuest.email || "");
      setPhone(initialGuest.phone || "");
      setAgeRange(initialGuest.ageRange);
      setStatus(initialGuest.status);
      setTableId(initialGuest.tableId);
      setDietaryRestrictions(initialGuest.dietaryRestrictions || []);
      setAdditionalNotes(initialGuest.additionalNotes || "");
      setPlusOne(initialGuest.plusOne || false);
      setPlusOneName(initialGuest.plusOneName || "");
    } else {
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setAgeRange("adult");
      setStatus("invited");
      setTableId(undefined);
      setDietaryRestrictions([]);
      setAdditionalNotes("");
      setPlusOne(false);
      setPlusOneName("");
    }
  }, [initialGuest]);

  const clearForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setAgeRange("adult");
    setStatus("invited");
    setTableId(undefined);
    setDietaryRestrictions([]);
    setAdditionalNotes("");
    setPlusOne(false);
    setPlusOneName("");
  };

  const handleSave = () => {
    if (!firstName.trim() || !lastName.trim()) {
      return;
    }

    onSave({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      ageRange,
      status,
      tableId,
      dietaryRestrictions,
      additionalNotes: additionalNotes.trim(),
      plusOne,
      plusOneName: plusOneName.trim(),
    });

    if (!initialGuest) {
      clearForm();
    }
  };

  const toggleDietaryRestriction = (restriction: DietaryRestriction) => {
    setDietaryRestrictions((prev) =>
      prev.includes(restriction)
        ? prev.filter((r) => r !== restriction)
        : [...prev, restriction]
    );
  };

  const ageRanges: AgeRange[] = ["adult", "child", "infant"];
  const statuses: GuestStatus[] = ["invited", "confirmed", "declined", "maybe"];
  const restrictions: DietaryRestriction[] = [
    "none",
    "vegetarian",
    "vegan",
    "gluten_free",
    "other",
  ];

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-gray-50">
        <View className="bg-white border-b border-gray-200 px-4 py-4">
          <View className="flex-row justify-between items-center">
            <Text className="text-xl font-semibold text-gray-900">
              {initialGuest
                ? t("screens.guests.edit.title")
                : t("screens.guests.add.title")}
            </Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={24} color="#666" />
            </Pressable>
          </View>
        </View>

        <ScrollView className="flex-1 p-4">
          <View className="bg-white rounded-lg p-4 mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              {t("screens.guests.form.basicInfo")}
            </Text>
            <TextInput
              className="bg-gray-50 p-3 rounded-lg mb-3 placeholder:text-gray-400"
              placeholder={t("screens.guests.form.firstNamePlaceholder")}
              value={firstName}
              onChangeText={setFirstName}
            />
            <TextInput
              className="bg-gray-50 p-3 rounded-lg mb-3 placeholder:text-gray-400"
              placeholder={t("screens.guests.form.lastNamePlaceholder")}
              value={lastName}
              onChangeText={setLastName}
            />
            <TextInput
              className="bg-gray-50 p-3 rounded-lg mb-3 placeholder:text-gray-400"
              placeholder={t("screens.guests.form.emailPlaceholder")}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              className="bg-gray-50 p-3 rounded-lg placeholder:text-gray-400"
              placeholder={t("screens.guests.form.phonePlaceholder")}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          <View className="bg-white rounded-lg p-4 mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              {t("screens.guests.form.ageRange")}
            </Text>
            <View className="flex-row flex-wrap">
              {ageRanges.map((range) => (
                <Pressable
                  key={range}
                  onPress={() => setAgeRange(range)}
                  className={`mr-2 mb-2 px-4 py-2 rounded-full ${
                    ageRange === range
                      ? "bg-pink-500"
                      : "bg-gray-100"
                  }`}
                >
                  <Text
                    className={`${
                      ageRange === range
                        ? "text-white"
                        : "text-gray-600"
                    }`}
                  >
                    {t(`screens.guests.ageRange.${range}`)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View className="bg-white rounded-lg p-4 mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              {t("screens.guests.form.status")}
            </Text>
            <View className="flex-row flex-wrap">
              {statuses.map((s) => (
                <Pressable
                  key={s}
                  onPress={() => setStatus(s)}
                  className={`mr-2 mb-2 px-4 py-2 rounded-full ${
                    status === s ? "bg-pink-500" : "bg-gray-100"
                  }`}
                >
                  <Text
                    className={`${
                      status === s ? "text-white" : "text-gray-600"
                    }`}
                  >
                    {t(`screens.guests.status.${s}`)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {tables.length > 0 && (
            <View className="bg-white rounded-lg p-4 mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                {t("screens.guests.form.table")}
              </Text>
              <View className="flex-row flex-wrap">
                {tables.map((table) => (
                  <Pressable
                    key={table.id}
                    onPress={() => setTableId(tableId === table.id ? undefined : table.id)}
                    className={`mr-2 mb-2 px-4 py-2 rounded-full ${
                      tableId === table.id
                        ? "bg-pink-500"
                        : "bg-gray-100"
                    }`}
                  >
                    <Text
                      className={`${
                        tableId === table.id
                          ? "text-white"
                          : "text-gray-600"
                      }`}
                    >
                      {table.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          <View className="bg-white rounded-lg p-4 mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              {t("screens.guests.form.dietary")}
            </Text>
            <View className="flex-row flex-wrap">
              {restrictions.map((restriction) => (
                <Pressable
                  key={restriction}
                  onPress={() => toggleDietaryRestriction(restriction)}
                  className={`mr-2 mb-2 px-4 py-2 rounded-full ${
                    dietaryRestrictions.includes(restriction)
                      ? "bg-pink-500"
                      : "bg-gray-100"
                  }`}
                >
                  <Text
                    className={`${
                      dietaryRestrictions.includes(restriction)
                        ? "text-white"
                        : "text-gray-600"
                    }`}
                  >
                    {t(`screens.guests.dietary.${restriction}`)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View className="bg-white rounded-lg p-4 mb-4">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-sm font-medium text-gray-700">
                {t("screens.guests.form.plusOne")}
              </Text>
              <Switch value={plusOne} onValueChange={setPlusOne} />
            </View>
            {plusOne && (
              <TextInput
                className="bg-gray-50 p-3 rounded-lg placeholder:text-gray-400"
                placeholder={t("screens.guests.form.plusOneName")}
                value={plusOneName}
                onChangeText={setPlusOneName}
              />
            )}
          </View>

          <View className="bg-white rounded-lg p-4 mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              {t("screens.guests.form.notes")}
            </Text>
            <TextInput
              className="bg-gray-50 p-3 rounded-lg placeholder:text-gray-400"
              placeholder={t("screens.guests.form.notesPlaceholder")}
              value={additionalNotes}
              onChangeText={setAdditionalNotes}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </ScrollView>

        <View className="bg-white border-t border-gray-200 p-4">
          <Pressable
            onPress={handleSave}
            className="bg-pink-500 p-4 rounded-lg items-center"
          >
            <Text className="text-white font-semibold">
              {t("common.save")}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};
