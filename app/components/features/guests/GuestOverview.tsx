import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

interface GuestStats {
  total: number;
  confirmed: number;
  declined: number;
  pending: number;
  adults: number;
  children: number;
  infants: number;
}

interface GuestOverviewProps {
  stats: GuestStats;
}

export const GuestOverview = ({ stats }: GuestOverviewProps) => {
  const { t } = useTranslation();

  return (
    <View className="bg-white px-6 py-8 border-b border-gray-100">
      <Text className="text-3xl font-bold text-gray-900 mb-6">
        {t("screens.guests.overview.title")}
      </Text>

      <View className="flex-row items-center mb-6">
        <View className="bg-pink-50 p-2 rounded-lg mr-3">
          <Ionicons name="people" size={24} color="#FF4B8C" />
        </View>
        <Text className="text-gray-600 text-base">
          {t("screens.guests.overview.totalGuests", { count: stats.total })}
        </Text>
      </View>

      <View className="flex-row justify-between mb-6">
        <View className="flex-1 bg-green-50 p-4 rounded-xl mr-2">
          <Text className="text-green-600 text-lg font-semibold">
            {stats.confirmed}
          </Text>
          <Text className="text-green-600">
            {t("screens.guests.status.confirmed")}
          </Text>
        </View>
        <View className="flex-1 bg-red-50 p-4 rounded-xl mx-2">
          <Text className="text-red-600 text-lg font-semibold">
            {stats.declined}
          </Text>
          <Text className="text-red-600">
            {t("screens.guests.status.declined")}
          </Text>
        </View>
        <View className="flex-1 bg-yellow-50 p-4 rounded-xl ml-2">
          <Text className="text-yellow-600 text-lg font-semibold">
            {stats.pending}
          </Text>
          <Text className="text-yellow-600">
            {t("screens.guests.status.pending")}
          </Text>
        </View>
      </View>

      <View className="flex-row justify-between">
        <View className="flex-1 bg-blue-50 p-4 rounded-xl mr-2">
          <Text className="text-blue-600 text-lg font-semibold">
            {stats.adults}
          </Text>
          <Text className="text-blue-600">
            {t("screens.guests.ageRange.adults")}
          </Text>
        </View>
        <View className="flex-1 bg-purple-50 p-4 rounded-xl mx-2">
          <Text className="text-purple-600 text-lg font-semibold">
            {stats.children}
          </Text>
          <Text className="text-purple-600">
            {t("screens.guests.ageRange.children")}
          </Text>
        </View>
        <View className="flex-1 bg-indigo-50 p-4 rounded-xl ml-2">
          <Text className="text-indigo-600 text-lg font-semibold">
            {stats.infants}
          </Text>
          <Text className="text-indigo-600">
            {t("screens.guests.ageRange.infants")}
          </Text>
        </View>
      </View>
    </View>
  );
};
