import { Table, Position, Move } from 'numberkong';
import Stream from 'stream'

import event from 'events';
import os from 'os';

export default class TableExt extends Table {
    private _stream: Stream.Duplex;
    private eventEmitter: event.EventEmitter;
    constructor(
        public renderer: (table: TableExt) => string = (table: TableExt) => table.display(),
        colCount?: number,
        values?: number[]
    ) {
        super(colCount, values);
        this._stream = new Stream.Duplex({
            read: () => { },
            write: (chunk, encoding, next) => {
                chunk = chunk.toString();
                if (chunk === "show") {
                    this.stream.push("show:" + this.renderer(this) + '!');
                } else if (chunk === "moves") {
                    this.stream.push("moves:" + this.playableMoves.toString() + '!');
                } else if (chunk === "append") {
                    this.append();
                } else {
                    this.play(chunk);
                }

                next();
            }
        });

        this.eventEmitter = new event.EventEmitter()
        this.eventEmitter.on('played', () => {
            this.stream.push("show:" + this.renderer(this));
        });

        this.eventEmitter.on('append', () => {
            this.stream.push("show:" + this.renderer(this));
        });
    }

    play(move: string | Move) {
        super.play(move);
        this.eventEmitter.emit('played');
    }

    append() {
        super.append();
        this.eventEmitter.emit('append');
    }

    get stream() {
        return this._stream;
    }

    get first(): Position | null {
        let col = this.values.findIndex((num) => num > 0);
        if (typeof (col) === "undefined") {
            return null;
        }

        return new Position({ row: 0, col });
    }

    get last(): Position | null {
        let index = this.values.length - 1;
        while (index >= 0) {
            if (this.values[index] > 0) {
                break;
            }

            --index;
        }

        if (index < 0) {
            return null;
        }

        return new Position({
            row: Math.floor(index / this.colCount),
            col: index % this.colCount
        });
    }
}
