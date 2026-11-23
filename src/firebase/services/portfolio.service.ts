import { getDoc, doc, getDocs, collection, limit, query } from 'firebase/firestore';
import { getFirebaseDb } from '../config';
import { normalizePortfolio } from '../normalizePortfolio';
import type { PortfolioData } from '../types/portfolio.types';

const COLLECTION = 'portfolios';

/**
 * Get the first portfolio from the collection (read-only, no auth required).
 * Returns data and the document ID (portfolio owner userId).
 */
export async function getFirstPortfolio(): Promise<PortfolioData | null> {
  const result = await getFirstPortfolioWithUserId();
  return result?.data ?? null;
}

/**
 * Get the first portfolio plus its document ID (portfolioUserId).
 */
export async function getFirstPortfolioWithUserId(): Promise<{
  data: PortfolioData;
  userId: string;
} | null> {
  const db = getFirebaseDb();
  if (!db) {
    throw new Error('Firebase not configured. Check REACT_APP_FIREBASE_* in .env.');
  }
  const q = query(collection(db, COLLECTION), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const firstDoc = snapshot.docs[1];
  const userId = firstDoc.id;
  const data = firstDoc.data();
  const { id: _id, updatedAt: _updatedAt, ...rest } = data;
  return { data: normalizePortfolio(rest), userId };
}

/**
 * Get portfolio for a user by ID (read-only). Kept for backwards compatibility.
 */
export async function getPortfolio(userId: string): Promise<PortfolioData | null> {
  const db = getFirebaseDb();
  if (!db) {
    throw new Error('Firebase not configured. Check REACT_APP_FIREBASE_* in .env.');
  }
  const snap = await getDoc(doc(db, COLLECTION, userId));
  if (!snap.exists()) return null;
  const data = snap.data();
  const { id: _id, updatedAt: _updatedAt, ...rest } = data;
  return normalizePortfolio(rest);
}
