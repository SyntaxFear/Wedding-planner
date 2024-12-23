import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  HAS_COMPLETED_ONBOARDING: "has_completed_onboarding",
  WEDDING_DETAILS: "wedding_details",
} as const;

interface WeddingDetails {
  weddingDate: string;
}

export const setOnboardingComplete = async (completed: boolean = true) => {
  try {
    if (completed) {
      await AsyncStorage.setItem(STORAGE_KEYS.HAS_COMPLETED_ONBOARDING, "true");
    } else {
      await AsyncStorage.removeItem(STORAGE_KEYS.HAS_COMPLETED_ONBOARDING);
    }
  } catch (error) {
    console.error("Error setting onboarding state:", error);
  }
};

export const setWeddingDate = async (date: Date) => {
  try {
    const details: WeddingDetails = {
      weddingDate: date.toISOString(),
    };
    await AsyncStorage.setItem(STORAGE_KEYS.WEDDING_DETAILS, JSON.stringify(details));
  } catch (error) {
    console.error("Error saving wedding date:", error);
    throw error;
  }
};

export const getWeddingDetails = async (): Promise<WeddingDetails | null> => {
  try {
    const details = await AsyncStorage.getItem(STORAGE_KEYS.WEDDING_DETAILS);
    return details ? JSON.parse(details) : null;
  } catch (error) {
    console.error("Error getting wedding details:", error);
    throw error;
  }
};

export const getDaysUntilWedding = async (): Promise<number> => {
  try {
    const details = await getWeddingDetails();
    if (!details) {
      throw new Error("No wedding date set");
    }
    
    const weddingDate = new Date(details.weddingDate);
    const today = new Date();
    const diffTime = weddingDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  } catch (error) {
    console.error("Error calculating days until wedding:", error);
    throw error;
  }
};

export const checkIsFirstLaunch = async () => {
  try {
    const hasCompletedOnboarding = await AsyncStorage.getItem(
      STORAGE_KEYS.HAS_COMPLETED_ONBOARDING
    );
    return hasCompletedOnboarding === null;
  } catch (error) {
    console.error("Error checking first launch:", error);
    return false;
  }
};
