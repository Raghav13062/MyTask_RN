import React from 'react';
import { StatusBar, StatusBarStyle } from 'react-native';

interface AppStatusBarProps {
  barStyle?: StatusBarStyle;
  backgroundColor?: string;
  translucent?: boolean;
}

const AppStatusBar = ({
  barStyle = 'dark-content',
  backgroundColor = '#FFFFFF',
  translucent = false,
}: AppStatusBarProps) => {
  return (
    <StatusBar
      barStyle={barStyle}
      backgroundColor={backgroundColor}
      translucent={translucent}
    />
  );
};

export default AppStatusBar;