import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { projectService } from '../../services/project.service';
import colors from '../../theme/colors';
import { database } from '../../database';
import Project from '../../database/models/Project';

const schema = yup.object().shape({
  projectName: yup.string().required('Project Name is required'),
  description: yup.string().required('Description is required'),
});

export default function AddProjectScreen({ route, navigation }: any) {
  const { vendorId, projectId } = route.params;
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { projectName: '', description: '' },
  });

  useEffect(() => {
    if (projectId) {
      const loadProject = async () => {
        const p = await database.collections.get<Project>('projects').find(projectId);
        reset({ projectName: p.projectName, description: p.description });
      };
      loadProject();
    }
  }, [projectId, reset]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      if (projectId) {
        await projectService.updateProject(projectId, data.projectName, data.description);
      } else {
        await projectService.addProject(vendorId, data.projectName, data.description);
      }
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Input control={control} name="projectName" label="Project Name" />
      <Input control={control} name="description" label="Description" />
      <Button title={projectId ? "Update Project" : "Add Project"} onPress={handleSubmit(onSubmit)} loading={loading || isSubmitting} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: colors.background,
  },
});
