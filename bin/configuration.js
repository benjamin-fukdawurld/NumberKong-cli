"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultPalette = exports.questions = void 0;
const chalk_1 = __importDefault(require("chalk"));
const boxen_1 = __importDefault(require("boxen"));
const Palette_1 = __importStar(require("./Palette"));
let rules = [
    new Palette_1.PaletteCellRule((table, cell) => {
        let first = table.first;
        let last = table.last;
        return (cell.row === first?.row && cell.col === first?.col)
            || (cell.row === last?.row && cell.col === last?.col);
    }, chalk_1.default.yellow, 0),
    new Palette_1.PaletteCellRule((table, cell) => {
        let value = table.value(cell.row, cell.col);
        return value > 0;
    }, chalk_1.default.blue, 0),
    new Palette_1.PaletteCellRule((table, cell) => {
        let value = table.value(cell.row, cell.col);
        return value == 0;
    }, chalk_1.default.hidden, -1),
    new Palette_1.PaletteCellRule((table, cell) => {
        let value = table.value(cell.row, cell.col);
        return value < 0;
    }, (value) => {
        return chalk_1.default.gray(-Number.parseInt(value));
    }, -1),
    new Palette_1.PaletteTableRule((table, value) => true, (value) => {
        const boxenOptions = {
            padding: 1,
            margin: 1,
            borderColor: "green",
            backgroundColor: "#222222"
        };
        return boxen_1.default(value, boxenOptions);
    }, -1)
];
exports.questions = [
    {
        type: "number",
        name: "columns",
        message: "How many columns do you want?",
        initial: "9",
        validate: (columns) => {
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
exports.defaultPalette = new Palette_1.default(rules);
//# sourceMappingURL=configuration.js.map