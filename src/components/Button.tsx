import React from 'react';
import { Button as PaperButton } from 'react-native-paper';
import colors from '../theme/colors';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native';

interface CustomButtonProps {
  mode?: 'text' | 'outlined' | 'contained';
  onPress: () => void;
  title: string;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  color?: string;
}

export const Button: React.FC<CustomButtonProps> = ({
  mode = 'contained',
  onPress,
  title,
  loading = false,
  disabled = false,
  style,
  color = colors.primary,
}) => {
  return (
    <PaperButton
      mode={mode}
      onPress={onPress}
      loading={loading}
      disabled={disabled}
      style={[styles.button, style]}
      buttonColor={mode === 'contained' ? color : undefined}
      textColor={mode === 'contained' ? colors.surface : color}
    >
      {title}
    </PaperButton>
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 8,
    borderRadius: 8,
  },
});
