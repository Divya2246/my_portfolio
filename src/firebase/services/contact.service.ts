import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getFirebaseDb } from '../config';

const COLLECTION = 'contactSubmissions';

export interface ContactSubmissionPayload {
  portfolioUserId: string;
  name: string;
  email: string;
  message: string;
}

/**
 * Unused Firestore writer. The contact form sends mail through Web3Forms.
 * Firestore rules: create allowed for unauthenticated; read/update/delete only when auth != null.
 */
export async function submitContactMessage(payload: ContactSubmissionPayload): Promise<void> {
  const db = getFirebaseDb();
  if (!db) throw new Error('Firebase not configured.');
  await addDoc(collection(db, COLLECTION), {
    portfolioUserId: payload.portfolioUserId,
    name: payload.name,
    email: payload.email,
    message: payload.message,
    createdAt: serverTimestamp(),
  });
}
