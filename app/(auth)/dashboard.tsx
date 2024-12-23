import { View, StatusBar } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Home from './(tabs)/home'

export default function DashboardScreen() {
  const insets = useSafeAreaInsets()
  
  return (
    <View 
      className="flex-1 bg-gray-50" 
      style={{ 
        paddingTop: insets.top,
        paddingBottom: insets.bottom
      }}
    >
      <StatusBar barStyle="light-content" />
      <Home />
    </View>
  )
}
