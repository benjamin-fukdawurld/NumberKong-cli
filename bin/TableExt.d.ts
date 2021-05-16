/// <reference types="node" />
import { Table, Position, Move } from 'numberkong';
import Stream from 'stream';
export default class TableExt extends Table {
    renderer: (table: TableExt) => string;
    private _stream;
    private eventEmitter;
    constructor(renderer?: (table: TableExt) => string, colCount?: number, values?: number[]);
    play(move: string | Move): void;
    append(): void;
    get stream(): Stream.Duplex;
    get first(): Position | null;
    get last(): Position | null;
}
