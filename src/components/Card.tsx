import React from 'react';
import { Card as PaperCard, Title, Paragraph } from 'react-native-paper';
import { StyleSheet, ViewStyle, StyleProp } from 'react-native';
import colors from '../theme/colors';

interface CustomCardProps {
  title: string;
  subtitle?: string;
  content?: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  action?: React.ReactNode;
}

export const Card: React.FC<CustomCardProps> = ({ title, subtitle, content, onPress, style, action }) => {
  return (
    <PaperCard style={[styles.card, style]} onPress={onPress}>
      <PaperCard.Title title={title} subtitle={subtitle} right={() => action} />
      {content && (
        <PaperCard.Content>
          {content}
        </PaperCard.Content>
      )}
    </PaperCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    backgroundColor: colors.card,
    borderRadius: 12,
    elevation: 3,
  },
});
