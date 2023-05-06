export interface Pos {
    x: number;
    y: number;
}

export interface StatePointer extends Pos {
    pointerId: number;
}

export interface CardReference {
  number: number;
  raised: boolean;
  startDrag: (getOffset: () => Offset, pointer: StatePointer) => void;
}

export interface Offset {
    left: number;
    top: number;
}
