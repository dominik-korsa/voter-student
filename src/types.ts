export interface PodiumHovered {
    index: number;
    slot: HTMLDivElement;
}

export interface StatePointer {
    pointerId: number;
    x: number;
    y: number;
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
