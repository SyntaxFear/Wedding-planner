import { View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from "@expo/vector-icons";
import { TimelineTask, TaskCategory, TaskPriority, TaskStatus } from "../../../utils/storage";

interface AddEditTaskProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (task: Omit<TimelineTask, 'id'>) => void;
  initialTask?: TimelineTask;
  existingTasks?: TimelineTask[];
}

export const AddEditTask = ({ 
  isVisible, 
  onClose, 
  onSave, 
  initialTask,
  existingTasks = []
}: AddEditTaskProps) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState(initialTask?.title || '');
  const [description, setDescription] = useState(initialTask?.description || '');
  const [category, setCategory] = useState<TaskCategory>(initialTask?.category || 'other');
  const [priority, setPriority] = useState<TaskPriority>(initialTask?.priority || 'medium');
  const [status, setStatus] = useState<TaskStatus>(initialTask?.status || 'not_started');
  const [dueDate, setDueDate] = useState(new Date(initialTask?.dueDate || Date.now()));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dependsOn, setDependsOn] = useState<string[]>(initialTask?.dependsOn || []);
  const [notes, setNotes] = useState(initialTask?.notes || '');

  const categories: TaskCategory[] = [
    'ceremony', 'reception', 'attire', 'beauty', 'flowers',
    'photography', 'music', 'transportation', 'honeymoon', 'legal', 'other'
  ];

  const priorities: TaskPriority[] = ['high', 'medium', 'low'];
  const statuses: TaskStatus[] = ['not_started', 'in_progress', 'completed'];

  if (!isVisible) return null;

  const handleSave = () => {
    const task: Omit<TimelineTask, 'id'> = {
      title,
      description,
      category,
      priority,
      status,
      dueDate: dueDate.toISOString(),
      dependsOn: dependsOn.length > 0 ? dependsOn : undefined,
      notes: notes || undefined
    };
    onSave(task);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="absolute inset-0"
    >
      <Pressable 
        className="flex-1 bg-black/50 justify-center"
        onPress={onClose}
      >
        <Pressable 
          className="bg-white mx-6 rounded-2xl"
          onPress={e => e.stopPropagation()}
        >
          <View className="p-6 border-b border-gray-100">
            <Text className="text-xl font-semibold text-gray-900">
              {initialTask 
                ? t("screens.timeline.task.edit")
                : t("screens.timeline.task.addNew")
              }
            </Text>
          </View>

          <ScrollView className="max-h-[500]">
            <View className="p-6">
              <View className="mb-4">
                <Text className="text-gray-500 mb-1">
                  {t("screens.timeline.task.form.title")}
                </Text>
                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  className="border border-gray-200 rounded-lg p-2"
                  placeholder={t("screens.timeline.task.form.titlePlaceholder")}
                />
              </View>

              <View className="mb-4">
                <Text className="text-gray-500 mb-1">
                  {t("screens.timeline.task.form.description")}
                </Text>
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={3}
                  className="border border-gray-200 rounded-lg p-2"
                  placeholder={t("screens.timeline.task.form.descriptionPlaceholder")}
                />
              </View>

              <View className="mb-4">
                <Text className="text-gray-500 mb-1">
                  {t("screens.timeline.task.form.category")}
                </Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                >
                  {categories.map((cat) => (
                    <Pressable
                      key={cat}
                      onPress={() => setCategory(cat)}
                      className={`px-4 py-2 rounded-full mr-2 border ${
                        category === cat
                          ? 'bg-pink-500 border-pink-500'
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <Text className={category === cat ? 'text-white' : 'text-gray-700'}>
                        {t(`screens.timeline.categories.${cat}`)}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>

              <View className="mb-4">
                <Text className="text-gray-500 mb-1">
                  {t("screens.timeline.task.form.priority")}
                </Text>
                <View className="flex-row">
                  {priorities.map((pri) => (
                    <Pressable
                      key={pri}
                      onPress={() => setPriority(pri)}
                      className={`px-4 py-2 rounded-full mr-2 border ${
                        priority === pri
                          ? 'bg-pink-500 border-pink-500'
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <Text className={priority === pri ? 'text-white' : 'text-gray-700'}>
                        {t(`screens.timeline.priority.${pri}`)}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View className="mb-4">
                <Text className="text-gray-500 mb-1">
                  {t("screens.timeline.task.form.dueDate")}
                </Text>
                <Pressable
                  onPress={() => setShowDatePicker(true)}
                  className="border border-gray-200 rounded-lg p-2"
                >
                  <Text>{dueDate.toLocaleDateString()}</Text>
                </Pressable>
                {showDatePicker && (
                  <DateTimePicker
                    value={dueDate}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) {
                        setDueDate(selectedDate);
                      }
                    }}
                    minimumDate={new Date()}
                  />
                )}
              </View>

              <View className="mb-4">
                <Text className="text-gray-500 mb-1">
                  {t("screens.timeline.task.form.status")}
                </Text>
                <View className="flex-row">
                  {statuses.map((stat) => (
                    <Pressable
                      key={stat}
                      onPress={() => setStatus(stat)}
                      className={`px-4 py-2 rounded-full mr-2 border ${
                        status === stat
                          ? 'bg-pink-500 border-pink-500'
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <Text className={status === stat ? 'text-white' : 'text-gray-700'}>
                        {t(`screens.timeline.status.${stat}`)}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View className="mb-4">
                <Text className="text-gray-500 mb-1">
                  {t("screens.timeline.task.form.notes")}
                </Text>
                <TextInput
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  numberOfLines={3}
                  className="border border-gray-200 rounded-lg p-2"
                  placeholder={t("screens.timeline.task.form.notesPlaceholder")}
                />
              </View>
            </View>
          </ScrollView>

          <View className="p-6 border-t border-gray-100 flex-row justify-end">
            <Pressable
              onPress={onClose}
              className="px-4 py-2 rounded-lg mr-2"
            >
              <Text className="text-gray-500">
                {t("screens.timeline.task.form.cancel")}
              </Text>
            </Pressable>
            <Pressable
              onPress={handleSave}
              className="bg-pink-500 px-4 py-2 rounded-lg"
            >
              <Text className="text-white font-semibold">
                {t("screens.timeline.task.form.save")}
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </KeyboardAvoidingView>
  );
};
