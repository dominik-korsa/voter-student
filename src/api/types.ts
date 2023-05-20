export interface SystemInfoResponseReset {
  provisioned: false;
  voting: false;
}

export interface SystemInfoResponseNotVoting {
  provisioned: true;
  voting: false;
}

export interface SystemInfoResponseVotingPartial {
  provisioned: true;
  voting: true;
}

export interface SystemInfoResponseCodeNotFound {
  provisioned: true;
  voting: true;
  found: false;
}

export interface SystemInfoResponseCodeFound {
  provisioned: true;
  voting: true;
  found: true;
  used: boolean;
  class: string;
  availableLogos: number[];
  forbiddenLogos: number[];
}

export type SystemInfoResponsePartial = SystemInfoResponseReset | SystemInfoResponseNotVoting | SystemInfoResponseVotingPartial;

export type SystemInfoResponse =
    SystemInfoResponseReset
    | SystemInfoResponseNotVoting
    | SystemInfoResponseCodeNotFound
    | SystemInfoResponseCodeFound;


export interface SystemInfoValid {
  token: string;
  class: string;
  availableLogos: number[];
  forbiddenLogos: number[];
  isDemo: boolean;
}

export type SystemInfoWithoutToken = 'reset' | 'not-voting' | 'no-token';

export type SystemInfoWithToken = 'reset' | 'not-voting' | 'token-not-found' | 'token-used' | SystemInfoValid;
