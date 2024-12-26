import React, { useEffect, useState, useMemo } from "react";
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import * as storage from "../../utils/storage";
import {
  VendorOverview,
  VendorCard,
  AddEditVendor,
} from "../../components/features/vendors";

export default function Vendors() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [vendorDetails, setVendorDetails] = useState<storage.VendorDetails | null>(null);
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<storage.Vendor | undefined>();

  useEffect(() => {
    loadVendorDetails();
  }, []);

  const loadVendorDetails = async () => {
    try {
      await storage.initializeVendors();
      const details = await storage.getVendorDetails();
      setVendorDetails(details);
    } catch (error) {
      console.error("Error loading vendor details:", error);
      Alert.alert(
        t("screens.vendors.errors.loadFailed"),
        t("screens.vendors.errors.loadFailedMessage")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveVendor = async (vendor: Omit<storage.Vendor, "id">) => {
    try {
      if (selectedVendor) {
        await storage.updateVendor(selectedVendor.id, vendor);
      } else {
        await storage.addVendor(vendor);
      }
      loadVendorDetails();
      setShowAddEdit(false);
      setSelectedVendor(undefined);
    } catch (error) {
      console.error("Error saving vendor:", error);
      Alert.alert(
        t("screens.vendors.errors.saveFailed"),
        t("screens.vendors.errors.saveFailedMessage")
      );
    }
  };

  const handleDeleteVendor = async (vendorId: string) => {
    try {
      await storage.deleteVendor(vendorId);
      loadVendorDetails();
    } catch (error) {
      console.error("Error deleting vendor:", error);
      Alert.alert(
        t("screens.vendors.errors.deleteFailed"),
        t("screens.vendors.errors.deleteFailedMessage")
      );
    }
  };

  const stats = useMemo(() => {
    if (!vendorDetails?.vendors) return {
      total: 0,
      byStatus: {
        researching: 0,
        contacted: 0,
        meeting_scheduled: 0,
        proposal_received: 0,
        hired: 0,
        declined: 0,
      },
      hired: 0,
      totalBudget: 0,
      spentBudget: 0,
    };

    const result = vendorDetails.vendors.reduce(
      (acc, vendor) => {
        acc.total++;
        acc.byStatus[vendor.status]++;
        if (vendor.status === "hired") acc.hired++;

        vendor.quotes.forEach((quote) => {
          if (quote.status === "accepted") {
            acc.spentBudget += quote.amount;
          }
          acc.totalBudget += quote.amount;
        });

        return acc;
      },
      {
        total: 0,
        byStatus: {
          researching: 0,
          contacted: 0,
          meeting_scheduled: 0,
          proposal_received: 0,
          hired: 0,
          declined: 0,
        },
        hired: 0,
        totalBudget: 0,
        spentBudget: 0,
      }
    );

    return result;
  }, [vendorDetails?.vendors]);

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
        <VendorOverview stats={stats} />

        <View className="p-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-semibold text-gray-900">
              {t("screens.vendors.title")}
            </Text>
            <Pressable
              onPress={() => {
                setSelectedVendor(undefined);
                setShowAddEdit(true);
              }}
              className="bg-pink-500 px-4 flex items-center justify-center rounded-lg"
            >
              <Text className="text-white font-semibold">
                {t("screens.vendors.addNew")}
              </Text>
            </Pressable>
          </View>

          {vendorDetails?.vendors.map((vendor) => (
            <VendorCard
              key={vendor.id}
              vendor={vendor}
              onPress={() => {
                setSelectedVendor(vendor);
                setShowAddEdit(true);
              }}
              onDelete={() => {
                Alert.alert(
                  t("screens.vendors.delete.title"),
                  t("screens.vendors.delete.message"),
                  [
                    {
                      text: t("screens.vendors.delete.cancel"),
                      style: "cancel",
                    },
                    {
                      text: t("screens.vendors.delete.confirm"),
                      onPress: () => handleDeleteVendor(vendor.id),
                      style: "destructive",
                    },
                  ]
                );
              }}
            />
          ))}
        </View>
      </ScrollView>

      <AddEditVendor
        isVisible={showAddEdit}
        onClose={() => {
          setShowAddEdit(false);
          setSelectedVendor(undefined);
        }}
        onSave={handleSaveVendor}
        initialVendor={selectedVendor}
      />
    </View>
  );
}
