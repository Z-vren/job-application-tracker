import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../types/navigation';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

type Props = NativeStackScreenProps<AppStackParamList, 'ApplicationDetail'>;

const ApplicationDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { application } = route.params;
  const { token } = useAuth();

  const handleDelete = async () => {
    Alert.alert('Delete application', 'Are you sure you want to delete this?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.deleteApplication(token, application.id);
            navigation.goBack();
          } catch (err) {
            Alert.alert('Error', err instanceof Error ? err.message : 'Delete failed');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Company</Text>
      <Text style={styles.value}>{application.company}</Text>

      <Text style={styles.label}>Role</Text>
      <Text style={styles.value}>{application.role}</Text>

      <Text style={styles.label}>Status</Text>
      <Text style={styles.value}>{application.status}</Text>

      <Text style={styles.label}>Applied</Text>
      <Text style={styles.value}>{application.appliedDate}</Text>

      {application.deadline ? (
        <>
          <Text style={styles.label}>Deadline</Text>
          <Text style={styles.value}>{application.deadline}</Text>
        </>
      ) : null}

      {application.notes ? (
        <>
          <Text style={styles.label}>Notes</Text>
          <Text style={styles.value}>{application.notes}</Text>
        </>
      ) : null}

      <View style={styles.actions}>
        <Button
          title="Edit"
          onPress={() => navigation.navigate('ApplicationForm', { application })}
        />
        <Button color="#ef4444" title="Delete" onPress={handleDelete} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: '#6b7280',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
});

export default ApplicationDetailScreen;

