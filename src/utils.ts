import {Offset} from "./types";

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
