import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { AppStackParamList } from '../types/navigation';
import { Application } from '../types';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

type Props = NativeStackScreenProps<AppStackParamList, 'ApplicationsList'>;

const ApplicationsListScreen: React.FC<Props> = ({ navigation }) => {
  const { token, logout, user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getApplications(token);
      setApplications(data);
    } catch (err) {
      console.error('[ApplicationsList] load error', err);
      Alert.alert('Error', err instanceof Error ? err.message : 'Could not load applications');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadData();
    } finally {
      setRefreshing(false);
    }
  };

  const renderItem = ({ item }: { item: Application }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ApplicationDetail', { application: item })}
    >
      <Text style={styles.company}>{item.company}</Text>
      <Text style={styles.role}>{item.role}</Text>
      <Text style={styles.status}>{item.status}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.greeting}>Hi, {user?.email}</Text>
        <Button title="Logout" onPress={logout} />
      </View>

      <Button title="Add Application" onPress={() => navigation.navigate('ApplicationForm')} />

      <FlatList
        data={applications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text style={styles.empty}>No applications yet.</Text>}
        contentContainerStyle={applications.length === 0 ? styles.emptyContainer : undefined}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  greeting: {
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    marginVertical: 6,
    backgroundColor: '#fff',
    gap: 4,
  },
  company: {
    fontSize: 16,
    fontWeight: '700',
  },
  role: {
    fontSize: 14,
    color: '#374151',
  },
  status: {
    marginTop: 4,
    color: '#2563eb',
    fontWeight: '600',
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    color: '#6b7280',
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ApplicationsListScreen;

