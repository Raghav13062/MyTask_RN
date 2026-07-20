import React from 'react';
import { TextInput } from 'react-native-paper';
import colors from '../theme/colors';
import { StyleSheet, View, Text } from 'react-native';
import { Control, Controller } from 'react-hook-form';

interface InputProps {
  name: string;
  control: Control<any>;
  label: string;
  secureTextEntry?: boolean;
  keyboardType?: any;
}

export const Input: React.FC<InputProps> = ({ name, control, label, secureTextEntry, keyboardType }) => {
  const [isSecure, setIsSecure] = React.useState(secureTextEntry);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View style={styles.container}>
          <TextInput
            label={label}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry={isSecure}
            keyboardType={keyboardType}
            mode="outlined"
            outlineColor={colors.border}
            activeOutlineColor={colors.primary}
            style={styles.input}
            error={!!error}
            right={secureTextEntry ? <TextInput.Icon icon={isSecure ? "eye-off" : "eye"} onPress={() => setIsSecure(!isSecure)} /> : undefined}
          />
          {error && <Text style={styles.errorText}>{error.message}</Text>}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  input: {
    backgroundColor: colors.surface,
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
