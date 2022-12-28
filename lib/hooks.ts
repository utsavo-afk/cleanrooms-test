import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, logAnalyticsEvent } from './firebase';
import { useEffect, useState } from 'react';

// lat long of client
export const useGeolocation = () => {
  const [pos, setPos] = useState<{ latitude: number; longitude: number } | null>(null);
  const [error, setError] = useState<Error | string | null>(null);
  const onChange = ({ coords }: { coords: { latitude: number; longitude: number } }) => {
    setPos({
      latitude: coords.latitude,
      longitude: coords.longitude,
    });
  };
  const onError = (error: unknown) => {
    setError((error as Error).message);
  };
  useEffect(() => {
    // client can access geolocation
    const geo = navigator.geolocation;
    if (!geo) {
      setError('Geolocation is not supported');
      return;
    }
    const watcher = geo.watchPosition(onChange, onError);
    return () => geo.clearWatch(watcher);
  }, []);
  return { ...pos, error };
};

// get auth creds from firebase
export const useAuthUser = () => {
  const [user, setUser] = useState<Partial<User> | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, authUser => {
      // Auth state changes when user logs out or in.
      // Everytime user logs in, user details will be available.
      if (authUser) {
        logAnalyticsEvent(
          'sign_up',
          { method: authUser?.isAnonymous ? 'signup_anonymous' : 'signup_google' },
          authUser?.uid
        );
        setUser({
          uid: authUser?.uid,
          displayName: authUser?.displayName,
          photoURL: authUser?.photoURL,
          isAnonymous: authUser?.isAnonymous,
        });
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return { user };
};
