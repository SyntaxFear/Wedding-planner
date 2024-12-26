import { View, Text, ScrollView, Pressable } from "react-native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { Link, PathNames } from "expo-router";
import { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import DatePicker from "../../components/shared/DatePicker";
import * as storage from "../../utils/storage";

interface Task {
  id: number;
  title: string;
  date: string;
}

interface QuickActionCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  route: PathNames;
}

const QuickActionCard = ({
  icon,
  title,
  description,
  route,
}: QuickActionCardProps) => (
  <Link href={route as any} asChild>
    <Pressable className="bg-white p-4 rounded-2xl border border-gray-100">
      <View className="flex-row items-center">
        <View className="bg-pink-50 p-3 rounded-xl mr-4">
          <Ionicons name={icon} size={24} color="#FF4B8C" />
        </View>
        <View className="flex-1 mr-4">
          <Text className="text-gray-900 text-lg font-semibold mb-1">
            {title}
          </Text>
          <Text className="text-gray-500 text-sm">{description}</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#666" />
      </View>
    </Pressable>
  </Link>
);

interface ProgressSectionProps {
  title: string;
  progress: number;
  completeText: string;
}

const ProgressSection = ({ title, progress, completeText }: ProgressSectionProps) => (
  <View className="bg-white p-4 rounded-2xl border border-gray-100">
    <Text className="text-gray-900 font-semibold mb-2">{title}</Text>
    <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
      <View
        className="h-full bg-pink-500 rounded-full"
        style={{ width: `${Math.min(progress, 100)}%` }}
      />
    </View>
    <Text className="text-gray-500 text-sm mt-2">{completeText}</Text>
  </View>
);

export default function Home() {
  const { t } = useTranslation();
  const [hasDate, setHasDate] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [daysUntilWedding, setDaysUntilWedding] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [timelineDetails, setTimelineDetails] = useState<storage.TimelineDetails | null>(null);
  const [budgetDetails, setBudgetDetails] = useState<storage.BudgetDetails | null>(null);
  const [guestDetails, setGuestDetails] = useState<storage.GuestDetails | null>(null);
  const [vendorDetails, setVendorDetails] = useState<storage.VendorDetails | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadAllDetails();
      checkWeddingDate();
    }, [])
  );

  const checkWeddingDate = async () => {
    try {
      const details = await storage.getWeddingDetails();
      if (details) {
        setHasDate(true);
        setSelectedDate(new Date(details.weddingDate));
        const days = await storage.getDaysUntilWedding();
        setDaysUntilWedding(days);
      }
    } catch (error) {
      console.error("Error checking wedding date:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateSave = async () => {
    try {
      await storage.setWeddingDate(selectedDate);
      setHasDate(true);
      checkWeddingDate();
    } catch (error) {
      console.error("Error saving wedding date:", error);
    }
  };

  const loadAllDetails = async () => {
    try {
      const timeline = await storage.getTimelineDetails();
      const budget = await storage.getBudgetDetails();
      const guests = await storage.getGuestDetails();
      const vendors = await storage.getVendorDetails();

      setTimelineDetails(timeline);
      setBudgetDetails(budget);
      setGuestDetails(guests);
      setVendorDetails(vendors);
    } catch (error) {
      console.error("Error loading details:", error);
    }
  };

  const calculateProgress = () => {
    let totalProgress = 0;
    let sections = 0;


    if (timelineDetails?.tasks.length) {
      const completed = timelineDetails.tasks.filter(t => t.status === 'completed').length;
      totalProgress += (completed / timelineDetails.tasks.length) * 100;
      sections++;
    }


    if (budgetDetails?.items.length) {
      const withActualCost = budgetDetails.items.filter(i => i.actualCost !== undefined).length;
      totalProgress += (withActualCost / budgetDetails.items.length) * 100;
      sections++;
    }


    if (guestDetails?.guests.length) {
      const responded = guestDetails.guests.filter(g => g.status !== 'invited').length;
      totalProgress += (responded / guestDetails.guests.length) * 100;
      sections++;
    }


    if (vendorDetails?.vendors.length) {
      const hired = vendorDetails.vendors.filter(v => v.status === 'hired').length;
      totalProgress += (hired / vendorDetails.vendors.length) * 100;
      sections++;
    }

    return sections ? Math.round(totalProgress / sections) : 0;
  };

  const getUpcomingTasks = () => {
    if (!timelineDetails?.tasks) return [];
    
    const now = new Date();
    const upcoming = timelineDetails.tasks
      .filter(task => {
        const dueDate = new Date(task.dueDate);
        return task.status !== 'completed' && dueDate >= now;
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 3)
      .map(task => ({
        id: task.id,
        title: task.title,
        date: new Date(task.dueDate).toLocaleDateString(),
      }));

    return upcoming;
  };

  const upcomingTasks = getUpcomingTasks();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>{t("common.loading", "Loading...")}</Text>
      </View>
    );
  }

  if (!hasDate) {
    return (
      <View className="flex-1 bg-white px-6 py-8">
        <View className="flex-1 justify-center">
          <Text className="text-3xl font-bold text-gray-900 mb-4">
            {t("dateSelection.title")}
          </Text>
          <Text className="text-gray-600 text-lg mb-8">
            {t("dateSelection.description")}
          </Text>
          <DatePicker
            value={selectedDate}
            onChange={setSelectedDate}
            minimumDate={new Date()}
          />
          <Pressable
            onPress={handleDateSave}
            className="mt-8 bg-pink-500 py-4 rounded-xl items-center"
          >
            <Text className="text-white font-semibold text-lg">
              {t("common.save")}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="bg-white px-6 py-8 border-b border-gray-100">
        <Text className="text-3xl font-bold text-gray-900 mb-2">
          {t("screens.home.title")}
        </Text>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View style={{ marginRight: 8 }}>
              <Ionicons name="calendar" size={20} color="#FF4B8C" />
            </View>
            <Text className="text-gray-600 text-base">
              {t("screens.home.daysUntil", { days: daysUntilWedding })}
            </Text>
          </View>
          <Pressable onPress={() => setHasDate(false)}>
            <Text className="text-pink-500 font-semibold">
              {t("common.change")}
            </Text>
          </Pressable>
        </View>
      </View>

      <View className="px-6 py-8">
        <Text className="text-xl font-semibold text-gray-900 mb-4">
          {t("screens.home.quickActions.title")}
        </Text>
        <View className="mb-4">
          <QuickActionCard
            icon="list"
            title={t("screens.home.quickActions.checklist.title")}
            description={t("screens.home.quickActions.checklist.description")}
            route={"/(auth)/(tabs)/timeline" as PathNames}
          />
        </View>
        <View className="mb-4">
          <QuickActionCard
            icon="people"
            title={t("screens.home.quickActions.guests.title")}
            description={t("screens.home.quickActions.guests.description")}
            route={"/(auth)/(tabs)/guests" as PathNames}
          />
        </View>
        <View className="mb-4">
          <QuickActionCard
            icon="wallet"
            title={t("screens.home.quickActions.budget.title")}
            description={t("screens.home.quickActions.budget.description")}
            route={"/(auth)/(tabs)/budget" as PathNames}
          />
        </View>
        <View className="mb-4">
          <QuickActionCard
            icon="briefcase"
            title={t("screens.home.quickActions.vendors.title")}
            description={t("screens.home.quickActions.vendors.description")}
            route={"/(auth)/(tabs)/vendors" as PathNames}
          />
        </View>
      </View>

      <View className="px-6 pb-8">
        <Text className="text-xl font-semibold text-gray-900 mb-4">
          {t("screens.home.progress.title")}
        </Text>
        <View className="mb-4">
          <ProgressSection 
            title={t("screens.home.progress.overall")} 
            progress={calculateProgress()}
            completeText={t("screens.home.progress.complete", { percent: calculateProgress() })}
          />
        </View>
        <View className="flex-row">
          <View className="flex-1 mr-2">
            <ProgressSection 
              title={t("screens.home.progress.budget")} 
              progress={budgetDetails?.items.length ? 
                Math.round((budgetDetails.items.filter(i => i.actualCost !== undefined).length / budgetDetails.items.length) * 100) : 0}
              completeText={t("screens.home.progress.complete", { 
                percent: budgetDetails?.items.length ? 
                  Math.round((budgetDetails.items.filter(i => i.actualCost !== undefined).length / budgetDetails.items.length) * 100) : 0 
              })}
            />
          </View>
          <View className="flex-1 ml-2">
            <ProgressSection 
              title={t("screens.home.progress.guestList")} 
              progress={guestDetails?.guests.length ? 
                Math.round((guestDetails.guests.filter(g => g.status !== 'invited').length / guestDetails.guests.length) * 100) : 0}
              completeText={t("screens.home.progress.complete", { 
                percent: guestDetails?.guests.length ? 
                  Math.round((guestDetails.guests.filter(g => g.status !== 'invited').length / guestDetails.guests.length) * 100) : 0 
              })}
            />
          </View>
        </View>
      </View>

      <View className="px-6 pb-8">
        <Text className="text-xl font-semibold text-gray-900 mb-4">
          {t("screens.home.upcomingTasks.title")}
        </Text>
        <View className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {upcomingTasks.map((task) => (
            <View
              key={task.id}
              className="p-4 flex-row items-center justify-between border-b border-gray-100"
            >
              <View className="flex-row items-center">
                <View style={{ marginRight: 12 }}>
                  <Ionicons name="calendar-outline" size={20} color="#FF4B8C" />
                </View>
                <Text className="text-gray-900">{task.title}</Text>
              </View>
              <Text className="text-gray-500">{task.date}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className="h-20" />
    </ScrollView>
  );
}
