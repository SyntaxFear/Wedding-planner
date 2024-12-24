import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { TimelineTask } from "../../../utils/storage";

interface TimelineOverviewProps {
  tasks: TimelineTask[];
  daysUntilWedding: number;
}

export const TimelineOverview = ({ tasks, daysUntilWedding }: TimelineOverviewProps) => {
  const { t } = useTranslation();
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  const overdueTasks = tasks.filter(task => {
    if (task.status === 'completed') return false;
    const dueDate = new Date(task.dueDate);
    return dueDate < new Date();
  }).length;

  return (
    <View className="bg-white px-6 py-8 border-b border-gray-100">
      <Text className="text-3xl font-bold text-gray-900 mb-6">
        {t("screens.timeline.overview.title")}
      </Text>

      <View className="flex-row items-center mb-4">
        <View className="bg-pink-50 p-2 rounded-lg mr-3">
          <Ionicons name="calendar" size={24} color="#FF4B8C" />
        </View>
        <Text className="text-gray-600 text-base">
          {t("screens.timeline.overview.daysLeft", { days: daysUntilWedding })}
        </Text>
      </View>

      <View className="mb-4">
        <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <View
            className="h-full bg-pink-500 rounded-full"
            style={{ width: `${completionPercentage}%` }}
          />
        </View>
        <Text className="text-gray-500 text-sm mt-2">
          {t("screens.timeline.overview.tasksCompleted", {
            completed: completedTasks,
            total: totalTasks
          })}
        </Text>
      </View>

      <View className="flex-row justify-between">
        <View className="flex-1 bg-green-50 p-4 rounded-xl mr-2">
          <Text className="text-green-600 text-lg font-semibold">
            {completedTasks}
          </Text>
          <Text className="text-green-600">
            {t("screens.timeline.status.completed")}
          </Text>
        </View>
        {overdueTasks > 0 && (
          <View className="flex-1 bg-red-50 p-4 rounded-xl ml-2">
            <Text className="text-red-600 text-lg font-semibold">
              {overdueTasks}
            </Text>
            <Text className="text-red-600">
              {t("screens.timeline.status.overdue")}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};
