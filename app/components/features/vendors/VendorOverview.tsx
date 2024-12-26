import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { Vendor, VendorStatus } from "../../../utils/storage";

interface VendorStats {
  total: number;
  byStatus: Record<VendorStatus, number>;
  hired: number;
  totalBudget: number;
  spentBudget: number;
}

interface VendorOverviewProps {
  stats: VendorStats;
}

export const VendorOverview = ({ stats }: VendorOverviewProps) => {
  const { t } = useTranslation();

  return (
    <View className="bg-white px-6 py-8 border-b border-gray-100">
      <Text className="text-3xl font-bold text-gray-900 mb-6">
        {t("screens.vendors.overview.title")}
      </Text>

      <View className="flex-row items-center mb-6">
        <View className="bg-pink-50 p-2 rounded-lg mr-3">
          <Ionicons name="briefcase" size={24} color="#FF4B8C" />
        </View>
        <Text className="text-gray-600 text-base">
          {t("screens.vendors.overview.totalVendors", { count: stats.total })}
        </Text>
      </View>

      <View className="mb-6">
        <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <View
            className="h-full bg-pink-500 rounded-full"
            style={{ width: `${(stats.hired / stats.total) * 100}%` }}
          />
        </View>
        <Text className="text-gray-500 text-sm mt-2">
          {t("screens.vendors.overview.vendorsHired", {
            hired: stats.hired,
            total: stats.total,
          })}
        </Text>
      </View>

      <View className="flex-row justify-between mb-6">
        <View className="flex-1 bg-green-50 p-4 rounded-xl mr-2">
          <Text className="text-green-600 text-lg font-semibold">
            {stats.byStatus.hired}
          </Text>
          <Text className="text-green-600">
            {t("screens.vendors.status.hired")}
          </Text>
        </View>
        <View className="flex-1 bg-yellow-50 p-4 rounded-xl mx-2">
          <Text className="text-yellow-600 text-lg font-semibold">
            {stats.byStatus.proposal_received}
          </Text>
          <Text className="text-yellow-600">
            {t("screens.vendors.status.proposal_received")}
          </Text>
        </View>
        <View className="flex-1 bg-blue-50 p-4 rounded-xl ml-2">
          <Text className="text-blue-600 text-lg font-semibold">
            {stats.byStatus.researching}
          </Text>
          <Text className="text-blue-600">
            {t("screens.vendors.status.researching")}
          </Text>
        </View>
      </View>

      <View className="bg-gray-50 p-4 rounded-xl">
        <Text className="text-gray-600 mb-2">
          {t("screens.vendors.overview.budget")}
        </Text>
        <View className="flex-row justify-between">
          <Text className="text-gray-900 font-semibold">
            ${stats.spentBudget.toLocaleString()}
          </Text>
          <Text className="text-gray-500">
            ${stats.totalBudget.toLocaleString()}
          </Text>
        </View>
        <View className="h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
          <View
            className="h-full bg-pink-500 rounded-full"
            style={{
              width: `${(stats.spentBudget / stats.totalBudget) * 100}%`,
            }}
          />
        </View>
      </View>
    </View>
  );
};
