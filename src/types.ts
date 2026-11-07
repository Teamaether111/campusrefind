export type ItemStatus = 'lost' | 'found' | 'claimed' | 'recovered';

export type Category = 
  | 'Electronics'
  | 'Student ID Cards'
  | 'Books & Notebooks'
  | 'Stationery'
  | 'Bags'
  | 'Accessories'
  | 'Personal Belongings';

export type CampusBuildingId = 
  | 'library'
  | 'main_building'
  | 'canteen'
  | 'computer_labs'
  | 'auditorium'
  | 'sports_complex'
  | 'hostel_blocks'
  | 'security_gate1';

export interface CampusLocation {
  id: CampusBuildingId;
  name: string;
  zone: string;
  description: string;
  x: number; // percentage on map (0-100)
  y: number; // percentage on map (0-100)
  iconName: string;
}

export interface VerificationQuestion {
  id: string;
  question: string;
  hint?: string;
  privateAnswer?: string; // Only visible to reporter/finder, never claimant
}

export interface CampusItem {
  id: string;
  type: 'lost' | 'found';
  title: string;
  category: Category;
  description: string;
  locationId: CampusBuildingId;
  locationDetail: string;
  date: string; // ISO date format YYYY-MM-DD
  imageUrl: string;
  reporterName: string;
  reporterEmail: string;
  reporterRollNo?: string;
  status: ItemStatus;
  createdAt: string;
  // Verification info
  verificationQuestions?: VerificationQuestion[];
  privateClues?: string; // For lost items (e.g., hidden sticker, scratch, specific content inside)
  isUserItem?: boolean; // If reported by current logged-in user Yash
}

export interface MatchReason {
  label: string;
  score: number;
  explanation: string;
  type: 'category' | 'title' | 'location' | 'date' | 'tags';
}

export interface SmartMatchPair {
  id: string;
  lostItem: CampusItem;
  foundItem: CampusItem;
  totalScore: number; // 0 - 100
  reasons: MatchReason[];
  status: 'new' | 'reviewed' | 'claimed' | 'dismissed';
}

export type ClaimStatus = 'Pending' | 'Under Review' | 'Approved' | 'Rejected' | 'Recovered';

export interface ClaimVerificationResponse {
  questionId: string;
  question: string;
  userAnswer: string;
}

export interface Claim {
  id: string;
  itemId: string;
  itemTitle: string;
  itemType: 'lost' | 'found';
  itemImageUrl: string;
  claimantName: string;
  claimantEmail: string;
  claimantRollNo: string;
  claimantPhone: string;
  status: ClaimStatus;
  answers: ClaimVerificationResponse[];
  additionalProof?: string;
  submittedAt: string;
  handoverLocation?: string;
  reviewerNotes?: string;
}

export interface CampusActivity {
  id: string;
  itemTitle: string;
  category: Category;
  location: string;
  timestamp: string;
  action: 'recovered' | 'reported_lost' | 'reported_found' | 'smart_matched';
  badge: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'match' | 'claim' | 'system' | 'recovery';
  targetTab?: 'matches' | 'explore' | 'profile';
  targetItemId?: string;
}
