import { useRouter } from "expo-router";
import { checkIsFirstLaunch } from "./utils/storage";
import { useEffect } from "react";
import { View } from "react-native";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    async function initRoute() {
      try {
        const isFirst = await checkIsFirstLaunch();
        router.replace(
          isFirst ? "/(public)/onboarding" : "/(auth)/(tabs)/home"
        );
      } catch (error) {
        console.error("Error determining initial route:", error);
        router.replace("/(public)/onboarding");
      }
    }

    initRoute();
  }, [router]);

  return <View className="flex-1 bg-white" />;
}
