#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prompts_1 = __importDefault(require("prompts"));
const chalk_1 = __importDefault(require("chalk"));
const numberkong_1 = require("numberkong");
const TableExt_1 = __importDefault(require("./TableExt"));
const Palette_1 = require("./Palette");
const TableWidget_1 = __importDefault(require("./TableWidget"));
const configuration_1 = require("./configuration");
const readline_1 = __importDefault(require("readline"));
const ansi_escape_sequences_1 = __importDefault(require("ansi-escape-sequences"));
function parseMoves(str) {
    if (!str) {
        return [];
    }
    let result = [];
    let moves = str.split(',');
    for (let move of moves) {
        result.push(numberkong_1.Move.fromString(move));
    }
    return result;
}
function formatMoves(moves, selectedIndex) {
    let result = "";
    moves.forEach((move, index) => {
        if (typeof selectedIndex !== "undefined" && index === selectedIndex) {
            result += chalk_1.default.red.bold(move.toString()) + " ";
        }
        else {
            result += chalk_1.default.blue(move.toString()) + " ";
        }
    });
    return result;
}
function printMoves(moves, selectedIndex, erasePrevious) {
    if (erasePrevious) {
        process.stdout.write(ansi_escape_sequences_1.default.erase.inLine(2));
        process.stdout.write(ansi_escape_sequences_1.default.cursor.horizontalAbsolute(0));
    }
    process.stdout.write(formatMoves(moves, selectedIndex));
}
async function run() {
    const config = await prompts_1.default(configuration_1.questions);
    let table = new TableExt_1.default();
    let moves = [];
    let selectedMoveIndex = 0;
    table.stream.on('readable', () => {
        let msgs = table.stream.read().toString().split('!');
        for (let msg of msgs) {
            let [header, body] = msg.split(':');
            if (header === "show") {
                console.log(body);
                table.stream.write("moves");
            }
            else if (header === "moves") {
                moves = parseMoves(body);
                printMoves(moves, selectedMoveIndex);
                process.stdout.write(ansi_escape_sequences_1.default.cursor.previousLine(1));
            }
            else {
                console.log(msg);
            }
        }
    });
    table.init(config.columns);
    let printer = new TableWidget_1.default(table, configuration_1.defaultPalette);
    table.renderer = (table) => {
        process.stdout.write(ansi_escape_sequences_1.default.erase.display(2));
        return printer.format();
    };
    configuration_1.defaultPalette.rules.push(new Palette_1.PaletteCellRule((table, cell) => {
        let name = cell.toString();
        let moves = table.playableMoves;
        return moves.length > 0 &&
            (name === moves[selectedMoveIndex]?.positions[0].toString()
                || name === moves[selectedMoveIndex]?.positions[1].toString());
    }, chalk_1.default.red, -1));
    configuration_1.defaultPalette.updateRules();
    table.stream.write("show");
    readline_1.default.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('keypress', (str, key) => {
        if (key.ctrl && key.name === 'c') {
            process.stdout.write("\n");
            process.exit();
        }
        else if (key.name === 'a') {
            table.stream.write("append");
            selectedMoveIndex = 0;
        }
        else if (moves.length > 0) {
            if (key.name === 'right') {
                ++selectedMoveIndex;
                selectedMoveIndex %= moves.length;
                process.stdout.write(ansi_escape_sequences_1.default.erase.display(2));
                printer.print();
                printMoves(moves, selectedMoveIndex);
            }
            else if (key.name === 'left') {
                --selectedMoveIndex;
                if (selectedMoveIndex < 0) {
                    selectedMoveIndex = moves.length - 1;
                    ;
                }
                process.stdout.write(ansi_escape_sequences_1.default.erase.display(2));
                printer.print();
                printMoves(moves, selectedMoveIndex);
            }
            else if (key.name === "return") {
                table.stream.write(moves[selectedMoveIndex].toString());
                selectedMoveIndex = 0;
            }
        }
    });
}
run();
//# sourceMappingURL=index.js.map