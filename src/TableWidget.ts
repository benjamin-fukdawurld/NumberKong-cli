import { Position } from 'numberkong';
import TableExt from './TableExt';
import Palette from './Palette';

export default class TableWidget {
    constructor(public table: TableExt | null, public palette: Palette) { }

    formatCell(row: number, col: number): string {
        if (!this.table) {
            throw new Error("Table is null");
        }

        return this.palette.formatCell(this.table, new Position({ row, col }));
    }

    formatRow(row: number): string {
        if (!this.table) {
            throw new Error("Table is null");
        }

        let result = "";
        for (let col = 0; col < this.table.colCount; ++col) {
            result += this.formatCell(row, col);
        }

        return this.palette.formatRow(this.table, result, row);
    }

    format(): string {
        if (!this.table) {
            return "";
        }

        let result = this.formatRow(0);
        for (let row = 1; row < this.table.rowCount; ++row) {
            result += "\n" + this.formatRow(row);
        }

        return this.palette.formatTable(this.table, result);
    }


    print(): void {
        process.stdout.write(this.format());
    }
}
