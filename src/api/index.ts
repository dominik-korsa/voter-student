import type {
  SystemInfoWithToken,
  SystemInfoWithoutToken,
  SystemInfoResponse,
  SystemInfoResponsePartial,
  SystemInfoValid
} from './types';
import axios from 'axios';
import {range} from "../utils";

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

const demoSystemInfo: SystemInfoValid = {
  class: 'demo',
  availableLogos: range(1, 51),
};

export async function getSystemInfoWithToken(token: string): Promise<SystemInfoWithToken> {
  if (['DEMO-DEMO', 'DEMO-1234', '1234-DEMO'].includes(token.toUpperCase())) return demoSystemInfo;

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
