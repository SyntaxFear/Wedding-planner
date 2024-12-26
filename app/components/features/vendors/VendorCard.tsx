import React from 'react';
import { View, Text, Pressable } from "react-native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { Vendor, VendorStatus } from "../../../utils/storage";

interface VendorCardProps {
  vendor: Vendor;
  onPress: () => void;
  onDelete: () => void;
}

export const VendorCard = ({ vendor, onPress, onDelete }: VendorCardProps) => {
  const { t } = useTranslation();

  const getStatusColor = (status: VendorStatus) => {
    switch (status) {
      case "hired":
        return "text-green-600";
      case "declined":
        return "text-red-600";
      case "proposal_received":
        return "text-yellow-600";
      case "meeting_scheduled":
        return "text-blue-600";
      case "contacted":
        return "text-purple-600";
      default:
        return "text-gray-600";
    }
  };

  const getLatestQuote = () => {
    if (vendor.quotes.length === 0) return null;
    return vendor.quotes.reduce((latest, current) => {
      return new Date(current.date) > new Date(latest.date) ? current : latest;
    });
  };

  const latestQuote = getLatestQuote();
  const primaryContact = vendor.contacts[0];

  return (
    <Pressable
      onPress={onPress}
      className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden"
    >
      <View className="p-4">
        <View className="flex-row justify-between items-start mb-2">
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-900">
              {vendor.name}
            </Text>
            <Text className={`${getStatusColor(vendor.status)} text-sm`}>
              {t(`screens.vendors.status.${vendor.status}`)}
            </Text>
          </View>
          <Pressable
            onPress={onDelete}
            className="p-2 rounded-full bg-gray-50"
            hitSlop={8}
          >
            <Ionicons name="trash-outline" size={20} color="#666" />
          </Pressable>
        </View>

        <View className="flex-row flex-wrap">
          <View className="flex-row items-center mr-4 mb-2">
            <Ionicons
              name="folder-outline"
              size={16}
              color="#666"
              style={{ marginRight: 4 }}
            />
            <Text className="text-gray-600">
              {t(`screens.vendors.categories.${vendor.category}`)}
            </Text>
          </View>

          {vendor.rating && (
            <View className="flex-row items-center mr-4 mb-2">
              <Ionicons
                name="star"
                size={16}
                color="#FFB800"
                style={{ marginRight: 4 }}
              />
              <Text className="text-gray-600">{vendor.rating}</Text>
            </View>
          )}

          {primaryContact && (
            <>
              {primaryContact.email && (
                <View className="flex-row items-center mr-4 mb-2">
                  <Ionicons
                    name="mail-outline"
                    size={16}
                    color="#666"
                    style={{ marginRight: 4 }}
                  />
                  <Text className="text-gray-600">{primaryContact.email}</Text>
                </View>
              )}

              {primaryContact.phone && (
                <View className="flex-row items-center mr-4 mb-2">
                  <Ionicons
                    name="call-outline"
                    size={16}
                    color="#666"
                    style={{ marginRight: 4 }}
                  />
                  <Text className="text-gray-600">{primaryContact.phone}</Text>
                </View>
              )}
            </>
          )}

          {vendor.website && (
            <View className="flex-row items-center mr-4 mb-2">
              <Ionicons
                name="globe-outline"
                size={16}
                color="#666"
                style={{ marginRight: 4 }}
              />
              <Text className="text-gray-600">{vendor.website}</Text>
            </View>
          )}
        </View>

        {latestQuote && (
          <View className="mt-3 bg-gray-50 p-3 rounded-lg">
            <Text className="text-sm font-medium text-gray-700 mb-1">
              {t("screens.vendors.latestQuote")}
            </Text>
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-900 font-semibold">
                ${latestQuote.amount.toLocaleString()}
              </Text>
              <Text
                className={`text-sm ${
                  latestQuote.status === "accepted"
                    ? "text-green-600"
                    : latestQuote.status === "declined"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {t(`screens.vendors.quoteStatus.${latestQuote.status}`)}
              </Text>
            </View>
          </View>
        )}

        {vendor.description && (
          <Text className="text-gray-600 mt-2 text-sm">{vendor.description}</Text>
        )}
      </View>
    </Pressable>
  );
};
