import { Position } from 'numberkong';
import TableExt from './TableExt';
export declare abstract class PaletteRule {
    format: (value: string) => string;
    priority?: number | undefined;
    constructor(format: (value: string) => string, priority?: number | undefined);
}
export declare class PaletteCellRule extends PaletteRule {
    match: (table: TableExt, cell: Position) => boolean;
    constructor(match: (table: TableExt, cell: Position) => boolean, format: (value: string) => string, priority?: number);
}
export declare class PaletteRowRule extends PaletteRule {
    match: (table: TableExt, value: string, index: number) => boolean;
    constructor(match: (table: TableExt, value: string, index: number) => boolean, format: (value: string) => string, priority?: number);
}
export declare class PaletteTableRule extends PaletteRule {
    match: (table: TableExt, value: string) => boolean;
    constructor(match: (table: TableExt, value: string) => boolean, format: (value: string) => string, priority?: number);
}
export default class Palette {
    rules: PaletteRule[];
    fallback?: ((value: string) => string) | undefined;
    constructor(rules?: PaletteRule[], fallback?: ((value: string) => string) | undefined);
    updateRules(): void;
    formatCell(table: TableExt, cell: Position): string;
    formatRow(table: TableExt, value: string, index: number): string;
    formatTable(table: TableExt, value: string): string;
}
