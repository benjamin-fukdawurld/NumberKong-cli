"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const numberkong_1 = require("numberkong");
const stream_1 = __importDefault(require("stream"));
const events_1 = __importDefault(require("events"));
class TableExt extends numberkong_1.Table {
    constructor(renderer = (table) => table.display(), colCount, values) {
        super(colCount, values);
        this.renderer = renderer;
        this._stream = new stream_1.default.Duplex({
            read: () => { },
            write: (chunk, encoding, next) => {
                chunk = chunk.toString();
                if (chunk === "show") {
                    this.stream.push("show:" + this.renderer(this) + '!');
                }
                else if (chunk === "moves") {
                    this.stream.push("moves:" + this.playableMoves.toString() + '!');
                }
                else if (chunk === "append") {
                    this.append();
                }
                else {
                    this.play(chunk);
                }
                next();
            }
        });
        this.eventEmitter = new events_1.default.EventEmitter();
        this.eventEmitter.on('played', () => {
            this.stream.push("show:" + this.renderer(this));
        });
        this.eventEmitter.on('append', () => {
            this.stream.push("show:" + this.renderer(this));
        });
    }
    play(move) {
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
    get first() {
        let col = this.values.findIndex((num) => num > 0);
        if (typeof (col) === "undefined") {
            return null;
        }
        return new numberkong_1.Position({ row: 0, col });
    }
    get last() {
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
        return new numberkong_1.Position({
            row: Math.floor(index / this.colCount),
            col: index % this.colCount
        });
    }
}
exports.default = TableExt;
//# sourceMappingURL=TableExt.js.map