import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "../../utils/firebase";

export const createHabit = async (
  userId: string,
  habit: { name: string; goal: number }
) => {
  const docRef = await addDoc(collection(db, "habits"), {
    ...habit,
    userId,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const getHabits = async (userId: string) => {
  const q = query(collection(db, "habits"), where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as { name: string; goal: number; userId: string}) }));
};
