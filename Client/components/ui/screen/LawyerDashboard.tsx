import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import AppointmentsSection from '@/components/ui/screen/widget/LawyerDashboard/AppointmentsSection';
import ClientListSection from '@/components/ui/screen/widget/LawyerDashboard/ClientListSection';
import FeedbackSection from '@/components/ui/screen/widget/LawyerDashboard/FeedbackSection';
import AnalyticsSection from '@/components/ui/screen/widget/LawyerDashboard/AnalyticsSection';
import TierProgressSection from './widget/LawyerDashboard/TierProgressSection';

function LawyerDashboard() {
  const sections = [
    { key: 'tier', component: <TierProgressSection /> },
    { key: 'analytics', component: <AnalyticsSection /> },
    { key: 'appointments', component: <AppointmentsSection /> },
    { key: 'clients', component: <ClientListSection /> },
    { key: 'feedback', component: <FeedbackSection /> },
  ];

  const renderSection = ({ item }) => (
    <View style={{ marginBottom: 16 }}>{item.component}</View>
  );

  return (
    <FlatList
      ListHeaderComponent={<Text style={styles.title}>Lawyer Dashboard</Text>}
      data={sections}
      keyExtractor={(item) => item.key}
      renderItem={renderSection}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      ListFooterComponent={<View style={{ height: 50 }} />}
    />
  );
}

export default LawyerDashboard;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F9F9F9',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
});
