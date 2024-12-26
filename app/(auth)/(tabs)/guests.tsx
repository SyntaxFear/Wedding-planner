import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { useTranslation } from "react-i18next";
import { useEffect, useState, useMemo } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as storage from "../../utils/storage";
import { AddEditGuest, GuestCard, GuestOverview, TableManagement } from "../../components/features/guests";

export default function Guests() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [guestDetails, setGuestDetails] = useState<storage.GuestDetails | null>(null);
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<storage.Guest | undefined>();
  const [showTableManagement, setShowTableManagement] = useState(false);

  useEffect(() => {
    loadGuestDetails();
  }, []);

  const loadGuestDetails = async () => {
    try {
      await storage.initializeGuestList();
      const details = await storage.getGuestDetails();
      setGuestDetails(details);
    } catch (error) {
      console.error("Error loading guest details:", error);
      Alert.alert(
        t("screens.guests.errors.loadFailed"),
        t("screens.guests.errors.loadFailedMessage")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveGuest = async (guest: Omit<storage.Guest, "id">) => {
    try {
      if (selectedGuest) {
        await storage.updateGuest(selectedGuest.id, guest);
      } else {
        await storage.addGuest(guest);
      }
      loadGuestDetails();
      setShowAddEdit(false);
      setSelectedGuest(undefined);
    } catch (error) {
      console.error("Error saving guest:", error);
      Alert.alert(
        t("screens.guests.errors.saveFailed"),
        t("screens.guests.errors.saveFailedMessage")
      );
    }
  };

  const handleDeleteGuest = async (guestId: string) => {
    try {
      await storage.deleteGuest(guestId);
      loadGuestDetails();
    } catch (error) {
      console.error("Error deleting guest:", error);
      Alert.alert(
        t("screens.guests.errors.deleteFailed"),
        t("screens.guests.errors.deleteFailedMessage")
      );
    }
  };

  const handleSaveTable = async (table: Omit<storage.Table, "id">) => {
    try {
      await storage.addTable(table);
      loadGuestDetails();
    } catch (error) {
      console.error("Error saving table:", error);
      Alert.alert(
        t("screens.guests.errors.tableError"),
        t("screens.guests.errors.tableErrorMessage")
      );
    }
  };

  const handleDeleteTable = async (tableId: string) => {
    try {
      await storage.deleteTable(tableId);
      loadGuestDetails();
    } catch (error) {
      console.error("Error deleting table:", error);
      Alert.alert(
        t("screens.guests.errors.tableError"),
        t("screens.guests.errors.tableErrorMessage")
      );
    }
  };

  const handleUpdateTable = async (tableId: string, updates: Partial<storage.Table>) => {
    try {
      await storage.updateTable(tableId, updates);
      loadGuestDetails();
    } catch (error) {
      console.error("Error updating table:", error);
      Alert.alert(
        t("screens.guests.errors.tableError"),
        t("screens.guests.errors.tableErrorMessage")
      );
    }
  };

  const handleAssignTable = async (guestId: string, tableId: string | undefined) => {
    try {
      await storage.updateGuest(guestId, { tableId });
      loadGuestDetails();
    } catch (error) {
      console.error("Error assigning table:", error);
      Alert.alert(
        t("screens.guests.errors.tableError"),
        t("screens.guests.errors.tableErrorMessage")
      );
    }
  };

  const stats = useMemo(() => {
    if (!guestDetails?.guests) return {
      total: 0,
      confirmed: 0,
      declined: 0,
      pending: 0,
      adults: 0,
      children: 0,
      infants: 0
    };

    return guestDetails.guests.reduce((acc, guest) => {
      acc.total++;
      
      if (guest.status === 'confirmed') acc.confirmed++;
      else if (guest.status === 'declined') acc.declined++;
      else acc.pending++;

      if (guest.ageRange === 'adult') acc.adults++;
      else if (guest.ageRange === 'child') acc.children++;
      else if (guest.ageRange === 'infant') acc.infants++;

      return acc;
    }, {
      total: 0,
      confirmed: 0,
      declined: 0,
      pending: 0,
      adults: 0,
      children: 0,
      infants: 0
    });
  }, [guestDetails?.guests]);

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
        <GuestOverview stats={stats} />

        <View className="p-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-semibold text-gray-900">
              {t("screens.guests.title")}
            </Text>
            <View className="flex-row">
              <Pressable
                onPress={() => setShowTableManagement(true)}
                className="bg-gray-100 p-2 rounded-lg mr-2"
              >
                <Ionicons name="grid" size={24} color="#666" />
              </Pressable>
              <Pressable
                onPress={() => {
                  setSelectedGuest(undefined);
                  setShowAddEdit(true);
                }}
                className="bg-pink-500 px-4 flex items-center justify-center rounded-lg"
              >
                <Text className="text-white font-semibold">
                  {t("screens.guests.addNew")}
                </Text>
              </Pressable>
            </View>
          </View>

          {guestDetails?.guests.map((guest) => (
            <GuestCard
              key={guest.id}
              guest={guest}
              table={guestDetails.tables.find(t => t.id === guest.tableId)}
              onPress={() => {
                setSelectedGuest(guest);
                setShowAddEdit(true);
              }}
              onDelete={() => {
                Alert.alert(
                  t("screens.guests.delete.title"),
                  t("screens.guests.delete.message"),
                  [
                    {
                      text: t("screens.guests.delete.cancel"),
                      style: "cancel",
                    },
                    {
                      text: t("screens.guests.delete.confirm"),
                      onPress: () => handleDeleteGuest(guest.id),
                      style: "destructive",
                    },
                  ]
                );
              }}
            />
          ))}
        </View>
      </ScrollView>

      <AddEditGuest
        isVisible={showAddEdit}
        onClose={() => {
          setShowAddEdit(false);
          setSelectedGuest(undefined);
        }}
        onSave={handleSaveGuest}
        initialGuest={selectedGuest}
        tables={guestDetails?.tables || []}
      />

      <TableManagement
        isVisible={showTableManagement}
        onClose={() => setShowTableManagement(false)}
        tables={guestDetails?.tables || []}
        guests={guestDetails?.guests || []}
        onAddTable={handleSaveTable}
        onUpdateTable={handleUpdateTable}
        onDeleteTable={handleDeleteTable}
        onAssignGuest={handleAssignTable}
      />
    </View>
  );
}
