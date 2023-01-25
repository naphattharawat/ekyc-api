import * as Knex from 'knex';
export class KnexExtendModel {

    async onDuplicate(db, tableName, data, columns, id = null) {
        const rows = Array.isArray(data) ? data : [data];
        const sql = db(tableName)
        if (id) {
            sql.insert(rows, id);
        } else {
            sql.insert(rows);
        }
        
        if (sql._method !== 'insert') {
            throw new Error('onDuplicateUpdate error: should be used only with insert query.');
        }
        if (rows.length !== 1) {
            throw new Error('onDuplicateUpdate error: should be used only 1 row insert.');
        }

        if (columns.length === 0) {
            throw new Error('onDuplicateUpdate error: please specify at least one column name.');
        }

        const { placeholders, bindings } = columns.reduce(
            (result, column) => {
                if (typeof column === 'string') {
                    result.placeholders.push(`??=Values(??)`);
                    result.bindings.push(column, column);
                } else if (column && typeof column === 'object') {
                    Object.keys(column).forEach((key) => {
                        result.placeholders.push(`??=?`);
                        result.bindings.push(key, column[key]);
                    });
                } else {
                    throw new Error('onDuplicateUpdate error: expected column name to be string or object.');
                }
                return result;
            },
            { placeholders: [], bindings: [] }
        );

        const { sql: originalSQL, bindings: originalBindings } = sql.toSQL();

        if (!originalBindings.length) {
            throw new Error('onDuplicateUpdate error: empty insert statement.');
        }

        const newBindings = [...originalBindings, ...bindings];
        const rs = await db.raw(
            `${originalSQL} on duplicate key update ${placeholders.join(', ')}`,
            newBindings
        );
        return rs[0].insertId;

    }
}