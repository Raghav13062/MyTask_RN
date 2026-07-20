import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { setProjects, setLoading } from '../../redux/project/projectSlice';
import { projectService } from '../../services/project.service';
import { Card } from '../../components/Card';
import { EmptyState } from '../../components/EmptyState';
import { FAB, ActivityIndicator } from 'react-native-paper';
import colors from '../../theme/colors';

export default function ProjectListScreen({ route, navigation }: any) {
  const { vendorId, vendorName } = route.params;
  const dispatch = useDispatch();
  const { projects, loading } = useSelector((state: RootState) => state.project);

  const loadProjects = async () => {
    dispatch(setLoading(true));
    try {
      const data = await projectService.getProjectsByVendor(vendorId);
      dispatch(setProjects(data));
    } catch (e) {
      console.error(e);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    navigation.setOptions({ title: `${vendorName} Projects` });
    const unsubscribe = navigation.addListener('focus', () => {
      loadProjects();
    });
    return unsubscribe;
  }, [navigation, vendorId, vendorName]);

  const handleDelete = (projectId: string, projectName: string) => {
    Alert.alert('Delete', `Delete project ${projectName}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        await projectService.deleteProject(projectId);
        loadProjects();
      }}
    ]);
  };

  return (
    <View style={styles.container}>
      {loading ? <ActivityIndicator style={{ marginTop: 20 }} /> : (
        <FlatList
          data={projects}
          keyExtractor={item => item.id}
          ListEmptyComponent={<EmptyState title="No projects found" />}
          renderItem={({ item }) => (
            <Card
              title={item.projectName}
              subtitle={item.description}
              onPress={() => navigation.navigate('ProductList', { projectId: item.id, projectName: item.projectName, vendorId })}
              action={
                <View style={{ flexDirection: 'row' }}>
                  <FAB icon="pencil" size="small" onPress={() => navigation.navigate('AddProject', { vendorId, projectId: item.id })} style={styles.actionFab} />
                  <FAB icon="delete" size="small" onPress={() => handleDelete(item.id, item.projectName)} style={[styles.actionFab, { backgroundColor: colors.danger }]} color="white" />
                </View>
              }
            />
          )}
        />
      )}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddProject', { vendorId })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: colors.background,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
  },
  actionFab: {
    marginHorizontal: 4,
    backgroundColor: colors.secondary,
  }
});
