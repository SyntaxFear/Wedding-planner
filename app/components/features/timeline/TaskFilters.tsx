import { View, Text, Pressable, ScrollView, Animated } from "react-native";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { TaskCategory, TaskPriority, TaskStatus } from "../../../utils/storage";

interface TaskFiltersProps extends FilterProps {
  isExpanded: boolean;
  onToggleExpand: () => void;
}

interface FilterProps {
  selectedCategories: TaskCategory[];
  selectedPriorities: TaskPriority[];
  selectedStatuses: TaskStatus[];
  showCompleted: boolean;
  onCategoryToggle: (category: TaskCategory) => void;
  onPriorityToggle: (priority: TaskPriority) => void;
  onStatusToggle: (status: TaskStatus) => void;
  onShowCompletedToggle: () => void;
  onReset: () => void;
}

interface FilterChipProps {
  label: string;
  isSelected: boolean;
  onToggle: () => void;
  color?: string;
}

const FilterChip = ({ label, isSelected, onToggle, color = "#FF4B8C" }: FilterChipProps) => (
  <Pressable
    onPress={onToggle}
    className={`px-4 py-2 rounded-full mr-2 mb-2 border ${
      isSelected 
        ? 'bg-pink-500 border-pink-500' 
        : 'bg-white border-gray-200'
    }`}
  >
    <Text className={isSelected ? 'text-white' : 'text-gray-700'}>
      {label}
    </Text>
  </Pressable>
);

export const TaskFilters = ({ 
  isExpanded,
  onToggleExpand,
  selectedCategories,
  selectedPriorities,
  selectedStatuses,
  showCompleted,
  onCategoryToggle,
  onPriorityToggle,
  onStatusToggle,
  onShowCompletedToggle,
  onReset
}: TaskFiltersProps) => {
  const { t } = useTranslation();

  const categories: TaskCategory[] = [
    'ceremony',
    'reception',
    'attire',
    'beauty',
    'flowers',
    'photography',
    'music',
    'transportation',
    'honeymoon',
    'legal',
    'other'
  ];

  const priorities: TaskPriority[] = ['high', 'medium', 'low'];
  const statuses: TaskStatus[] = ['not_started', 'in_progress', 'overdue'];

  const animatedHeight = new Animated.Value(isExpanded ? 1 : 0);

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: isExpanded ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isExpanded]);

  const maxHeight = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 500],
  });

  return (
    <Animated.View 
      style={{ maxHeight }}
      className="bg-gray-100 border-b border-gray-200 overflow-hidden"
    >
      <Pressable
        onPress={onToggleExpand}
        className="flex-row justify-between items-center px-4 py-4"
      >
        <View className="flex-row items-center">
          <Text className="text-lg font-semibold text-gray-900 mr-2">
            {t("screens.timeline.filters.title")}
          </Text>
          <View className="bg-pink-500 rounded-full px-2 py-0.5">
            <Text className="text-white text-sm">
              {selectedCategories.length + selectedPriorities.length + selectedStatuses.length + (showCompleted ? 1 : 0)}
            </Text>
          </View>
        </View>
        <Ionicons 
          name={!isExpanded ? "chevron-up" : "chevron-down"} 
          size={24} 
          color="#666" 
        />
      </Pressable>

      <View className="px-4 pb-6">
        <View className="flex-row justify-end mb-4">
          <Pressable
            onPress={onReset}
            className="flex-row items-center"
          >
            <Ionicons name="refresh" size={18} color="#666" />
            <Text className="text-gray-600 ml-1">
              {t("screens.timeline.filters.reset")}
            </Text>
          </Pressable>
        </View>

        <Pressable
          onPress={onShowCompletedToggle}
          className="flex-row items-center mb-4"
        >
          <View className={`w-5 h-5 rounded border mr-2 items-center justify-center ${
            showCompleted ? 'bg-pink-500 border-pink-500' : 'border-gray-300'
          }`}>
            {showCompleted && (
              <Ionicons name="checkmark" size={16} color="white" />
            )}
          </View>
          <Text className="text-gray-700">
            {t("screens.timeline.filters.showCompleted")}
          </Text>
        </Pressable>

        <Text className="text-gray-600 mb-2">
          {t("screens.timeline.filters.categories")}
        </Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="mb-4"
        >
          {categories.map((category) => (
            <FilterChip
              key={category}
              label={t(`screens.timeline.categories.${category}`)}
              isSelected={selectedCategories.includes(category)}
              onToggle={() => onCategoryToggle(category)}
            />
          ))}
        </ScrollView>

        <Text className="text-gray-600 mb-2">
          {t("screens.timeline.filters.priority")}
        </Text>
        <View className="flex-row flex-wrap mb-4">
          {priorities.map((priority) => (
            <FilterChip
              key={priority}
              label={t(`screens.timeline.priority.${priority}`)}
              isSelected={selectedPriorities.includes(priority)}
              onToggle={() => onPriorityToggle(priority)}
            />
          ))}
        </View>

        <Text className="text-gray-600 mb-2">
          {t("screens.timeline.filters.status")}
        </Text>
        <View className="flex-row flex-wrap">
          {statuses.map((status) => (
            <FilterChip
              key={status}
              label={t(`screens.timeline.status.${status}`)}
              isSelected={selectedStatuses.includes(status)}
              onToggle={() => onStatusToggle(status)}
            />
          ))}
        </View>
      </View>
    </Animated.View>
  );
};
