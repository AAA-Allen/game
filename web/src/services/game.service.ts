import { api } from "@/services/api";
import type {
  ApiResponse,
  LeaderboardEntry,
  Level,
  ProgressData,
  SkillTreeData,
  SubmissionResult,
  UserProfile,
  Zone,
} from "@/types/api";

export async function getZones() {
  const response = await api.get<ApiResponse<Zone[]>>("/zones");
  return response.data.data;
}

export async function getLevels(zoneId?: string) {
  const response = await api.get<ApiResponse<Level[]>>("/levels", {
    params: zoneId ? { zoneId } : undefined,
  });
  return response.data.data;
}

export async function getLevelById(levelId: string) {
  const response = await api.get<ApiResponse<Level>>(`/levels/${levelId}`);
  return response.data.data;
}

export async function getProgress() {
  const response = await api.get<ApiResponse<ProgressData>>("/progress/current");
  return response.data.data;
}

export async function submitLevel(payload: {
  levelId: string;
  html: string;
  css: string;
  javascript: string;
}) {
  const response = await api.post<ApiResponse<SubmissionResult>>(
    "/submissions",
    payload,
  );
  return response.data.data;
}

export async function getLeaderboard() {
  const response = await api.get<ApiResponse<LeaderboardEntry[]>>("/users/leaderboard");
  return response.data.data;
}

export async function getProfileDetail() {
  const response = await api.get<ApiResponse<UserProfile>>("/users/profile/detail");
  return response.data.data;
}

export async function getSkillTree() {
  const response = await api.get<ApiResponse<SkillTreeData>>("/users/skill-tree");
  return response.data.data;
}
