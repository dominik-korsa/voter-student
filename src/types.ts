export interface Pos {
    x: number;
    y: number;
}

export interface StatePointer extends Pos {
    pointerId: number;
}

export const slotNames = ['first', 'second', 'third', 'negative'] as const;
export type SlotName = typeof slotNames[number];

export interface CardReference {
  number: number;
  raised: boolean;
  startDrag: (getOffset: () => Offset, pointer: StatePointer) => void;
  reset: (offset: Offset) => void;
}

export interface Offset {
    left: number;
    top: number;
}

export type LoadingErrorType = 'token-not-found' | 'token-used' | 'other-error';
