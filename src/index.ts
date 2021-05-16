#!/usr/bin/env node

import prompts from 'prompts';
import chalk from 'chalk';

import { Position, Move } from 'numberkong';
import TableExt from './TableExt';


import { PaletteCellRule } from './Palette';
import TableWidget from './TableWidget';

import { questions, defaultPalette } from './configuration';

import readline from 'readline';
import ansi from 'ansi-escape-sequences';

function parseMoves(str: string): Move[] {
    if (!str) {
        return [];
    }

    let result: Move[] = [];
    let moves = str.split(',');
    for (let move of moves) {
        result.push(Move.fromString(move));
    }

    return result;
}

function formatMoves(moves: Move[], selectedIndex?: number): string {
    let result = "";

    moves.forEach((move, index) => {
        if (typeof selectedIndex !== "undefined" && index === selectedIndex) {
            result += chalk.red.bold(move.toString()) + " ";
        } else {
            result += chalk.blue(move.toString()) + " ";
        }
    });

    return result;
}

function printMoves(moves: Move[], selectedIndex?: number, erasePrevious?: boolean) {
    if (erasePrevious) {
        process.stdout.write(ansi.erase.inLine(2));
        process.stdout.write(ansi.cursor.horizontalAbsolute(0));
    }
    process.stdout.write(formatMoves(moves, selectedIndex));
}

async function run() {
    const config = await prompts(questions);
    let table = new TableExt();
    let moves: Move[] = [];
    let selectedMoveIndex = 0;
    table.stream.on('readable', () => {
        let msgs = table.stream.read().toString().split('!');
        for (let msg of msgs) {
            let [header, body] = msg.split(':');
            if (header === "show") {
                console.log(body);
                table.stream.write("moves");
            } else if (header === "moves") {
                moves = parseMoves(body);
                printMoves(moves, selectedMoveIndex);
                process.stdout.write(ansi.cursor.previousLine(1));
            } else {
                console.log(msg);
            }
        }
    });

    table.init(config.columns);
    let printer = new TableWidget(table, defaultPalette)
    table.renderer = (table) => {
        process.stdout.write(ansi.erase.display(2));
        return printer.format()
    };

    defaultPalette.rules.push(new PaletteCellRule(
        (table: TableExt, cell: Position) => {
            let name = cell.toString();
            let moves = table.playableMoves;
            return moves.length > 0 &&
                (name === moves[selectedMoveIndex]?.positions[0].toString()
                    || name === moves[selectedMoveIndex]?.positions[1].toString());
        },
        chalk.red,
        -1
    ));
    defaultPalette.updateRules();

    table.stream.write("show");
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('keypress', (str, key) => {
        if (key.ctrl && key.name === 'c') {
            process.stdout.write("\n");
            process.exit();
        } else if (key.name === 'a') {
            table.stream.write("append");
            selectedMoveIndex = 0;
        } else if (moves.length > 0) {
            if (key.name === 'right') {
                ++selectedMoveIndex;
                selectedMoveIndex %= moves.length;
                process.stdout.write(ansi.erase.display(2));
                printer.print()
                printMoves(moves, selectedMoveIndex);
            } else if (key.name === 'left') {
                --selectedMoveIndex;
                if (selectedMoveIndex < 0) {
                    selectedMoveIndex = moves.length - 1;;
                }
                process.stdout.write(ansi.erase.display(2));
                printer.print()
                printMoves(moves, selectedMoveIndex);
            } else if (key.name === "return") {
                table.stream.write(moves[selectedMoveIndex].toString());
                selectedMoveIndex = 0;
            }
        }
    });
}

run();
