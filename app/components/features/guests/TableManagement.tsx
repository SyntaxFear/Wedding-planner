import { useState } from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { Guest, Table } from "../../../utils/storage";

interface TableManagementProps {
  isVisible: boolean;
  onClose: () => void;
  tables: Table[];
  guests: Guest[];
  onAddTable: (table: Omit<Table, "id">) => void;
  onUpdateTable: (tableId: string, updates: Partial<Table>) => void;
  onDeleteTable: (tableId: string) => void;
  onAssignGuest: (guestId: string, tableId: string | undefined) => void;
}

export const TableManagement = ({
  isVisible,
  onClose,
  tables,
  guests,
  onAddTable,
  onUpdateTable,
  onDeleteTable,
  onAssignGuest,
}: TableManagementProps) => {
  const { t } = useTranslation();
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [showAddTable, setShowAddTable] = useState(false);
  const [tableName, setTableName] = useState("");
  const [tableCapacity, setTableCapacity] = useState("");
  const [tableLocation, setTableLocation] = useState("");
  const [tableNotes, setTableNotes] = useState("");

  const clearForm = () => {
    setTableName("");
    setTableCapacity("");
    setTableLocation("");
    setTableNotes("");
  };

  const handleAddTable = () => {
    if (!tableName.trim() || !tableCapacity.trim()) {
      return;
    }

    const capacity = parseInt(tableCapacity);
    if (isNaN(capacity) || capacity <= 0) {
      return;
    }

    onAddTable({
      name: tableName.trim(),
      capacity,
      location: tableLocation.trim(),
      notes: tableNotes.trim(),
    });

    clearForm();
    setShowAddTable(false);
  };

  const handleDeleteTable = (table: Table) => {
    Alert.alert(
      t("screens.guests.tables.delete.title"),
      t("screens.guests.tables.delete.message"),
      [
        {
          text: t("screens.guests.tables.delete.cancel"),
          style: "cancel",
        },
        {
          text: t("screens.guests.tables.delete.confirm"),
          onPress: () => {
            onDeleteTable(table.id);
            setSelectedTable(null);
          },
          style: "destructive",
        },
      ]
    );
  };

  const getAssignedGuests = (tableId: string) => {
    return guests.filter((guest) => guest.tableId === tableId);
  };

  const getUnassignedGuests = () => {
    return guests.filter((guest) => !guest.tableId);
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-gray-50">
        <View className="bg-white border-b border-gray-200 px-4 py-4">
          <View className="flex-row justify-between items-center">
            <Text className="text-xl font-semibold text-gray-900">
              {t("screens.guests.tables.title")}
            </Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={24} color="#666" />
            </Pressable>
          </View>
        </View>

        <ScrollView className="flex-1">
          {showAddTable ? (
            <View className="p-4">
              <View className="bg-white rounded-lg p-4">
                <Text className="text-lg font-semibold text-gray-900 mb-4">
                  {t("screens.guests.tables.add.title")}
                </Text>
                <TextInput
                  className="bg-gray-50 p-3 rounded-lg mb-3 placeholder:text-gray-400"
                  placeholder={t("screens.guests.tables.form.namePlaceholder")}
                  value={tableName}
                  onChangeText={setTableName}
                />
                <TextInput
                  className="bg-gray-50 p-3 rounded-lg mb-3 placeholder:text-gray-400"
                  placeholder={t("screens.guests.tables.form.capacityPlaceholder")}
                  value={tableCapacity}
                  onChangeText={setTableCapacity}
                  keyboardType="number-pad"
                />
                <TextInput
                  className="bg-gray-50 p-3 rounded-lg mb-3 placeholder:text-gray-400"
                  placeholder={t("screens.guests.tables.form.locationPlaceholder")}
                  value={tableLocation}
                  onChangeText={setTableLocation}
                />
                <TextInput
                  className="bg-gray-50 p-3 rounded-lg mb-4 placeholder:text-gray-400"
                  placeholder={t("screens.guests.tables.form.notesPlaceholder")}
                  value={tableNotes}
                  onChangeText={setTableNotes}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
                <View className="flex-row">
                  <Pressable
                    onPress={() => setShowAddTable(false)}
                    className="flex-1 bg-gray-100 p-3 rounded-lg mr-2"
                  >
                    <Text className="text-center text-gray-600">
                      {t("common.cancel")}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={handleAddTable}
                    className="flex-1 bg-pink-500 p-3 rounded-lg ml-2"
                  >
                    <Text className="text-center text-white font-semibold">
                      {t("common.save")}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ) : (
            <View className="p-4">
              <Pressable
                onPress={() => setShowAddTable(true)}
                className="bg-pink-500 p-4 rounded-lg mb-4"
              >
                <Text className="text-white font-semibold text-center">
                  {t("screens.guests.tables.addNew")}
                </Text>
              </Pressable>

              {tables.map((table) => (
                <Pressable
                  key={table.id}
                  onPress={() => setSelectedTable(selectedTable?.id === table.id ? null : table)}
                  className="bg-white rounded-lg p-4 mb-4"
                >
                  <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-1">
                      <Text className="text-lg font-semibold text-gray-900">
                        {table.name}
                      </Text>
                      <Text className="text-sm text-gray-600">
                        {t("screens.guests.tables.capacity", {
                          current: getAssignedGuests(table.id).length,
                          max: table.capacity,
                        })}
                      </Text>
                    </View>
                    <Pressable
                      onPress={() => handleDeleteTable(table)}
                      className="p-2 rounded-full bg-gray-50"
                      hitSlop={8}
                    >
                      <Ionicons name="trash-outline" size={20} color="#666" />
                    </Pressable>
                  </View>

                  {table.location && (
                    <Text className="text-gray-600 mb-2">
                      {t("screens.guests.tables.location")}: {table.location}
                    </Text>
                  )}

                  {table.notes && (
                    <Text className="text-gray-600 mb-2">
                      {table.notes}
                    </Text>
                  )}

                  {selectedTable?.id === table.id && (
                    <View className="mt-4 border-t border-gray-100 pt-4">
                      <Text className="font-medium text-gray-900 mb-2">
                        {t("screens.guests.tables.assignedGuests")}:
                      </Text>
                      {getAssignedGuests(table.id).map((guest) => (
                        <View
                          key={guest.id}
                          className="flex-row justify-between items-center bg-gray-50 p-3 rounded-lg mb-2"
                        >
                          <Text className="text-gray-600">
                            {guest.firstName} {guest.lastName}
                          </Text>
                          <Pressable
                            onPress={() => onAssignGuest(guest.id, undefined)}
                            className="p-2"
                            hitSlop={8}
                          >
                            <Ionicons name="close-circle" size={20} color="#666" />
                          </Pressable>
                        </View>
                      ))}

                      <Text className="font-medium text-gray-900 mt-4 mb-2">
                        {t("screens.guests.tables.unassignedGuests")}:
                      </Text>
                      {getUnassignedGuests().map((guest) => (
                        <Pressable
                          key={guest.id}
                          onPress={() => onAssignGuest(guest.id, table.id)}
                          className="flex-row justify-between items-center bg-gray-50 p-3 rounded-lg mb-2"
                        >
                          <Text className="text-gray-600">
                            {guest.firstName} {guest.lastName}
                          </Text>
                          <Ionicons name="add-circle" size={20} color="#666" />
                        </Pressable>
                      ))}
                    </View>
                  )}
                </Pressable>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};
