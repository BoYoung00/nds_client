import { useEffect, useState } from "react";
import { useTable } from "../../../contexts/TableContext";
import { findColumnInfo } from "../../../utils/utils";
import { useDataBase } from "../../../contexts/DataBaseContext";

export function useQueryTab(activeTab: string, dbType: 'MySQL' | 'Oracle') {
    const { selectedDataBase } = useDataBase();
    const { tables, selectedTable } = useTable();

    const [query, setQuery] = useState<string>('');

    const mapToSQLType = (dataType: string): string => {
        if (dbType === 'Oracle') {
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
        } else {
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
        }
    };

    const generateCreateTableQueries = (databaseName: string, tables: TableData[], table: TableData): string => {
        const queries: string[] = [];
        queries.push(`CREATE DATABASE ${databaseName};`);
        queries.push(`USE ${databaseName};`);

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

        query = query.trim().slice(0, -1);
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
            return '데이터가 존재하지 않습니다.'; // 데이터가 없을 때도 처리
        }

        return rows.map(row =>
            `INSERT INTO ${table.name} (${columnNames}) VALUES (${row});`
        ).join('\n');
    };

    const generateDTOClass = (table: TableData): string => {
        const columns = Object.entries(table.tableInnerStructure).map(([key, values]) => {
            const firstRow = values.length > 0 ? values[0] : { dataType: '' };
            return {
                name: key.match(/name=([\w가-힣]+)/)?.[1] ?? '',
                type: firstRow.dataType
            };
        });

        const fields = columns.map(col => {
            let javaType: string;
            switch (col.type) {
                case 'INTEGER':
                    javaType = 'int';
                    break;
                case 'TEXT':
                    javaType = 'String';
                    break;
                case 'REAL':
                    javaType = 'double';
                    break;
                case 'MediaFile':
                case 'JOIN_Column':
                    javaType = 'String';
                    break;
                default:
                    javaType = 'String';
            }
            return `private ${javaType} ${col.name};`;
        });

        const gettersSetters = columns.map(col => {
            const javaType = col.type === 'INTEGER' ? 'int' : 'String';
            return `\tpublic ${javaType} get${capitalizeFirstLetter(col.name)}() {\n\t\treturn ${col.name};\n\t}\n\n\tpublic void set${capitalizeFirstLetter(col.name)}(${javaType} ${col.name}) {\n\t\tthis.${col.name} = ${col.name};\n\t}\n`;
        });

        return `public class ${table.name}DTO {\n\t${fields.join('\n\t')} \n\n${gettersSetters.join('\n')}}`;
    };

    const capitalizeFirstLetter = (string: string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    useEffect(() => {
        if (selectedTable) {
            if (activeTab === 'create') {
                const ddl = generateCreateTableQueries(selectedDataBase?.name!, tables, selectedTable);
                setQuery(ddl);
            } else if (activeTab === 'insert') {
                const dml = generateSQLQuery(selectedTable);
                setQuery(dml === '' ? '아직 데이터가 존재하지 않습니다.' : dml);
            } else if (activeTab === 'DTO') {
                setQuery(generateDTOClass(selectedTable));
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
