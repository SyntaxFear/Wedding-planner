import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { LanguageSelector } from "../../shared/LanguageSelector";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Image } from "expo-image";
import { GestureDetector, Gesture } from "react-native-gesture-handler";

interface OnboardingProps {
  onComplete: () => void;
  onSkip: () => void;
}

const BACKGROUNDS = [
  "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1509927083803-4bd519298ac4?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1549417229-7686ac5595fd?auto=format&fit=crop&w=1000&q=80",
];

const SCREENS = [
  "home",
  "budget",
  "timeline",
  "guests",
  "vendors",
] as const;

export function Onboarding({ onComplete, onSkip }: OnboardingProps) {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const translateX = useSharedValue(0);
  const startX = useSharedValue(0);

  const isLastScreen = currentIndex === SCREENS.length - 1;

  const handleNext = () => {
    if (isLastScreen) {
      onComplete();
    } else {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      translateX.value = withSpring(-(width * nextIndex));
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      translateX.value = withSpring(-(width * prevIndex));
    }
  };

  BACKGROUNDS.forEach((uri) => {
    Image.prefetch(uri);
  });

  const panGesture = Gesture.Pan()
    .onStart(() => {
      startX.value = translateX.value;
    })
    .onUpdate((event) => {
      translateX.value = startX.value + event.translationX;
    })
    .onEnd((event) => {
      const swipeThreshold = width * 0.2;

      if (event.translationX > swipeThreshold && currentIndex > 0) {
        runOnJS(handlePrevious)();
      } else if (event.translationX < -swipeThreshold && !isLastScreen) {
        runOnJS(handleNext)();
      } else {
        translateX.value = withSpring(-(width * currentIndex));
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View className="flex-1 bg-black">
      <GestureDetector gesture={panGesture}>
        <View className="absolute inset-0">
          <Animated.View
            style={[
              {
                flexDirection: "row",
                width: width * SCREENS.length,
                height: "100%",
              },
              animatedStyle,
            ]}
          >
            {SCREENS.map((_, index) => (
              <View
                key={index}
                style={{ width, height: "100%" }}
                className="bg-gray-900"
              >
                <Image
                  source={{ uri: BACKGROUNDS[index] }}
                  style={{ width, height: "100%" }}
                  contentFit="cover"
                  className="opacity-80"
                />
              </View>
            ))}
          </Animated.View>
        </View>
      </GestureDetector>

      <View className="absolute inset-0 bg-black/50" />

      <LinearGradient
        colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0.95)"]}
        locations={[0.4, 1]}
        className="absolute inset-0"
      />

      <View className="flex-1">
        <View className="flex-row justify-between items-center px-4 pt-14 pb-4">
          <LanguageSelector />
          <TouchableOpacity
            onPress={onSkip}
            className="flex-row items-center py-2 px-4 rounded-xl bg-white/90 backdrop-blur-md"
          >
            <Text className="text-gray-900 mr-2 font-medium">
              {t("common.skip")}
            </Text>
            <Ionicons name="arrow-forward" size={16} color="#111827" />
          </TouchableOpacity>
        </View>

        <View className="flex-1 justify-end px-8 pb-32">
          <Animated.View
            entering={FadeInDown.delay(200).duration(1000)}
            className="items-start"
          >
            <Text className="text-5xl font-bold mb-6 text-white leading-tight">
              {t(`onboarding.screens.${SCREENS[currentIndex]}.title`)}
            </Text>
            <Text className="text-xl text-white/90 mb-8 leading-relaxed">
              {t(`onboarding.screens.${SCREENS[currentIndex]}.description`)}
            </Text>
          </Animated.View>
        </View>

        <View className="bg-black/20 backdrop-blur-md">
          <View className="flex-row justify-center items-center py-4 space-x-2 gap-1">
            {SCREENS.map((_, index) => (
              <View
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "w-8 bg-white" : "w-2 bg-white/40"
                }`}
              />
            ))}
          </View>

          <View className="p-8 pt-0">
            <TouchableOpacity
              onPress={handleNext}
              className="bg-white/90 backdrop-blur-md rounded-2xl py-4 items-center"
            >
              <Text className="text-gray-900 text-lg font-semibold">
                {isLastScreen ? t("onboarding.getStarted") : t("common.next")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
