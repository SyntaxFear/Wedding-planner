import { Text, View } from "react-native";

export default function DashboardScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-2xl font-bold text-gray-900">
        Wedding Dashboard
      </Text>
      <Text className="mt-3 text-gray-600">
        Overview of your wedding planning progress
      </Text>
    </View>
  );
}
