"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaletteTableRule = exports.PaletteRowRule = exports.PaletteCellRule = exports.PaletteRule = void 0;
class PaletteRule {
    constructor(format, priority) {
        this.format = format;
        this.priority = priority;
    }
}
exports.PaletteRule = PaletteRule;
class PaletteCellRule extends PaletteRule {
    constructor(match, format, priority) {
        super(format, priority);
        this.match = match;
    }
}
exports.PaletteCellRule = PaletteCellRule;
class PaletteRowRule extends PaletteRule {
    constructor(match, format, priority) {
        super(format, priority);
        this.match = match;
    }
}
exports.PaletteRowRule = PaletteRowRule;
class PaletteTableRule extends PaletteRule {
    constructor(match, format, priority) {
        super(format, priority);
        this.match = match;
    }
}
exports.PaletteTableRule = PaletteTableRule;
class Palette {
    constructor(rules = [], fallback) {
        this.rules = rules;
        this.fallback = fallback;
        this.updateRules();
    }
    updateRules() {
        this.rules.sort((a, b) => (a.priority || 0) - (b.priority || 0));
    }
    formatCell(table, cell) {
        let result = `${table.value(cell.row, cell.col)}`;
        let rules = this.rules.filter((rule) => rule instanceof PaletteCellRule);
        for (let rule of rules) {
            if (rule.match(table, cell)) {
                return rule.format(result);
            }
        }
        if (this.fallback) {
            result = this.fallback(result);
        }
        return result;
    }
    formatRow(table, value, index) {
        let rules = this.rules.filter((rule) => rule instanceof PaletteRowRule);
        for (let rule of rules) {
            if (rule.match(table, value, index)) {
                return rule.format(value);
            }
        }
        return value;
    }
    formatTable(table, value) {
        let rules = this.rules.filter((rule) => rule instanceof PaletteTableRule);
        for (let rule of rules) {
            if (rule.match(table, value)) {
                return rule.format(value);
            }
        }
        return value;
    }
}
exports.default = Palette;
//# sourceMappingURL=Palette.js.map