// app/AuthGuard.tsx
import { useEffect, useState } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store';
import { login } from './store/authSlice';
import { addFavorite } from './store/favoritesSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';

export default function AuthGuard() {
  const router = useRouter();
  const segments = useSegments();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedUser = await AsyncStorage.getItem('auth');
        if (savedUser) dispatch(login(JSON.parse(savedUser)));

        const savedFavorites = await AsyncStorage.getItem('favorites');
        if (savedFavorites) {
          JSON.parse(savedFavorites).forEach((f: any) => dispatch(addFavorite(f)));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsReady(true);
      }
    };
    loadData();
  }, [dispatch]);

  useEffect(() => {
    if (!isReady) return;

    const inAuth = ['register', 'login'].includes(segments[0] || '');
    const inMain = segments[0] === '(main)';

    if (!user && !inAuth && segments[0] !== 'splash') {
      router.replace('/splash');
    } else if (user && !inMain) {
      router.replace('/(main)');
    }
  }, [user, segments, router, isReady]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return <Slot />;
}