import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { useRouter, useSegments, useRootNavigationState } from 'expo-router';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();
  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    if (!navigationState?.key || redirected) return;

    const currentSegment = segments[0];
    if (!currentSegment || currentSegment !== 'splash') {
      const timer = setTimeout(() => {
        router.replace('/splash');
        setRedirected(true);
      }, 0); // navigate on next tick

      return () => clearTimeout(timer);
    }
  }, [segments, router, navigationState, redirected]);

  return (
    <>
      <StatusBar style="dark" />
      <Slot />
    </>
  );
}
