import React, { useEffect, useState } from 'react';
import BackgroundModal from "../../../UI/BackgroundModal";
import styles from './DBQueryExtraction.module.scss';
import LineTitle from "../../../UI/LineTitle";
import CodeEditor from "../../../UI/CodeEditor";
import CopyButton from "../../../UI/CopyButton";
import { useDataBase } from "../../../../contexts/DataBaseContext";
import { findColumnInfo } from "../../../../utils/utils";
import {useTable} from "../../../../contexts/TableContext";

interface DBQueryExtractionProps {
    isOpenModal: boolean;
    onCloseModal(isOpenModal: boolean): void;
}

const DBQueryExtraction: React.FC<DBQueryExtractionProps> = ({ isOpenModal, onCloseModal }) => {
    const { selectedDataBase } = useDataBase();
    const { tables } = useTable();
    const [sqlQuery, setSqlQuery] = useState<string>("");

    useEffect(() => {
        if (selectedDataBase && tables) {
            const generatedQueries = generateCreateTableQueries(selectedDataBase.name, tables);
            setSqlQuery(generatedQueries.join('\n'));
        }
    }, [selectedDataBase, tables]);

    if (!isOpenModal) return null;

    const ModalContent = () => (
        <div className={styles.dbQueryExtraction}>
            <LineTitle text={"데이터베이스 쿼리 추출"} />
            <span className={styles.dbQueryExtraction__copyButBox}>
                <CopyButton url={sqlQuery} />
            </span>
            <span className={styles.dbQueryExtraction__codeEditorWrapper}>
                <CodeEditor code={sqlQuery} />
            </span>
        </div>
    );

    return (
        <>
            <BackgroundModal
                width={70}
                height={60}
                onClose={onCloseModal}
            >
                <ModalContent />
            </BackgroundModal>
        </>
    );
};

export default DBQueryExtraction;

// 데이터 타입을 SQL 데이터 타입으로 매핑하는 함수
function mapToSQLType(dataType: string): string {
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

// SQL 쿼리 생성 함수
function generateCreateTableQueries(databaseName: string, tables: any[]): string[] {
    const queries: string[] = [];

    // CREATE DATABASE 및 USE 쿼리 추가
    queries.push(`CREATE DATABASE ${databaseName};`);
    queries.push(`USE ${databaseName};`);

    tables.forEach((tableData) => {
        const tableName = tableData.name;
        const columns = tableData.tableInnerStructure;

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
                    query += `    FOREIGN KEY (${columnName}) REFERENCES ${referencedTable}(id),\n`;
                }
            }
        });

        // 마지막 쉼표 제거 및 쿼리 마무리
        query = query.trim().slice(0, -1);
        query += `\n);\n`;

        queries.push(query);
    });

    return queries;
}

// 외래 키로 조인할 테이블을 찾는 함수
function findReferencedTable(tables: any[], joinTableHash: string): string | null {
    for (const table of tables)
        if (table.tableHash === joinTableHash)
            return table.name;
    return null;
}
