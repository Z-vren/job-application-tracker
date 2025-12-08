import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../types/navigation';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { ApplicationStatus } from '../types';

type Props = NativeStackScreenProps<AppStackParamList, 'ApplicationForm'>;

const STATUSES: ApplicationStatus[] = ['Applied', 'Interview', 'Rejected', 'Offer'];

const ApplicationFormScreen: React.FC<Props> = ({ route, navigation }) => {
  const existing = route.params?.application;
  const { token } = useAuth();
  const [company, setCompany] = useState(existing?.company || '');
  const [role, setRole] = useState(existing?.role || '');
  const [status, setStatus] = useState<ApplicationStatus>(existing?.status || 'Applied');
  const [appliedDate, setAppliedDate] = useState(existing?.appliedDate || '');
  const [deadline, setDeadline] = useState(existing?.deadline || '');
  const [notes, setNotes] = useState(existing?.notes || '');
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSave = async () => {
    if (!token) {
      Alert.alert('Not authenticated', 'Please log in again.');
      return;
    }

    if (!company || !role || !appliedDate) {
      Alert.alert('Missing fields', 'Company, role, and applied date are required.');
      return;
    }
    setErrorMessage(null);
    setSaving(true);
    try {
      const payload = {
        company,
        role,
        status,
        appliedDate,
        deadline: deadline || null,
        notes,
      };
      console.log('[ApplicationForm] submitting', payload);
      if (existing) {
        await api.updateApplication(token, existing.id, payload);
      } else {
        await api.createApplication(token, payload);
      }
      console.log('[ApplicationForm] save success');
      navigation.navigate('ApplicationsList');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Save failed';
      console.error('[ApplicationForm] save error', err);
      setErrorMessage(message);
      Alert.alert('Error', message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!existing) return;
    Alert.alert('Delete', 'Are you sure you want to delete this application?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.deleteApplication(token, existing.id);
            navigation.navigate('ApplicationsList');
          } catch (err) {
            Alert.alert('Error', err instanceof Error ? err.message : 'Delete failed');
          }
        },
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Company</Text>
      <TextInput
        style={styles.input}
        value={company}
        onChangeText={setCompany}
        placeholder="Company name"
      />

      <Text style={styles.label}>Role</Text>
      <TextInput
        style={styles.input}
        value={role}
        onChangeText={setRole}
        placeholder="Role title"
      />

      <Text style={styles.label}>Status</Text>
      <View style={styles.statusRow}>
        {STATUSES.map((s) => (
          <TouchableOpacity
            key={s}
            style={[styles.statusChip, status === s && styles.statusChipActive]}
            onPress={() => setStatus(s)}
          >
            <Text style={status === s ? styles.statusTextActive : styles.statusText}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Applied Date</Text>
      <TextInput
        style={styles.input}
        value={appliedDate}
        onChangeText={setAppliedDate}
        placeholder="YYYY-MM-DD"
      />

      <Text style={styles.label}>Deadline (optional)</Text>
      <TextInput
        style={styles.input}
        value={deadline}
        onChangeText={setDeadline}
        placeholder="YYYY-MM-DD"
      />

      <Text style={styles.label}>Notes (optional)</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={notes}
        onChangeText={setNotes}
        placeholder="Notes..."
        multiline
        numberOfLines={4}
      />

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      {saving ? <ActivityIndicator /> : <Button title="Save" onPress={handleSave} />}

      {existing ? (
        <View style={{ marginTop: 12 }}>
          <Button color="#ef4444" title="Delete" onPress={handleDelete} />
        </View>
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
  label: {
    fontSize: 14,
    color: '#6b7280',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  statusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#f9fafb',
  },
  statusChipActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  statusText: {
    color: '#111827',
  },
  statusTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  error: {
    color: '#ef4444',
    marginTop: 4,
  },
});

export default ApplicationFormScreen;

