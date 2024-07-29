import {useEffect, useState} from "react";

export function useQueryTab(selectedTable: TableData | null, activeTab: string) {
    const [query, setQuery] = useState<string>('');

    useEffect(() => {
        if (selectedTable) {
            const generateSQLQuery = (table: TableData): string => {
                // 행 구하기
                let numRows = 0;
                const columns = Object.entries(table.tableInnerStructure).map(([key, values]) => {
                    const firstRow = values[0];
                    numRows = values.length;
                    return {
                        name: key.match(/name=(\w+)/)?.[1] ?? '',
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
                        if (values[i].dataType === 'TEXT' || values[i].dataType === 'MediaFile' || values[i].dataType === 'JOIN_Column')
                            data.push(`'${values[i].data}'`);
                        else
                            data.push(values[i].data);
                    });
                    rows.push(data.join(', '));
                };

                console.log(rows)

                return rows.map(row =>
                    `INSERT INTO ${table.name} (${columnNames}) VALUES (${row})`
                ).join('; \n');
            };

            const generateDTOClass = (table: TableData): string => {
                const columns = Object.entries(table.tableInnerStructure).map(([key, values]) => {
                    const firstRow = values[0];
                    return {
                        name: key.match(/name=(\w+)/)?.[1] ?? '',
                        type: firstRow.dataType
                    };
                });

                const fields = columns.map(col => {
                    let javaType;
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
                            javaType = 'String'; // Treat MediaFile and JOIN_Column as String
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

                return `public class ${table.name}DTO {\n\t${fields.join('\n\t')} \n\n${gettersSetters.join('\n')}}
`;
            };

            // Helper function to capitalize the first letter
            const capitalizeFirstLetter = (string: string) => {
                return string.charAt(0).toUpperCase() + string.slice(1);
            };

            if (activeTab === 'SQL') {
                setQuery(generateSQLQuery(selectedTable));
            } else if (activeTab === 'DTO') {
                setQuery(generateDTOClass(selectedTable));
            }
        }
    }, [selectedTable, activeTab]);

    return { query };
}