import {Offset, Pos} from "./types";

export const getGlobalOffset = (el: HTMLElement): Offset => {
    const offset = { left: window.scrollX, top: window.scrollY };
    let node: HTMLElement | null = el;
    while (node) {
        offset.left += node.offsetLeft + node.scrollLeft;
        offset.top += node.offsetTop + node.scrollTop;
        node = node.offsetParent as HTMLElement | null;
    }
    return offset;
}

export const measured = <T>(label: string, cb: () =>  T): T => {
    console.time(label);
    const result = cb();
    console.timeEnd(label);
    return result;
}

export const range = (from: number, to: number) => {
    const array: number[] = [];
    for (let i = from; i < to; ++i) array.push(i);
    return array;
}

export const isInside = (el: HTMLElement, pos: Pos) => {
    const rect = el.getBoundingClientRect();
    const elementX = pos.x - rect.left;
    const elementY = pos.y - rect.top;
    return elementX >= 0 && elementX <= rect.width && elementY >= 0 && elementY <= rect.width;
}

export const delay = (timeout: number) => new Promise((resolve) => setTimeout(resolve, timeout));

export const createRandomString = (length: number, characterSet = 'abcdefghijklmnopqrstuvwxyz0123456789') => {
    let result = '';
    while (length--) {
        result += characterSet[Math.floor(Math.random() * characterSet.length)];
    }
    return result;
}
export const createRandomToken = () => {
    if (Math.random() < 0.01) return '¯\\_(ツ)_/¯';
    if (Math.random() < 0.01) return 'good-lood';
    return `${createRandomString(4)}-${createRandomString(4)}`;
};
