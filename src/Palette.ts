import { Position } from 'numberkong';
import TableExt from './TableExt';

export abstract class PaletteRule {
    constructor(public format: (value: string) => string,
        public priority?: number) { }
}

export class PaletteCellRule extends PaletteRule {
    constructor(
        public match: (table: TableExt, cell: Position) => boolean,
        format: (value: string) => string,
        priority?: number
    ) {
        super(format, priority);
    }
}

export class PaletteRowRule extends PaletteRule {
    constructor(
        public match: (table: TableExt, value: string, index: number) => boolean,
        format: (value: string) => string,
        priority?: number
    ) {
        super(format, priority);
    }
}

export class PaletteTableRule extends PaletteRule {
    constructor(
        public match: (table: TableExt, value: string) => boolean,
        format: (value: string) => string,
        priority?: number
    ) {
        super(format, priority);
    }
}

export default class Palette {
    constructor(public rules: PaletteRule[] = [], public fallback?: (value: string) => string) {
        this.updateRules();
    }

    updateRules() {
        this.rules.sort((a: PaletteRule, b: PaletteRule) => (a.priority || 0) - (b.priority || 0))
    }

    formatCell(table: TableExt, cell: Position): string {
        let result = `${table.value(cell.row, cell.col)}`;
        let rules = this.rules.filter((rule) => rule instanceof PaletteCellRule) as PaletteCellRule[];

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

    formatRow(table: TableExt, value: string, index: number) {
        let rules = this.rules.filter((rule) => rule instanceof PaletteRowRule) as PaletteRowRule[];
        for (let rule of rules) {
            if (rule.match(table, value, index)) {
                return rule.format(value);
            }
        }

        return value;
    }

    formatTable(table: TableExt, value: string) {
        let rules = this.rules.filter((rule) => rule instanceof PaletteTableRule) as PaletteTableRule[];
        for (let rule of rules) {
            if (rule.match(table, value)) {
                return rule.format(value);
            }
        }

        return value;
    }
}
