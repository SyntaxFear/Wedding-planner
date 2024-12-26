import React, { useState } from "react";
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
import {
  Vendor,
  VendorCategory,
  VendorStatus,
  VendorContact,
  VendorQuote,
} from "../../../utils/storage";

interface AddEditVendorProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (vendor: Omit<Vendor, "id">) => void;
  initialVendor?: Vendor;
}

export const AddEditVendor = ({
  isVisible,
  onClose,
  onSave,
  initialVendor,
}: AddEditVendorProps) => {
  const { t } = useTranslation();
  const [name, setName] = useState(initialVendor?.name || "");
  const [category, setCategory] = useState<VendorCategory>(
    initialVendor?.category || "venue"
  );
  const [status, setStatus] = useState<VendorStatus>(
    initialVendor?.status || "researching"
  );
  const [website, setWebsite] = useState(initialVendor?.website || "");
  const [instagram, setInstagram] = useState(initialVendor?.instagram || "");
  const [address, setAddress] = useState(initialVendor?.address || "");
  const [description, setDescription] = useState(initialVendor?.description || "");
  const [rating, setRating] = useState(initialVendor?.rating?.toString() || "");
  const [notes, setNotes] = useState(initialVendor?.notes || "");
  const [contacts, setContacts] = useState<VendorContact[]>(
    initialVendor?.contacts || []
  );
  const [quotes, setQuotes] = useState<VendorQuote[]>(
    initialVendor?.quotes || []
  );

  const [showAddContact, setShowAddContact] = useState(false);
  const [showAddQuote, setShowAddQuote] = useState(false);


  const [contactName, setContactName] = useState("");
  const [contactRole, setContactRole] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");


  const [quoteAmount, setQuoteAmount] = useState("");
  const [quoteDescription, setQuoteDescription] = useState("");
  const [quoteNotes, setQuoteNotes] = useState("");

  const clearForm = () => {
    setName("");
    setCategory("venue");
    setStatus("researching");
    setWebsite("");
    setInstagram("");
    setAddress("");
    setDescription("");
    setRating("");
    setNotes("");
    setContacts([]);
    setQuotes([]);
  };

  const handleAddContact = () => {
    if (!contactName.trim()) return;

    const newContact: VendorContact = {
      name: contactName.trim(),
      role: contactRole.trim() || undefined,
      email: contactEmail.trim() || undefined,
      phone: contactPhone.trim() || undefined,
    };

    setContacts([...contacts, newContact]);
    setContactName("");
    setContactRole("");
    setContactEmail("");
    setContactPhone("");
    setShowAddContact(false);
  };

  const handleAddQuote = () => {
    if (!quoteAmount.trim() || !quoteDescription.trim()) return;

    const amount = parseFloat(quoteAmount);
    if (isNaN(amount) || amount <= 0) return;

    const newQuote: VendorQuote = {
      amount,
      description: quoteDescription.trim(),
      date: new Date().toISOString(),
      status: "pending",
      notes: quoteNotes.trim() || undefined,
    };

    setQuotes([...quotes, newQuote]);
    setQuoteAmount("");
    setQuoteDescription("");
    setQuoteNotes("");
    setShowAddQuote(false);
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert(
        t("screens.vendors.errors.validation"),
        t("screens.vendors.errors.nameRequired")
      );
      return;
    }

    const ratingNumber = rating ? parseFloat(rating) : undefined;
    if (rating && (isNaN(ratingNumber!) || ratingNumber! < 0 || ratingNumber! > 5)) {
      Alert.alert(
        t("screens.vendors.errors.validation"),
        t("screens.vendors.errors.invalidRating")
      );
      return;
    }

    onSave({
      name: name.trim(),
      category,
      status,
      website: website.trim() || undefined,
      instagram: instagram.trim() || undefined,
      address: address.trim() || undefined,
      description: description.trim() || undefined,
      rating: ratingNumber,
      notes: notes.trim() || undefined,
      contacts,
      quotes,
      attachments: initialVendor?.attachments || [],
    });

    if (!initialVendor) {
      clearForm();
    }
  };

  const categories: VendorCategory[] = [
    "venue",
    "catering",
    "photography",
    "videography",
    "florist",
    "music",
    "cake",
    "decor",
    "attire",
    "beauty",
    "transportation",
    "other",
  ];

  const statuses: VendorStatus[] = [
    "researching",
    "contacted",
    "meeting_scheduled",
    "proposal_received",
    "hired",
    "declined",
  ];

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
              {initialVendor
                ? t("screens.vendors.edit.title")
                : t("screens.vendors.add.title")}
            </Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={24} color="#666" />
            </Pressable>
          </View>
        </View>

        <ScrollView className="flex-1 p-4">
          <View className="bg-white rounded-lg p-4 mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              {t("screens.vendors.form.basicInfo")}
            </Text>
            <TextInput
              className="bg-gray-50 p-3 rounded-lg mb-3 placeholder:text-gray-400"
              placeholder={t("screens.vendors.form.namePlaceholder")}
              value={name}
              onChangeText={setName}
            />
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                {t("screens.vendors.form.category")}
              </Text>
              <View className="flex-row flex-wrap">
                {categories.map((cat) => (
                  <Pressable
                    key={cat}
                    onPress={() => setCategory(cat)}
                    className={`mr-2 mb-2 px-4 py-2 rounded-full ${
                      category === cat ? "bg-pink-500" : "bg-gray-100"
                    }`}
                  >
                    <Text
                      className={`${
                        category === cat ? "text-white" : "text-gray-600"
                      }`}
                    >
                      {t(`screens.vendors.categories.${cat}`)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                {t("screens.vendors.form.status")}
              </Text>
              <View className="flex-row flex-wrap">
                {statuses.map((s) => (
                  <Pressable
                    key={s}
                    onPress={() => setStatus(s)}
                    className={`mr-2 mb-2 px-4 py-2 rounded-full ${
                      status === s ? "bg-pink-500" : "bg-gray-100"
                    }`}
                  >
                    <Text
                      className={`${
                        status === s ? "text-white" : "text-gray-600"
                      }`}
                    >
                      {t(`screens.vendors.status.${s}`)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>

          <View className="bg-white rounded-lg p-4 mb-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-sm font-medium text-gray-700">
                {t("screens.vendors.form.contacts")}
              </Text>
              <Pressable
                onPress={() => setShowAddContact(true)}
                className="bg-gray-100 p-2 rounded-lg"
              >
                <Ionicons name="add" size={20} color="#666" />
              </Pressable>
            </View>
            {contacts.map((contact, index) => (
              <View
                key={index}
                className="bg-gray-50 p-3 rounded-lg mb-2"
              >
                <Text className="font-medium text-gray-900">{contact.name}</Text>
                {contact.role && (
                  <Text className="text-gray-600 text-sm">{contact.role}</Text>
                )}
                {contact.email && (
                  <Text className="text-gray-600 text-sm">{contact.email}</Text>
                )}
                {contact.phone && (
                  <Text className="text-gray-600 text-sm">{contact.phone}</Text>
                )}
              </View>
            ))}
            {showAddContact && (
              <View className="mt-2">
                <TextInput
                  className="bg-gray-50 p-3 rounded-lg mb-2 placeholder:text-gray-400"
                  placeholder={t("screens.vendors.form.contactNamePlaceholder")}
                  value={contactName}
                  onChangeText={setContactName}
                />
                <TextInput
                  className="bg-gray-50 p-3 rounded-lg mb-2 placeholder:text-gray-400"
                  placeholder={t("screens.vendors.form.contactRolePlaceholder")}
                  value={contactRole}
                  onChangeText={setContactRole}
                />
                <TextInput
                  className="bg-gray-50 p-3 rounded-lg mb-2 placeholder:text-gray-400"
                  placeholder={t("screens.vendors.form.contactEmailPlaceholder")}
                  value={contactEmail}
                  onChangeText={setContactEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TextInput
                  className="bg-gray-50 p-3 rounded-lg mb-3 placeholder:text-gray-400"
                  placeholder={t("screens.vendors.form.contactPhonePlaceholder")}
                  value={contactPhone}
                  onChangeText={setContactPhone}
                  keyboardType="phone-pad"
                />
                <View className="flex-row">
                  <Pressable
                    onPress={() => setShowAddContact(false)}
                    className="flex-1 bg-gray-100 p-3 rounded-lg mr-2"
                  >
                    <Text className="text-center text-gray-600">
                      {t("common.cancel")}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={handleAddContact}
                    className="flex-1 bg-pink-500 p-3 rounded-lg ml-2"
                  >
                    <Text className="text-center text-white font-semibold">
                      {t("common.add")}
                    </Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>

          <View className="bg-white rounded-lg p-4 mb-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-sm font-medium text-gray-700">
                {t("screens.vendors.form.quotes")}
              </Text>
              <Pressable
                onPress={() => setShowAddQuote(true)}
                className="bg-gray-100 p-2 rounded-lg"
              >
                <Ionicons name="add" size={20} color="#666" />
              </Pressable>
            </View>
            {quotes.map((quote, index) => (
              <View
                key={index}
                className="bg-gray-50 p-3 rounded-lg mb-2"
              >
                <View className="flex-row justify-between items-center mb-1">
                  <Text className="font-medium text-gray-900">
                    ${quote.amount.toLocaleString()}
                  </Text>
                  <Text
                    className={`text-sm ${
                      quote.status === "accepted"
                        ? "text-green-600"
                        : quote.status === "declined"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {t(`screens.vendors.quoteStatus.${quote.status}`)}
                  </Text>
                </View>
                <Text className="text-gray-600">{quote.description}</Text>
                {quote.notes && (
                  <Text className="text-gray-500 text-sm mt-1">
                    {quote.notes}
                  </Text>
                )}
              </View>
            ))}
            {showAddQuote && (
              <View className="mt-2">
                <TextInput
                  className="bg-gray-50 p-3 rounded-lg mb-2 placeholder:text-gray-400"
                  placeholder={t("screens.vendors.form.quoteAmountPlaceholder")}
                  value={quoteAmount}
                  onChangeText={setQuoteAmount}
                  keyboardType="numeric"
                />
                <TextInput
                  className="bg-gray-50 p-3 rounded-lg mb-2 placeholder:text-gray-400"
                  placeholder={t("screens.vendors.form.quoteDescriptionPlaceholder")}
                  value={quoteDescription}
                  onChangeText={setQuoteDescription}
                  multiline
                  numberOfLines={2}
                />
                <TextInput
                  className="bg-gray-50 p-3 rounded-lg mb-3 placeholder:text-gray-400"
                  placeholder={t("screens.vendors.form.quoteNotesPlaceholder")}
                  value={quoteNotes}
                  onChangeText={setQuoteNotes}
                  multiline
                  numberOfLines={2}
                />
                <View className="flex-row">
                  <Pressable
                    onPress={() => setShowAddQuote(false)}
                    className="flex-1 bg-gray-100 p-3 rounded-lg mr-2"
                  >
                    <Text className="text-center text-gray-600">
                      {t("common.cancel")}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={handleAddQuote}
                    className="flex-1 bg-pink-500 p-3 rounded-lg ml-2"
                  >
                    <Text className="text-center text-white font-semibold">
                      {t("common.add")}
                    </Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>
          <View className="bg-white rounded-lg p-4 mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              {t("screens.vendors.form.additionalInfo")}
            </Text>
            <TextInput
              className="bg-gray-50 p-3 rounded-lg mb-3 placeholder:text-gray-400"
              placeholder={t("screens.vendors.form.websitePlaceholder")}
              value={website}
              onChangeText={setWebsite}
              autoCapitalize="none"
              keyboardType="url"
            />
            <TextInput
              className="bg-gray-50 p-3 rounded-lg mb-3 placeholder:text-gray-400"
              placeholder={t("screens.vendors.form.instagramPlaceholder")}
              value={instagram}
              onChangeText={setInstagram}
              autoCapitalize="none"
            />
            <TextInput
              className="bg-gray-50 p-3 rounded-lg mb-3 placeholder:text-gray-400"
              placeholder={t("screens.vendors.form.addressPlaceholder")}
              value={address}
              onChangeText={setAddress}
              multiline
              numberOfLines={2}
            />
            <TextInput
              className="bg-gray-50 p-3 rounded-lg mb-3 placeholder:text-gray-400"
              placeholder={t("screens.vendors.form.descriptionPlaceholder")}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />
            <TextInput
              className="bg-gray-50 p-3 rounded-lg mb-3 placeholder:text-gray-400"
              placeholder={t("screens.vendors.form.ratingPlaceholder")}
              value={rating}
              onChangeText={setRating}
              keyboardType="numeric"
            />
            <TextInput
              className="bg-gray-50 p-3 rounded-lg placeholder:text-gray-400"
              placeholder={t("screens.vendors.form.notesPlaceholder")}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
            />
          </View>
        </ScrollView>

        <View className="bg-white border-t border-gray-200 p-4">
          <Pressable
            onPress={handleSave}
            className="bg-pink-500 p-4 rounded-lg items-center"
          >
            <Text className="text-white font-semibold">
              {t("common.save")}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};
