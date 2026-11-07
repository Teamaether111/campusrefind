import { CampusItem, SmartMatchPair, MatchReason } from '../types';

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'the', 'or', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
  'from', 'my', 'is', 'it', 'has', 'near', 'found', 'lost', 'left', 'behind',
  'desk', 'floor', 'hall', 'room', 'block', 'table'
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 1 && !STOP_WORDS.has(token));
}

function calculateTokenSimilarity(tokensA: string[], tokensB: string[]): { score: number; common: string[] } {
  if (tokensA.length === 0 || tokensB.length === 0) return { score: 0, common: [] };
  
  const setA = new Set(tokensA);
  const common = Array.from(new Set(tokensB.filter(t => setA.has(t))));
  
  // Also check substring matches (e.g. 'airpod' vs 'airpods')
  const matchedTokens = new Set(common);
  for (const a of tokensA) {
    for (const b of tokensB) {
      if (!matchedTokens.has(a) && !matchedTokens.has(b)) {
        if ((a.length >= 4 && b.includes(a)) || (b.length >= 4 && a.includes(b))) {
          matchedTokens.add(a);
          matchedTokens.add(b);
          common.push(`${a}≈${b}`);
        }
      }
    }
  }

  const unionSize = new Set([...tokensA, ...tokensB]).size;
  const ratio = common.length / Math.max(1, Math.min(tokensA.length, tokensB.length));
  return { score: Math.min(1, ratio), common };
}

function calculateDateDifferenceInDays(dateStr1: string, dateStr2: string): number {
  try {
    const d1 = new Date(dateStr1).getTime();
    const d2 = new Date(dateStr2).getTime();
    const diffMs = Math.abs(d1 - d2);
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  } catch {
    return 30;
  }
}

/**
 * Transparent, deterministic rule-based matching engine
 * Compares a lost item and a found item and returns a scored match breakdown.
 */
export function compareLostAndFound(lost: CampusItem, found: CampusItem): SmartMatchPair | null {
  // Can only match lost with found
  if (lost.type !== 'lost' || found.type !== 'found') return null;

  const reasons: MatchReason[] = [];
  let totalScore = 0;

  // 1. Category check (Max: 30%)
  if (lost.category === found.category) {
    const categoryScore = 30;
    totalScore += categoryScore;
    reasons.push({
      type: 'category',
      score: categoryScore,
      label: 'Category Match',
      explanation: `Both items classified as ${lost.category}.`,
    });
  } else {
    // Cross-category penalty or partial for Electronics/Accessories
    if (
      (lost.category === 'Electronics' && found.category === 'Accessories') ||
      (lost.category === 'Accessories' && found.category === 'Electronics') ||
      (lost.category === 'Stationery' && found.category === 'Books & Notebooks')
    ) {
      const partialCatScore = 12;
      totalScore += partialCatScore;
      reasons.push({
        type: 'category',
        score: partialCatScore,
        label: 'Related Category',
        explanation: `Categories ${lost.category} and ${found.category} frequently overlap.`,
      });
    }
  }

  // 2. Title & Description Keyword Match (Max: 40%)
  const lostTokens = [...tokenize(lost.title), ...tokenize(lost.description)];
  const foundTokens = [...tokenize(found.title), ...tokenize(found.description)];
  
  const titleTokensLost = tokenize(lost.title);
  const titleTokensFound = tokenize(found.title);
  const titleSim = calculateTokenSimilarity(titleTokensLost, titleTokensFound);
  const fullSim = calculateTokenSimilarity(lostTokens, foundTokens);

  // High weight to title match
  const keywordScore = Math.round((titleSim.score * 0.7 + fullSim.score * 0.3) * 40);
  if (keywordScore > 5) {
    totalScore += keywordScore;
    const highlightWords = titleSim.common.length > 0 ? titleSim.common : fullSim.common;
    reasons.push({
      type: 'title',
      score: keywordScore,
      label: 'Keyword Alignment',
      explanation: `Matched identifiers: "${highlightWords.slice(0, 4).join(', ')}".`,
    });
  }

  // 3. Location Proximity (Max: 20%)
  if (lost.locationId === found.locationId) {
    const locScore = 20;
    totalScore += locScore;
    reasons.push({
      type: 'location',
      score: locScore,
      label: 'Campus Location Match',
      explanation: `Both reported at the same campus zone: ${lost.locationDetail.split(',')[0]}.`,
    });
  } else {
    // Check if location text has overlapping building names
    const lostLocTokens = tokenize(lost.locationDetail);
    const foundLocTokens = tokenize(found.locationDetail);
    const locSim = calculateTokenSimilarity(lostLocTokens, foundLocTokens);
    if (locSim.score > 0.2) {
      const locScore = Math.round(locSim.score * 15);
      totalScore += locScore;
      reasons.push({
        type: 'location',
        score: locScore,
        label: 'Nearby Location Area',
        explanation: `Proximity detected in location details (${locSim.common.join(', ')}).`,
      });
    }
  }

  // 4. Date Proximity (Max: 10%)
  const daysDiff = calculateDateDifferenceInDays(lost.date, found.date);
  if (daysDiff === 0) {
    const dateScore = 10;
    totalScore += dateScore;
    reasons.push({
      type: 'date',
      score: dateScore,
      label: 'Exact Date Alignment',
      explanation: `Both lost and discovered on the exact same date (${lost.date}).`,
    });
  } else if (daysDiff <= 2) {
    const dateScore = 8;
    totalScore += dateScore;
    reasons.push({
      type: 'date',
      score: dateScore,
      label: 'Close Date Proximity',
      explanation: `Discovered within ${daysDiff} day${daysDiff > 1 ? 's' : ''} of report.`,
    });
  } else if (daysDiff <= 5) {
    const dateScore = 5;
    totalScore += dateScore;
    reasons.push({
      type: 'date',
      score: dateScore,
      label: 'Reporting Date Window',
      explanation: `Within ${daysDiff} days reporting window.`,
    });
  }

  // Minimum threshold for a SmartMatch
  if (totalScore < 40) return null;

  // Cap at 98% (reserving 100% strictly for verified claim recovery)
  const finalScore = Math.min(98, totalScore);

  return {
    id: `match-${lost.id}-${found.id}`,
    lostItem: lost,
    foundItem: found,
    totalScore: finalScore,
    reasons,
    status: 'new',
  };
}

/**
 * Computes all SmartMatch pairs across current items list.
 */
export function computeAllSmartMatches(items: CampusItem[]): SmartMatchPair[] {
  const lostItems = items.filter(i => i.type === 'lost' && i.status !== 'recovered');
  const foundItems = items.filter(i => i.type === 'found' && i.status !== 'recovered');

  const matches: SmartMatchPair[] = [];

  for (const lost of lostItems) {
    for (const found of foundItems) {
      const match = compareLostAndFound(lost, found);
      if (match) {
        matches.push(match);
      }
    }
  }

  // Sort highest score first
  return matches.sort((a, b) => b.totalScore - a.totalScore);
}
