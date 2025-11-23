// app/_layout.tsx
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from './context/ThemeContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <StatusBar style="light" />
      <Slot />
    </ThemeProvider>
  );
}