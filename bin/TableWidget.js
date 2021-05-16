"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const numberkong_1 = require("numberkong");
class TableWidget {
    constructor(table, palette) {
        this.table = table;
        this.palette = palette;
    }
    formatCell(row, col) {
        if (!this.table) {
            throw new Error("Table is null");
        }
        return this.palette.formatCell(this.table, new numberkong_1.Position({ row, col }));
    }
    formatRow(row) {
        if (!this.table) {
            throw new Error("Table is null");
        }
        let result = "";
        for (let col = 0; col < this.table.colCount; ++col) {
            result += this.formatCell(row, col);
        }
        return this.palette.formatRow(this.table, result, row);
    }
    format() {
        if (!this.table) {
            return "";
        }
        let result = this.formatRow(0);
        for (let row = 1; row < this.table.rowCount; ++row) {
            result += "\n" + this.formatRow(row);
        }
        return this.palette.formatTable(this.table, result);
    }
    print() {
        process.stdout.write(this.format());
    }
}
exports.default = TableWidget;
//# sourceMappingURL=TableWidget.js.map