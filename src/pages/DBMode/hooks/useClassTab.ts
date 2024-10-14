import {useEffect, useState} from "react";
import {useTable} from "../../../contexts/TableContext";
import {findColumnInfo} from "../../../utils/utils";

export function useClassTab(activeTab: string, dbType: 'Java' | 'Kotlin' | 'C++' | 'JS') {
    const { selectedTable } = useTable();
    const [query, setQuery] = useState<string>('');

    const generateDTOClass = (table: TableData): string => {
        const columns = Object.entries(table.tableInnerStructure).map(([key, values]) => {
            const columnInfo = findColumnInfo(key)
            return {
                name: columnInfo.name,
                type: columnInfo.type
            };
        });

        switch (dbType) {
            case 'Java':
                return generateJavaDTO(table.name, columns);
            case 'Kotlin':
                return generateKotlinDTO(table.name, columns);
            case 'C++':
                return generateCppDTO(table.name, columns);
            case 'JS':
                return generateJSDTO(table.name, columns);
            default:
                return '';
        }
    };

    const capitalizeFirstLetter = (string: string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    // Java DTO 생성 함수 with toString
    const generateJavaDTO = (tableName: string, columns: any[]) => {
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
                default:
                    javaType = 'String';
            }
            return `private ${javaType} ${col.name};`;
        });

        const gettersSetters = columns.map(col => {
            const javaType = col.type === 'INTEGER' ? 'int' : 'String';
            return `\tpublic ${javaType} get${capitalizeFirstLetter(col.name)}() {\n\t\treturn ${col.name};\n\t}\n\n\tpublic void set${capitalizeFirstLetter(col.name)}(${javaType} ${col.name}) {\n\t\tthis.${col.name} = ${col.name};\n\t}\n`;
        });

        const toStringMethod = `\t@Override\n\tpublic String toString() {\n\t\treturn "${tableName}{" + ${columns.map(col => `"${col.name}=" + ${col.name} + ", "`).join(' + ')} + '}';\n\t}\n`;

        return `public static class ${tableName}DTO {\n\t${fields.join('\n\t')} \n\n${gettersSetters.join('\n')}\n${toStringMethod}}`;
    };

    // Kotlin DTO 생성 함수 with toString
    const generateKotlinDTO = (tableName: string, columns: any[]) => {
        const fields = columns.map(col => {
            let kotlinType: string;
            switch (col.type) {
                case 'INTEGER':
                    kotlinType = 'Int';
                    break;
                case 'TEXT':
                    kotlinType = 'String';
                    break;
                case 'REAL':
                    kotlinType = 'Double';
                    break;
                default:
                    kotlinType = 'String';
            }
            return `var ${col.name}: ${kotlinType}`;
        });

        return `data class ${tableName}DTO (\n\t${fields.join(',\n\t')}\n)`;
    };

    // C++ DTO 생성 함수 with toString
    const generateCppDTO = (tableName: string, columns: any[]) => {
        const fields = columns.map(col => {
            let cppType: string;
            switch (col.type) {
                case 'INTEGER':
                    cppType = 'int';
                    break;
                case 'TEXT':
                    cppType = 'std::string';
                    break;
                case 'REAL':
                    cppType = 'double';
                    break;
                default:
                    cppType = 'std::string';
            }
            return `${cppType} ${col.name};`;
        });

        const gettersSetters = columns.map(col => {
            const cppType = col.type === 'INTEGER' ? 'int' : 'std::string';
            return col.type === 'INTEGER' ?
                `\t${cppType} get${capitalizeFirstLetter(col.name)}() const {\n\t\treturn ${col.name};\n\t}\n\n\tvoid set${capitalizeFirstLetter(col.name)}(${cppType} ${col.name}) {\n\t\tthis->${col.name} = ${col.name};\n\t}\n`
                :
                `\t${cppType} get${capitalizeFirstLetter(col.name)}() const {\n\t\treturn ${col.name};\n\t}\n\n\tvoid set${capitalizeFirstLetter(col.name)}(const ${cppType}& ${col.name}) {\n\t\tthis->${col.name} = ${col.name};\n\t}\n`;
        });

        return `class ${tableName}DTO {\nprivate:\n\t${fields.join('\n\t')}\npublic:\n${gettersSetters.join('\n')}};`;
    };

    // JavaScript DTO 생성 함수 with toString
    const generateJSDTO = (tableName: string, columns: any[]) => {
        const fields = columns.map(col => `this.${col.name} = null;`).join('\n\t\t');

        const methods = columns.map(col => {
            return `get${capitalizeFirstLetter(col.name)}() {\n\t\treturn this.${col.name};\n\t}\n\n\tset${capitalizeFirstLetter(col.name)}(${col.name}) {\n\t\tthis.${col.name} = ${col.name};\n\t}`;
        }).join('\n\n\t');


        return `class ${tableName}DTO {\n\tconstructor() {\n\t\t${fields}\n\t}\n\n\t${methods}\n}`;
    };

    useEffect(() => {
        if (selectedTable) {
            if (activeTab === 'DTO') {
                setQuery(generateDTOClass(selectedTable));
            }
        }
    }, [selectedTable, activeTab, dbType]);

    return { query };
}
