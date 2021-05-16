import prompts from 'prompts';
import chalk from 'chalk';
import boxen from 'boxen';

import { Position } from 'numberkong';
import TableExt from './TableExt';


import Palette, { PaletteCellRule, PaletteTableRule } from './Palette';

let rules = [
    new PaletteCellRule(
        (table: TableExt, cell: Position) => {
            let first = table.first;
            let last = table.last;
            return (cell.row === first?.row && cell.col === first?.col)
                || (cell.row === last?.row && cell.col === last?.col);
        },
        chalk.yellow,
        0
    ),
    new PaletteCellRule(
        (table: TableExt, cell: Position) => {
            let value = table.value(cell.row, cell.col);
            return value > 0;
        },
        chalk.blue,
        0
    ),
    new PaletteCellRule(
        (table: TableExt, cell: Position) => {
            let value = table.value(cell.row, cell.col);
            return value == 0;
        },
        chalk.hidden,
        -1
    ),
    new PaletteCellRule(
        (table: TableExt, cell: Position) => {
            let value = table.value(cell.row, cell.col);
            return value < 0;
        },
        (value: string) => {
            return chalk.gray(-Number.parseInt(value))
        },
        -1
    ),
    new PaletteTableRule(
        (table: TableExt, value: string) => true,
        (value: string) => {
            const boxenOptions = {
                padding: 1,
                margin: 1,
                borderColor: "green",
                backgroundColor: "#222222"
            };
            return boxen(value, boxenOptions);
        },
        -1
    )
]

export const questions: prompts.PromptObject[] = [
    {
        type: "number",
        name: "columns",
        message: "How many columns do you want?",
        initial: "9",
        validate: (columns: number | string) => {
            if (typeof columns == "string") {
                columns = Number.parseInt(columns);
            }

            return columns < 2 ? "column count must be greater than 1" : true;
        }
    },
    {
        type: "confirm",
        name: "random",
        message: "Do you want to use random numbers?"
    }
];

export const defaultPalette = new Palette(rules);
