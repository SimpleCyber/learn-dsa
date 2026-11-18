export interface LeetCodeProfileResponse {
  username: string;
  githubUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  profile?: {
    userAvatar?: string;
    realName?: string;
    ranking?: number;
    reputation?: number;
    solutionCount?: number;
  };
  submitStats?: {
    acSubmissionNum?: Array<{ difficulty: string; count: number; submissions: number }>;
  };
}

export interface LeetCodeSubmissionItem {
  id?: string;
  title: string;
  titleSlug?: string;
  statusDisplay?: string;
  status?: number;
  timestamp: string | number;
  lang?: string;
}

const LEETCODE_API_BASE = 'https://leetcode-api-pied.vercel.app';

/**
 * Fetch public user profile and stats from LeetCode API
 */
export async function fetchUserProfile(username: string): Promise<LeetCodeProfileResponse> {
  const clean = (username || '').trim();
  if (!clean) throw new Error('Username is required');

  const res = await fetch(`${LEETCODE_API_BASE}/user/${clean}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch user "${clean}" (${res.status})`);
  }
  return res.json();
}

/**
 * Fetch recent submissions for a user (up to limit)
 */
export async function fetchUserSubmissions(
  username: string,
  limit: number = 100
): Promise<LeetCodeSubmissionItem[]> {
  const clean = (username || '').trim();
  if (!clean) throw new Error('Username is required');

  const res = await fetch(`${LEETCODE_API_BASE}/user/${clean}/submissions?limit=${limit}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch submissions for "${clean}" (${res.status})`);
  }

  const parsed = await res.json();
  return Array.isArray(parsed) ? parsed : parsed.submission || [];
}
