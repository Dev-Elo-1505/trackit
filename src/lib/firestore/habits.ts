import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
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
    completedDates: [],
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const getHabits = async (userId: string) => {
  const q = query(collection(db, "habits"), where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as { name: string; goal: number; userId: string, completedDates?: string[]}),
  }));
};

export const updateHabit = async (
  userId: string,
  habitId: string,
  dateISO: string
) => {
  const habitRef = doc(db, "habits", habitId);
console.log(userId)
  // Check if the date already exists in completedDates
  const habitDoc = await getDoc(habitRef);
  const habitData = habitDoc.data();
  const completedDates = habitData?.completedDates || [];

  if (completedDates.includes(dateISO)) {
    // Date exists, remove it
    await updateDoc(habitRef, {
      completedDates: arrayRemove(dateISO),
    });
  } else {
    // Date doesn't exist, add it
    await updateDoc(habitRef, {
      completedDates: arrayUnion(dateISO),
    });
  }
};

export const deleteHabit = async (userId: string, habitId: string) => {
  console.log(userId)
  await deleteDoc(doc(db, "habits", habitId));

}

export const updateHabitDetails = async (habitId: string, updates: { name?: string; goal?: number }) => {
  const habitRef = doc(db, "habits", habitId);
  await updateDoc(habitRef, updates);
}
