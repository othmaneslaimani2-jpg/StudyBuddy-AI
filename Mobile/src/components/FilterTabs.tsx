import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export interface FilterTabOption {
  id: string;
  label: string;
  count?: number;
}

export interface FilterTabsProps {
  tabs: FilterTabOption[];
  activeTab: string;
  onSelectTab: (id: string) => void;
}

export const FilterTabs: React.FC<FilterTabsProps> = ({ tabs, activeTab, onSelectTab }) => {
  return (
    <View style={styles.tabsContainer}>
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.id;
        return (
          <React.Fragment key={tab.id}>
            {index > 0 && index === tabs.length - 1 && <View style={styles.tabDivider} />}
            <TouchableOpacity
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => onSelectTab(tab.id)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{tab.label}</Text>
              {typeof tab.count === 'number' && (
                <View style={[styles.badge, isActive && styles.badgeActive]}>
                  <Text style={[styles.badgeText, isActive && styles.badgeTextActive]}>
                    {tab.count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </React.Fragment>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 18,
    padding: 4,
    marginBottom: 20,
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 14,
  },
  tabActive: {
    backgroundColor: '#4F46E5',
    shadowColor: '#4F46E5',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  tabTextActive: {
    color: '#FFF',
  },
  badge: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 6,
  },
  badgeActive: {
    backgroundColor: '#FFF',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4B5563',
  },
  badgeTextActive: {
    color: '#4F46E5',
  },
  tabDivider: {
    width: 1,
    height: 18,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 2,
  },
});
