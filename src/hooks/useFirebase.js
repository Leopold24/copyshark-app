import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const useFirebase = (firebaseConfig, initialAuthToken) => {
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    try {
      const app = initializeApp(firebaseConfig);
      const firestore = getFirestore(app);
      const firebaseAuth = getAuth(app);

      setDb(firestore);
      setAuth(firebaseAuth);

      const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
        if (user) {
          setUserId(user.uid);
        } else {
          if (!initialAuthToken) {
            try {
              const anonUser = await signInAnonymously(firebaseAuth);
              setUserId(anonUser.user.uid);
            } catch (error) {
              console.error("Error signing in anonymously:", error);
            }
          }
        }
        setIsAuthReady(true);
      });

      const signIn = async () => {
        if (initialAuthToken) {
          try {
            await signInWithCustomToken(firebaseAuth, initialAuthToken);
          } catch (error) {
            console.error("Error signing in with custom token:", error);
            try {
              const anonUser = await signInAnonymously(firebaseAuth);
              setUserId(anonUser.user.uid);
            } catch (anonError) {
              console.error("Error signing in anonymously after custom token failure:", anonError);
            }
          }
        }
      };
      signIn();

      return () => unsubscribe();
    } catch (error) {
      console.error("Error initializing Firebase:", error);
    }
  }, [firebaseConfig, initialAuthToken]);

  return { db, auth, userId, isAuthReady };
};
