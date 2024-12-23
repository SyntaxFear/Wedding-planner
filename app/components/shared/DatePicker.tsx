import React, { useState } from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  minimumDate?: Date;
}

export default function DatePicker({ value, onChange, minimumDate = new Date() }: DatePickerProps) {
  const [show, setShow] = useState(false);

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShow(Platform.OS === 'ios');
    if (event.type === 'set' && selectedDate) {
      onChange(selectedDate);
    }
  };

  const formattedDate = value.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <View>
      <Pressable
        onPress={() => setShow(true)}
        className="flex-row items-center bg-white p-4 rounded-xl border border-gray-200"
      >
        <Ionicons name="calendar" size={24} color="#FF4B8C" />
        <Text className="ml-3 text-gray-900 flex-1">{formattedDate}</Text>
        <Ionicons name="chevron-down" size={24} color="#666" />
      </Pressable>

      {show && (
        <DateTimePicker
          value={value}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
          textColor="#000000"
          themeVariant="light"
          onChange={onDateChange}
          minimumDate={minimumDate}
        />
      )}
    </View>
  );
}
