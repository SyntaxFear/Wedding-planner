import { View, Text, Pressable } from "react-native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { Guest, Table } from "../../../utils/storage";

interface GuestCardProps {
  guest: Guest;
  table?: Table;
  onPress: () => void;
  onDelete: () => void;
}

export const GuestCard = ({ guest, table, onPress, onDelete }: GuestCardProps) => {
  const { t } = useTranslation();

  const getStatusColor = (status: Guest["status"]) => {
    switch (status) {
      case "confirmed":
        return "text-green-600";
      case "declined":
        return "text-red-600";
      case "maybe":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  const getAgeRangeIcon = (ageRange: Guest["ageRange"]) => {
    switch (ageRange) {
      case "adult":
        return "person";
      case "child":
        return "person-outline";
      case "infant":
        return "person-outline";
      default:
        return "person";
    }
  };

  return (
    <Pressable
      onPress={onPress}
      className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden"
    >
      <View className="p-4">
        <View className="flex-row justify-between items-start mb-2">
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-900">
              {guest.firstName} {guest.lastName}
            </Text>
            <Text className={`${getStatusColor(guest.status)} text-sm`}>
              {t(`screens.guests.status.${guest.status}`)}
            </Text>
          </View>
          <Pressable
            onPress={onDelete}
            className="p-2 rounded-full bg-gray-50"
            hitSlop={8}
          >
            <Ionicons name="trash-outline" size={20} color="#666" />
          </Pressable>
        </View>

        <View className="flex-row flex-wrap">
          <View className="flex-row items-center mr-4 mb-2">
            <Ionicons
              name={getAgeRangeIcon(guest.ageRange)}
              size={16}
              color="#666"
              style={{ marginRight: 4 }}
            />
            <Text className="text-gray-600">
              {t(`screens.guests.ageRange.${guest.ageRange}`)}
            </Text>
          </View>

          {guest.email && (
            <View className="flex-row items-center mr-4 mb-2">
              <Ionicons
                name="mail-outline"
                size={16}
                color="#666"
                style={{ marginRight: 4 }}
              />
              <Text className="text-gray-600">{guest.email}</Text>
            </View>
          )}

          {guest.phone && (
            <View className="flex-row items-center mr-4 mb-2">
              <Ionicons
                name="call-outline"
                size={16}
                color="#666"
                style={{ marginRight: 4 }}
              />
              <Text className="text-gray-600">{guest.phone}</Text>
            </View>
          )}

          {table && (
            <View className="flex-row items-center mr-4 mb-2">
              <Ionicons
                name="grid-outline"
                size={16}
                color="#666"
                style={{ marginRight: 4 }}
              />
              <Text className="text-gray-600">{table.name}</Text>
            </View>
          )}

          {guest.plusOne && (
            <View className="flex-row items-center mr-4 mb-2">
              <Ionicons
                name="people-outline"
                size={16}
                color="#666"
                style={{ marginRight: 4 }}
              />
              <Text className="text-gray-600">
                {guest.plusOneName || t("screens.guests.plusOne")}
              </Text>
            </View>
          )}
        </View>

        {guest.dietaryRestrictions && guest.dietaryRestrictions.length > 0 && (
          <View className="mt-2">
            <Text className="text-sm text-gray-500 mb-1">
              {t("screens.guests.dietaryRestrictions")}:
            </Text>
            <View className="flex-row flex-wrap">
              {guest.dietaryRestrictions.map((restriction) => (
                <View
                  key={restriction}
                  className="bg-gray-100 rounded-full px-3 py-1 mr-2 mb-1"
                >
                  <Text className="text-sm text-gray-600">
                    {t(`screens.guests.dietary.${restriction}`)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {guest.additionalNotes && (
          <View className="mt-2 bg-gray-50 p-2 rounded">
            <Text className="text-sm text-gray-600">{guest.additionalNotes}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};
