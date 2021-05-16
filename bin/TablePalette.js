"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Palette {
    constructor(rules = [], fallback) {
        this.rules = rules;
        this.fallback = fallback;
        this.updateRules();
    }
    updateRules() {
        this.rules.sort((a, b) => (a.priority || 0) - (b.priority || 0));
    }
    apply(table, cell) {
        let result = `${table.value(cell.row, cell.col)}`;
        for (let rule of this.rules) {
            if (rule.match(table, cell)) {
                return rule.format(result);
            }
        }
        if (this.fallback) {
            result = this.fallback(result);
        }
        return result;
    }
}
exports.default = Palette;
//# sourceMappingURL=TablePalette.js.map