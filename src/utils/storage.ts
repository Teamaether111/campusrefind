import { CampusItem, Claim, NotificationItem, CampusActivity } from '../types';
import { INITIAL_ITEMS, INITIAL_ACTIVITIES, INITIAL_NOTIFICATIONS } from '../data/mockData';

const STORAGE_KEYS = {
  ITEMS: 'refind_campus_items_v2',
  CLAIMS: 'refind_campus_claims_v2',
  NOTIFICATIONS: 'refind_campus_notifications_v2',
  ACTIVITIES: 'refind_campus_activities_v2',
  USER_PROFILE: 'refind_campus_user_v2',
};

export interface UserProfile {
  name: string;
  email: string;
  rollNo: string;
  department: string;
  semester: string;
  phone: string;
  campusRole: string;
  avatarUrl?: string;
  trustScore: number;
}

export const DEFAULT_USER: UserProfile = {
  name: 'Yash Sharma',
  email: 'yr1810007@gmail.com',
  rollNo: '2023CSB1042',
  department: 'Computer Science & Engineering',
  semester: '6th Semester',
  phone: '+91 98765 43210',
  campusRole: 'Student Resident · Hall 4',
  trustScore: 98,
};

// Initial default claim for testing claim approval / status tracking
const INITIAL_CLAIMS: Claim[] = [
  {
    id: 'claim-sample-1',
    itemId: 'item-found-1',
    itemTitle: 'Scientific Calculator fx-991EX ClassWiz',
    itemType: 'found',
    itemImageUrl: '/src/assets/images/item_casio_calculator_1794074127715.jpg',
    claimantName: 'Yash Sharma',
    claimantEmail: 'yr1810007@gmail.com',
    claimantRollNo: '2023CSB1042',
    claimantPhone: '+91 98765 43210',
    status: 'Under Review',
    answers: [
      {
        questionId: 'q1',
        question: 'What is written or carved inside the battery compartment or slide cover?',
        userAnswer: 'Initials "YS" lightly scratched with a geometric compass inside the battery clip.',
      },
      {
        questionId: 'q2',
        question: 'What calculation or contrast mode was the display left on?',
        userAnswer: 'Standard Degree MathIO mode with matrix calculation menu.',
      },
    ],
    additionalProof: 'I have my receipt from the campus stationery store and mid-term exam desk pass.',
    submittedAt: '2026-11-06T11:00:00Z',
    handoverLocation: 'Central Security Post (Gate 1) - Desk Officer Rao',
    reviewerNotes: 'Verification answers match finder private notes. Waiting for physical student ID inspection at Gate 1.',
  },
];

export function getStoredItems(): CampusItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ITEMS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(INITIAL_ITEMS));
      return INITIAL_ITEMS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ITEMS;
  }
}

export function saveStoredItems(items: CampusItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save items to storage', e);
  }
}

export function getStoredClaims(): Claim[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CLAIMS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CLAIMS, JSON.stringify(INITIAL_CLAIMS));
      return INITIAL_CLAIMS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_CLAIMS;
  }
}

export function saveStoredClaims(claims: Claim[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CLAIMS, JSON.stringify(claims));
  } catch (e) {
    console.error('Failed to save claims to storage', e);
  }
}

export function getStoredNotifications(): NotificationItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_NOTIFICATIONS;
  }
}

export function saveStoredNotifications(notifs: NotificationItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  } catch (e) {
    console.error('Failed to save notifications', e);
  }
}

export function getStoredActivities(): CampusActivity[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(INITIAL_ACTIVITIES));
      return INITIAL_ACTIVITIES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ACTIVITIES;
  }
}

export function saveStoredActivities(activities: CampusActivity[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  } catch (e) {
    console.error('Failed to save activities', e);
  }
}

export function getStoredUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(DEFAULT_USER));
      return DEFAULT_USER;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_USER;
  }
}

export function saveStoredUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save user profile', e);
  }
}

export function resetDemoData(): void {
  localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(INITIAL_ITEMS));
  localStorage.setItem(STORAGE_KEYS.CLAIMS, JSON.stringify(INITIAL_CLAIMS));
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
  localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(INITIAL_ACTIVITIES));
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(DEFAULT_USER));
}
