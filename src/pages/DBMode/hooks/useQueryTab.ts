import {useEffect, useState} from "react";
import {useTable} from "../../../contexts/TableContext";
import {findColumnInfo} from "../../../utils/utils";
import {useDataBase} from "../../../contexts/DataBaseContext";

export function useQueryTab(activeTab: string) {
    const { selectedDataBase } = useDataBase();
    const { tables, selectedTable } = useTable();

    const [query, setQuery] = useState<string>('');

    useEffect(() => {
        if (selectedTable) {
            // 데이터 타입을 SQL 데이터 타입으로 매핑하는 함수
            const mapToSQLType = (dataType: string): string => {
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

            // DDL 함수
            const generateCreateTableQueries = (databaseName: string, tables: TableData[], table: TableData): string => {
                const queries: string[] = [];

                // CREATE DATABASE 및 USE 쿼리 추가
                queries.push(`CREATE DATABASE ${databaseName};`);
                queries.push(`USE ${databaseName};`);

                const tableName = table.name;
                const columns = table.tableInnerStructure;

                let query = `CREATE TABLE ${tableName} (\n`;

                Object.keys(columns).forEach((columnKey) => {
                    const columnInfo = findColumnInfo(columnKey);

                    // 컬럼 이름과 타입
                    const columnName = columnInfo.name;
                    const dataType = mapToSQLType(columnInfo.type);

                    // NOT NULL, PRIMARY KEY, UNIQUE 등의 제약 조건 추가
                    let constraints = '';
                    if (columnInfo.isNotNull) constraints += ' NOT NULL';
                    if (columnInfo.isPk) constraints += ' PRIMARY KEY';
                    if (columnInfo.isUk) constraints += ' UNIQUE';

                    query += `    ${columnName} ${dataType}${constraints},\n`;

                    // 외래 키 제약 조건 추가
                    if (columnInfo.isFk && columnInfo.joinTableHash) {
                        // 조인할 테이블의 이름을 찾아서 외래 키 제약 조건 추가
                        const referencedTable = findReferencedTable(tables, columnInfo.joinTableHash);
                        if (referencedTable) {
                            const referencedTableColumns = referencedTable.tableInnerStructure;
                            let refPkName = '';
                            Object.keys(referencedTableColumns).forEach((refColumnKey) => {
                                const referencedTableColumnInfo = findColumnInfo(refColumnKey);
                                if (referencedTableColumnInfo.isPk) refPkName = referencedTableColumnInfo.name;

                            })
                            query += `    FOREIGN KEY (${columnName}) REFERENCES ${referencedTable.name}(${refPkName}),\n`;
                        }
                    }
                });

                // 마지막 쉼표 제거 및 쿼리 마무리
                query = query.trim().slice(0, -1);
                query += `\n);\n`;

                queries.push(query);

                return queries.join('\n');
            }

            // 외래 키로 조인할 테이블을 찾는 함수
            const findReferencedTable = (tables: any[], joinTableHash: string): TableData | null => {
                for (const table of tables)
                    if (table.tableHash === joinTableHash)
                        return table;
                return null;
            }

            const generateSQLQuery = (table: TableData): string => {
                // 행 구하기
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

                // 데이터 구하기
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
                    return '';
                }
                return rows.map(row =>
                    `INSERT INTO ${table.name} (${columnNames}) VALUES (${row})`
                ).join('; \n') + ';';
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
                    const javaType = col.type === 'INTEGER' ? 'int' : 'String'; // Adjust as needed
                    return `\tpublic ${javaType} get${capitalizeFirstLetter(col.name)}() {\n\t\treturn ${col.name};\n\t}\n\n\tpublic void set${capitalizeFirstLetter(col.name)}(${javaType} ${col.name}) {\n\t\tthis.${col.name} = ${col.name};\n\t}\n`;
                });

                return `public class ${table.name}DTO {\n\t${fields.join('\n\t')} \n\n${gettersSetters.join('\n')}}`;
            };

            const capitalizeFirstLetter = (string: string) => {
                return string.charAt(0).toUpperCase() + string.slice(1);
            };

            if (activeTab === 'DDL') {
                const ddl = generateCreateTableQueries(selectedDataBase?.name!, tables, selectedTable);
                setQuery(ddl);
            } else if (activeTab === 'DML') {
                const dml = generateSQLQuery(selectedTable);
                setQuery(dml === '' ? '아직 데이터가 존재하지 않습니다.' : dml);
            } else if (activeTab === 'DTO') {
                setQuery(generateDTOClass(selectedTable));
            }
        }
    }, [selectedTable, activeTab]);

    return { query };
}