import type {SystemInfoWithToken, SystemInfoWithoutToken, SystemInfoResponse, SystemInfoResponsePartial} from './types';
import axios from 'axios';

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

export async function getSystemInfoWithToken(token: string): Promise<SystemInfoWithToken> {
  const response = await instance.get<SystemInfoResponse>(`user/getinfo?token=${encodeURIComponent(token)}`);
  if (!response.data.provisioned) return 'reset';
  if (!response.data.voting) return 'not-voting';
  if (!response.data.found) return 'token-not-found';
  if (response.data.used) return 'token-used';
  return {
    class: response.data.class,
    availableLogos: response.data.availableLogos,
  };
}

export async function getSystemInfo(token?: string | undefined | null) {
  if (token) return getSystemInfoWithToken(token);
  return getSystemInfoWithoutToken();
}
