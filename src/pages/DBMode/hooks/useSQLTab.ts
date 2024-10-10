import { useEffect, useState } from "react";
import { useTable } from "../../../contexts/TableContext";
import { findColumnInfo } from "../../../utils/utils";
import { useDataBase } from "../../../contexts/DataBaseContext";

export function useSQLTab(activeTab: string, dbType: 'MySQL' | 'Oracle' | 'MariaDB' | 'SQLite') {
    const { selectedDataBase } = useDataBase();
    const { tables, selectedTable } = useTable();

    const [query, setQuery] = useState<string>('');

    const mapToSQLType = (dataType: string): string => {
        switch (dbType) {
            case 'Oracle':
                switch (dataType) {
                    case 'TEXT':
                        return 'VARCHAR2(255)';
                    case 'INTEGER':
                        return 'NUMBER';
                    case 'REAL':
                        return 'FLOAT';
                    default:
                        return 'VARCHAR2(255)';
                }
            case 'MySQL':
            case 'MariaDB':
                switch (dataType) {
                    case 'TEXT':
                        return 'TEXT';
                    case 'INTEGER':
                        return 'INT';
                    case 'REAL':
                        return 'FLOAT';
                    default:
                        return 'VARCHAR(255)';
                }
            case 'SQLite':
                switch (dataType) {
                    case 'TEXT':
                        return 'TEXT';
                    case 'INTEGER':
                        return 'INTEGER';
                    case 'REAL':
                        return 'REAL';
                    default:
                        return 'TEXT';
                }
            default:
                return 'VARCHAR(255)';
        }
    };

    const generateCreateTableQueries = (databaseName: string, tables: TableData[], table: TableData): string => {
        const queries: string[] = [];

        // SQLite는 CREATE DATABASE 구문을 지원하지 않으므로 제외
        if (dbType !== 'SQLite') {
            queries.push(`CREATE DATABASE ${databaseName};`);
            queries.push(`USE ${databaseName};`);
        }

        const tableName = table.name;
        const columns = table.tableInnerStructure;

        let query = `CREATE TABLE ${tableName} (\n`;

        Object.keys(columns).forEach((columnKey) => {
            const columnInfo = findColumnInfo(columnKey);
            const columnName = columnInfo.name;
            const dataType = mapToSQLType(columnInfo.type);

            let constraints = '';
            if (columnInfo.isNotNull) constraints += ' NOT NULL';
            if (columnInfo.isPk) constraints += ' PRIMARY KEY';
            if (columnInfo.isUk) constraints += ' UNIQUE';

            query += `    ${columnName} ${dataType}${constraints},\n`;

            if (columnInfo.isFk && columnInfo.joinTableHash) {
                const referencedTable = findReferencedTable(tables, columnInfo.joinTableHash);
                if (referencedTable) {
                    let refPkName = '';
                    Object.keys(referencedTable.tableInnerStructure).forEach((refColumnKey) => {
                        const referencedTableColumnInfo = findColumnInfo(refColumnKey);
                        if (referencedTableColumnInfo.isPk) refPkName = referencedTableColumnInfo.name;
                    });
                    query += `    FOREIGN KEY (${columnName}) REFERENCES ${referencedTable.name}(${refPkName}),\n`;
                }
            }
        });

        query = query.trim().slice(0, -1); // 마지막 쉼표 제거
        query += `\n);\n`;

        queries.push(query);
        return queries.join('\n');
    };

    const findReferencedTable = (tables: any[], joinTableHash: string): TableData | null => {
        for (const table of tables)
            if (table.tableHash === joinTableHash)
                return table;
        return null;
    };

    const generateSQLQuery = (table: TableData): string => {
        let numRows = 0;
        const columns = Object.entries(table.tableInnerStructure).map(([key, values]) => {
            const firstRow = values.length > 0 ? values[0] : { dataType: '', data: '' };
            numRows = values.length;
            return {
                name: key.match(/name=([\w가-힣]+)/)?.[1] ?? '',
                dataType: firstRow.dataType,
                value: firstRow.data
            };
        });

        const columnNames = columns.map(col => col.name).join(', ');
        const rows: string[] = [];
        for (let i = 0; i < numRows; i++) {
            const data: string[] = [];
            Object.entries(table.tableInnerStructure).map(([key, values]) => {
                if (values[i]) {
                    if (values[i].dataType === 'TEXT' || values[i].dataType === 'MediaFile' || values[i].dataType === 'JOIN_Column')
                        data.push(`'${values[i].data}'`);
                    else
                        data.push(values[i].data);
                } else {
                    data.push('');
                }
            });
            rows.push(data.join(', '));
        }

        if (rows.length === 0) {
            return '아직 데이터가 존재하지 않습니다.'; // 데이터가 없을 때 처리
        }

        return rows.map(row =>
            `INSERT INTO ${table.name} (${columnNames}) VALUES (${row});`
        ).join('\n');
    };

    useEffect(() => {
        if (selectedTable) {
            if (activeTab === 'create') {
                const ddl = generateCreateTableQueries(selectedDataBase?.name!, tables, selectedTable);
                setQuery(ddl);
            } else if (activeTab === 'insert') {
                const dml = generateSQLQuery(selectedTable);
                setQuery(dml);
            }
        }
    }, [selectedTable, activeTab, dbType]);

    const downloadSQLFile = () => {
        if (!selectedTable) return;

        const createQuery = generateCreateTableQueries(selectedDataBase?.name!, tables, selectedTable);
        const insertQuery = generateSQLQuery(selectedTable);
        const fullQuery = `${createQuery}${insertQuery}`;

        const element = document.createElement("a");
        const file = new Blob([fullQuery], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = `${selectedTable?.name || 'query'}.sql`;
        document.body.appendChild(element); // 파일 다운로드를 트리거하기 위해 DOM에 추가
        element.click();
    };

    return { query, downloadSQLFile };
}
