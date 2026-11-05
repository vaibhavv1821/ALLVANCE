import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import {
  Home,
  Briefcase,
  Code2,
  Bot,
  Grid,
} from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';

interface TabItem {
  id: string;
  name: string;
  route: string;
  icon: (color: string, size: number) => React.ReactNode;
}

interface BottomNavigationProps {
  style?: ViewStyle;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ style }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { colors, typography, spacing, borderSubtle } = {
    ...useAppTheme(),
    borderSubtle: useAppTheme().colors.borderSubtle,
  };

  const tabs: TabItem[] = [
    {
      id: 'home',
      name: 'Home',
      route: '/',
      icon: (color, size) => <Home size={size} color={color} />,
    },
    {
      id: 'placement',
      name: 'Placement',
      route: '/placement',
      icon: (color, size) => <Briefcase size={size} color={color} />,
    },
    {
      id: 'practice',
      name: 'Practice',
      route: '/practice',
      icon: (color, size) => <Code2 size={size} color={color} />,
    },
    {
      id: 'ai',
      name: 'AI',
      route: '/ai',
      icon: (color, size) => <Bot size={size} color={color} />,
    },
    {
      id: 'more',
      name: 'More',
      route: '/more',
      icon: (color, size) => <Grid size={size} color={color} />,
    },
  ];

  const handleTabPress = (route: string) => {
    router.push(route as any);
  };

  const isActive = (route: string) => {
    if (route === '/') {
      return pathname === '/' || pathname === '/(tabs)' || pathname === '';
    }
    return pathname.includes(route);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.tabBackground,
          borderTopColor: colors.tabBorder,
        },
        style,
      ]}
    >
      {tabs.map((tab) => {
        const active = isActive(tab.route);
        const iconColor = active ? colors.tabActive : colors.tabInactive;

        return (
          <TouchableOpacity
            key={tab.id}
            activeOpacity={0.7}
            onPress={() => handleTabPress(tab.route)}
            style={styles.tabButton}
          >
            <View style={styles.iconContainer}>
              {tab.icon(iconColor, 22)}
              {active && (
                <View
                  style={[
                    styles.activeIndicator,
                    { backgroundColor: colors.primary },
                  ]}
                />
              )}
            </View>
            <Text
              style={[
                styles.label,
                {
                  color: iconColor,
                  fontSize: typography.fontSizes.xxs,
                  fontWeight: active
                    ? typography.fontWeights.semiBold
                    : typography.fontWeights.regular,
                  marginTop: 3,
                },
              ]}
            >
              {tab.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 62,
    borderTopWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 6,
    paddingTop: 6,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -4,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  label: {},
});
