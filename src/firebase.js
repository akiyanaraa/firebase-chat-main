import { initializeApp } from "firebase/app";
import { updateProfile } from "firebase/auth";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "firebase/auth";

import {
  addDoc,
  collection,
  getFirestore,
  limit,
  orderBy,
  query,
  onSnapshot
} from "firebase/firestore";

import Filter from "bad-words";
import { computed, onUnmounted, ref } from "vue";

// Firebase config
const firebase = initializeApp({
  apiKey: "AIzaSyD7dJoey91oxTNXajS2SL0ciah2DOkbiOI",
  authDomain: "chatproj-15489.firebaseapp.com",
  projectId: "chatproj-15489",
  storageBucket: "chatproj-15489.firebasestorage.app",
  messagingSenderId: "567749105680",
  appId: "1:567749105680:web:674f27f2977746a3659295",
  measurementId: "G-6P67RJYP2V"
});

// Auth & Firestore
const auth = getAuth(firebase);
const db = getFirestore(firebase);

// 🔐 AUTH COMPOSITION
export function useAuth() {
  const user = ref(null);

  const unsubscribe = onAuthStateChanged(auth, (_user) => {
    user.value = _user;
  });
  onUnmounted(unsubscribe);

  const isLogin = computed(() => user.value !== null);

  const loginWithEmail = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const registerWithEmail = async (email, password, nickname) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Сохраняем nickname в профиле
    await updateProfile(user, {
      displayName: nickname
    });
  };

  const logOut = async () => {
    await signOut(auth);
    user.value = null;
  };

  return {
    user,
    isLogin,
    loginWithEmail,
    registerWithEmail,
    logOut
  };
}

// 💬 CHAT COMPOSITION
function isEnglish(text) {
  return /^[\x00-\x7F]*$/.test(text);
}

export function useChat() {
  const messages = ref([]);
  const filter = new Filter(); // Фильтр для нецензурных слов
  const { isLogin, user } = useAuth();

  // Отправка сообщения
  const sendMessage = async (text) => {
    if (!isLogin.value || !text || text.trim().length === 0) return;

    // Отключение фильтрации на время
    const cleanedText = text.trim();  // Убираем фильтрацию

    console.log("Текст перед отправкой:", cleanedText); // Логируем текст

    const { uid, photoURL, displayName } = user.value;

    // Сохраняем сообщение в Firestore
    await addDoc(collection(db, "messages"), {
      text: cleanedText,
      createdAt: new Date(),
      uid,
      photoURL,
      displayName
    });
  };

  const q = query(
    collection(db, "messages"),
    orderBy("createdAt", "desc"),
    limit(100)
  );

  // Прослушивание сообщений в чате
  onSnapshot(q, (querySnapshot) => {
    const loadedMessages = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id
    }));

    messages.value = loadedMessages;
  });

  return { messages, sendMessage };
}
