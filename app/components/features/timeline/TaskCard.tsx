import { View, Text, Pressable } from "react-native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { TimelineTask, TaskPriority, TaskStatus } from "../../../utils/storage";

interface TaskCardProps {
  task: TimelineTask;
  onPress: () => void;
  onStatusChange: (status: TaskStatus) => void;
  onDelete: () => void;
}

const getPriorityColor = (priority: TaskPriority) => {
  switch (priority) {
    case 'high':
      return 'text-red-600';
    case 'medium':
      return 'text-orange-600';
    case 'low':
      return 'text-blue-600';
  }
};

const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case 'completed':
      return 'bg-green-500';
    case 'in_progress':
      return 'bg-blue-500';
    case 'overdue':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

const getStatusIcon = (status: TaskStatus) => {
  switch (status) {
    case 'completed':
      return 'checkmark-circle';
    case 'in_progress':
      return 'time';
    case 'overdue':
      return 'alert-circle';
    default:
      return 'ellipse-outline';
  }
};

export const TaskCard = ({ task, onPress, onStatusChange, onDelete }: TaskCardProps) => {
  const { t } = useTranslation();
  const dueDate = new Date(task.dueDate);
  const isOverdue = task.status !== 'completed' && dueDate < new Date();

  const handleStatusToggle = () => {
    if (task.status === 'completed') {
      onStatusChange('not_started');
    } else {
      onStatusChange('completed');
    }
  };

  return (
    <Pressable 
      onPress={onPress}
      className="bg-white p-4 rounded-2xl border border-gray-100 mb-4"
    >
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center flex-1">
          <Pressable
            onPress={handleStatusToggle}
            className="mr-3"
          >
            <Ionicons 
              name={getStatusIcon(isOverdue ? 'overdue' : task.status)}
              size={24}
              color={isOverdue ? '#EF4444' : '#10B981'}
            />
          </Pressable>
          <View className="flex-1">
            <Text className="text-gray-900 font-semibold">{task.title}</Text>
            <Text className="text-gray-500 text-sm">
              {t(`screens.timeline.categories.${task.category}`)}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center">
          <Pressable 
            onPress={onDelete}
            className="bg-red-50 p-2 rounded-lg mr-2"
          >
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
          </Pressable>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </View>
      </View>

      {task.description && (
        <Text className="text-gray-600 mb-2" numberOfLines={2}>
          {task.description}
        </Text>
      )}

      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <View className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(isOverdue ? 'overdue' : task.status)}`} />
          <Text className="text-gray-600 text-sm">
            {t(`screens.timeline.status.${isOverdue ? 'overdue' : task.status}`)}
          </Text>
        </View>

        <View className="flex-row items-center">
          <Text className={`text-sm mr-4 ${getPriorityColor(task.priority)}`}>
            {t(`screens.timeline.priority.${task.priority}`)}
          </Text>
          <Text className="text-gray-500 text-sm">
            {dueDate.toLocaleDateString()}
          </Text>
        </View>
      </View>

      {task.dependsOn && task.dependsOn.length > 0 && (
        <View className="mt-2 pt-2 border-t border-gray-100">
          <Text className="text-gray-500 text-sm">
            {t("screens.timeline.task.form.dependencies")}: {task.dependsOn.length}
          </Text>
        </View>
      )}
    </Pressable>
  );
};
