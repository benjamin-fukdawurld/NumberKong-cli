import TableExt from './TableExt';
import Palette from './Palette';
export default class TableWidget {
    table: TableExt | null;
    palette: Palette;
    constructor(table: TableExt | null, palette: Palette);
    formatCell(row: number, col: number): string;
    formatRow(row: number): string;
    format(): string;
    print(): void;
}
