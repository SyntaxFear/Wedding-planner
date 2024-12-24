import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { useTranslation } from "react-i18next";
import { useEffect, useState, useMemo } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as storage from "../../utils/storage";
import {
  TimelineOverview,
  TaskCard,
  TaskFilters,
  AddEditTask,
} from "../../components/features/timeline";

export default function Timeline() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [timelineDetails, setTimelineDetails] =
    useState<storage.TimelineDetails | null>(null);
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [selectedTask, setSelectedTask] = useState<
    storage.TimelineTask | undefined
  >();
  const [showFilters, setShowFilters] = useState(false);
  const [daysUntilWedding, setDaysUntilWedding] = useState<number>(0);

  const [selectedCategories, setSelectedCategories] = useState<
    storage.TaskCategory[]
  >([]);
  const [selectedPriorities, setSelectedPriorities] = useState<
    storage.TaskPriority[]
  >([]);
  const [selectedStatuses, setSelectedStatuses] = useState<
    storage.TaskStatus[]
  >([]);
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    loadTimelineDetails();
    loadWeddingDate();
  }, []);

  const loadWeddingDate = async () => {
    try {
      const days = await storage.getDaysUntilWedding();
      setDaysUntilWedding(days);
    } catch (error) {
      console.error("Error loading wedding date:", error);
    }
  };

  const loadTimelineDetails = async () => {
    try {
      await storage.initializeTimeline();
      const details = await storage.getTimelineDetails();
      setTimelineDetails(details);
    } catch (error) {
      console.error("Error loading timeline details:", error);
      Alert.alert(
        t("screens.timeline.errors.loadFailed"),
        t("screens.timeline.errors.loadFailedMessage")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTask = async (task: Omit<storage.TimelineTask, "id">) => {
    try {
      if (selectedTask) {
        await storage.updateTimelineTask(selectedTask.id, task);
      } else {
        await storage.addTimelineTask(task);
      }
      loadTimelineDetails();
      setShowAddEdit(false);
      setSelectedTask(undefined);
    } catch (error) {
      console.error("Error saving task:", error);
      Alert.alert(
        t("screens.timeline.errors.saveFailed"),
        t("screens.timeline.errors.saveFailedMessage")
      );
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await storage.deleteTimelineTask(taskId);
      loadTimelineDetails();
    } catch (error) {
      console.error("Error deleting task:", error);
      Alert.alert(
        t("screens.timeline.errors.deleteFailed"),
        t("screens.timeline.errors.deleteFailedMessage")
      );
    }
  };

  const handleStatusChange = async (
    taskId: string,
    status: storage.TaskStatus
  ) => {
    try {
      await storage.updateTaskStatus(taskId, status);
      loadTimelineDetails();
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const filteredTasks = useMemo(() => {
    if (!timelineDetails?.tasks) return [];

    return timelineDetails.tasks.filter((task) => {
      if (!showCompleted && task.status === "completed") return false;
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(task.category)
      )
        return false;
      if (
        selectedPriorities.length > 0 &&
        !selectedPriorities.includes(task.priority)
      )
        return false;
      if (
        selectedStatuses.length > 0 &&
        !selectedStatuses.includes(task.status)
      )
        return false;
      return true;
    });
  }, [
    timelineDetails?.tasks,
    showCompleted,
    selectedCategories,
    selectedPriorities,
    selectedStatuses,
  ]);

  const groupedTasks = useMemo(() => {
    const grouped = {} as Record<storage.TaskCategory, storage.TimelineTask[]>;

    filteredTasks.forEach((task) => {
      if (!grouped[task.category]) {
        grouped[task.category] = [];
      }
      grouped[task.category].push(task);
    });

    return Object.entries(grouped)
      .sort(([catA, _a], [catB, _b]) => {
        const orderA =
          timelineDetails?.categories[catA as storage.TaskCategory]?.order || 0;
        const orderB =
          timelineDetails?.categories[catB as storage.TaskCategory]?.order || 0;
        return orderA - orderB;
      })
      .filter(
        ([cat]) =>
          timelineDetails?.categories[cat as storage.TaskCategory]?.isEnabled
      );
  }, [filteredTasks, timelineDetails?.categories]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>{t("common.loading")}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView>
        <TimelineOverview
          tasks={timelineDetails?.tasks || []}
          daysUntilWedding={daysUntilWedding}
        />

        <View className="p-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-semibold text-gray-900">
              {t("screens.timeline.title")}
            </Text>
            <View className="flex-row">
              <Pressable
                onPress={() => setShowFilters(prev => !prev)}
                className={`p-2 rounded-lg mr-2 ${showFilters ? 'bg-pink-100' : 'bg-gray-100'}`}
              >
                <Ionicons 
                  name="filter" 
                  size={24} 
                  color={showFilters ? "#FF4B8C" : "#666"} 
                />
              </Pressable>
              <Pressable
                onPress={() => {
                  setSelectedTask(undefined);
                  setShowAddEdit(true);
                }}
                className="bg-pink-500 px-4 py-2 rounded-lg"
              >
                <Text className="text-white font-semibold">
                  {t("screens.timeline.task.addNew")}
                </Text>
              </Pressable>
            </View>
          </View>

          {groupedTasks.map(([category, tasks]) => (
            <View key={category} className="mb-6">
              <Text className="text-lg font-semibold text-gray-900 mb-3">
                {t(`screens.timeline.categories.${category}`)}
              </Text>
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onPress={() => {
                    setSelectedTask(task);
                    setShowAddEdit(true);
                  }}
                  onStatusChange={(status) =>
                    handleStatusChange(task.id, status)
                  }
                  onDelete={() => {
                    Alert.alert(
                      t("screens.timeline.task.delete.title"),
                      t("screens.timeline.task.delete.message"),
                      [
                        {
                          text: t("screens.timeline.task.delete.cancel"),
                          style: "cancel",
                        },
                        {
                          text: t("screens.timeline.task.delete.confirm"),
                          onPress: () => handleDeleteTask(task.id),
                          style: "destructive",
                        },
                      ]
                    );
                  }}
                />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

      <TaskFilters
        isExpanded={showFilters}
        onToggleExpand={() => setShowFilters(prev => !prev)}
        selectedCategories={selectedCategories}
        selectedPriorities={selectedPriorities}
        selectedStatuses={selectedStatuses}
        showCompleted={showCompleted}
        onCategoryToggle={(category) => {
          setSelectedCategories((prev) =>
            prev.includes(category)
              ? prev.filter((c) => c !== category)
              : [...prev, category]
          );
        }}
        onPriorityToggle={(priority) => {
          setSelectedPriorities((prev) =>
            prev.includes(priority)
              ? prev.filter((p) => p !== priority)
              : [...prev, priority]
          );
        }}
        onStatusToggle={(status) => {
          setSelectedStatuses((prev) =>
            prev.includes(status)
              ? prev.filter((s) => s !== status)
              : [...prev, status]
          );
        }}
        onShowCompletedToggle={() => setShowCompleted((prev) => !prev)}
        onReset={() => {
          setSelectedCategories([]);
          setSelectedPriorities([]);
          setSelectedStatuses([]);
          setShowCompleted(false);
        }}
      />

      <AddEditTask
        isVisible={showAddEdit}
        onClose={() => {
          setShowAddEdit(false);
          setSelectedTask(undefined);
        }}
        onSave={handleSaveTask}
        initialTask={selectedTask}
        existingTasks={timelineDetails?.tasks}
      />
    </View>
  );
}
