import { Position } from 'numberkong';
import TableExt from './TableExt';
export interface TablePaletteRule {
    match: (table: TableExt, cell: Position) => boolean;
    format: (value: string) => string;
    priority?: number;
}
export default class Palette {
    rules: TablePaletteRule[];
    fallback?: ((value: string) => string) | undefined;
    constructor(rules?: TablePaletteRule[], fallback?: ((value: string) => string) | undefined);
    updateRules(): void;
    apply(table: TableExt, cell: Position): string;
}
