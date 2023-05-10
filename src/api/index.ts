import type {
  SystemInfoWithToken,
  SystemInfoWithoutToken,
  SystemInfoResponse,
  SystemInfoResponsePartial,
} from './types';
import axios, {AxiosError} from 'axios';
import {delay, range} from "../utils";
import {SelectionNumbers, VoteErrorType} from "../types";

const instance = axios.create({
  baseURL: '/api',
  responseType: 'json',
});

export async function getSystemInfoWithoutToken(): Promise<SystemInfoWithoutToken> {
  const response = await instance.get<SystemInfoResponsePartial>('user/getinfo');
  if (!response.data.provisioned) return 'reset';
  if (!response.data.voting) return 'not-voting';
  return 'no-token';
}

const demoSystemInfo = {
  class: 'demo',
  availableLogos: range(1, 51),
  isDemo: true,
};

const isDemoToken = (token: string) => [
  'DEMO-DEMO', 'DEMO-1234', '1234-DEMO'
].includes(token.toUpperCase())

export async function getSystemInfoWithToken(token: string): Promise<SystemInfoWithToken> {
  if (isDemoToken(token)) return {
    ...demoSystemInfo,
    token,
  };

  const response = await instance.get<SystemInfoResponse>(`user/getinfo?token=${encodeURIComponent(token)}`);
  if (!response.data.provisioned) return 'reset';
  if (!response.data.voting) return 'not-voting';
  if (!response.data.found) return 'token-not-found';
  if (response.data.used) return 'token-used';
  return {
    token,
    class: response.data.class,
    availableLogos: response.data.availableLogos,
    isDemo: false,
  };
}

export async function getSystemInfo(token?: string | undefined | null) {
  if (token) return getSystemInfoWithToken(token);
  return getSystemInfoWithoutToken();
}

export async function vote(token: string, selections: SelectionNumbers): Promise<VoteErrorType | null> {
  if (isDemoToken(token)) {
    await delay(200);
    console.warn(`Voted using demo token ${token}`);
    return null;
  }

  try {
    await instance.post('/api/user/vote', {
      token,
      votes: [
        { points: 5, logo: selections.first, },
        { points: 3, logo: selections.second, },
        { points: 1, logo: selections.third, },
        { points: -1, logo: selections.negative, },
      ]
    });
    return null;
  } catch (error) {
    if (error instanceof AxiosError && error.response !== undefined) {
      const data = error.response.data as { error: string };
      if (data.error === 'NOT_PROVISIONED') return 'NOT_PROVISIONED';
      if (data.error === 'NOT_VOTING') return 'NOT_VOTING';
      if (data.error === 'INVALID_TOKEN') return 'INVALID_TOKEN';
      if (data.error === 'TOKEN_ALREADY_USED') return 'TOKEN_ALREADY_USED';
      if (data.error === 'LOGO_NOT_ALLOWED') return 'LOGO_NOT_ALLOWED';
    }
    throw error;
  }
}
