import React, {ChangeEvent, useEffect, useState} from 'react';
import BackgroundModal from "../../../UI/BackgroundModal";
import styles from './CreateTable.module.scss';
import LineTitle from "../../../UI/LineTitle";
import {useColumnData, useCreateTable, useRowState} from "./useCreateTable";
import {Notification} from "../Notification";

// 모달 (메인)
interface CreateDBProps {
    isOpenModal: boolean;
    onCloseModal(isOpenModal: boolean): void;
    dataBase: DataBaseEntity | null;
}

const CreateTable: React.FC<CreateDBProps> = ({ isOpenModal, onCloseModal, dataBase }) => {
    if (!isOpenModal) return null;

    return (
        <>
            <BackgroundModal
                width={95}
                height={70}
                onClose={onCloseModal}
            >
                <CreateTableForm dataBase={dataBase} />
            </BackgroundModal>
        </>
    );
};

export default CreateTable;

// 안에 내용 (상단)
interface CreateTableFormProps {
    dataBase: DataBaseEntity | null;
}

export const CreateTableForm: React.FC<CreateTableFormProps> = ({dataBase}) => {
    const { tableData, handleChange, handleSubmit, setColumnData, errorMessage, setErrorMessage } = useCreateTable(dataBase);

    const handleSetColumnData = (newData: RowState[]) => {
        setColumnData(newData);
    };

    return (
        <>
            <div className={styles.modal}>
                <LineTitle text={"새로운 테이블 생성"} />
                <form className={styles.modal__form} onSubmit={handleSubmit}>
                    <div className={styles.modal__form__group}>
                        <section>
                            <label htmlFor="name">테이블명</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                onChange={handleChange}
                                value={tableData.name}
                            />
                        </section>
                        <section>
                            <label>데이터베이스명</label>
                            <input
                                type="text"
                                value={dataBase ? dataBase.name : ''}
                                disabled
                            />
                        </section>
                    </div>
                    <div className={styles.modal__form__group}>
                        <section>
                            <label htmlFor="comment">설명 <span>(선택 사항)</span></label>
                            <input
                                type="text"
                                id="comment"
                                name="comment"
                                onChange={handleChange}
                                value={tableData.comment}
                            />
                        </section>
                    </div>
                    <div className={styles.modal__form__group}>
                        <CreateTableColumn handleSetColumnData={handleSetColumnData}/>
                    </div>
                    <button className={styles.modal__form__submit} type="submit">테이블 생성</button>
                </form>
            </div>

            {errorMessage && <Notification
                onClose={() => setErrorMessage(null)}
                type="error"
                message={errorMessage}
            />}
        </>
    );
};

// 테이블 컬럼
interface CreateTableColumnProps {
    handleSetColumnData: (newData: RowState[]) => void;
}

const CreateTableColumn: React.FC<CreateTableColumnProps> = ({ handleSetColumnData }) => {
    const { rows, handleSelectChange, handleAddRow, handleRemoveRow } = useRowState();
    useColumnData(rows, handleSetColumnData); // useEffect

    return (
        <>
            <div className={styles.createTableColumn}>
                <section className={styles.createTableColumn__titleSection}>
                    <label>테이블 컬럼</label>
                    <div className={styles.createTableColumn__buttonBox}>
                        <a onClick={handleAddRow}>+</a>
                        <a onClick={() => handleRemoveRow(rows.length - 1)}>-</a>
                    </div>
                </section>
                <section className={styles.createTableColumn__tableSection}>
                    <table>
                        <thead>
                        <tr>
                            <th className={styles.columnName}>이름</th>
                            <th className={styles.dataType}>데이터 타입</th>
                            <th className={styles.pk}>PK</th>
                            <th className={styles.fk}>FK</th>
                            <th className={styles.uk}>UK</th>
                            <th className={styles.nn}>NN</th>
                            <th className={styles.join}>조인</th>
                        </tr>
                        </thead>
                        <tbody>
                        {rows.map((row, index) => (
                            <TableRow
                                key={index}
                                index={index}
                                row={row}
                                handleSelectChange={handleSelectChange}
                            />
                        ))}
                        </tbody>
                    </table>
                </section>
            </div>
        </>
    );
};

// 테이블 컬럼 반복용
interface TableRowProps {
    index: number;
    row: RowState;
    handleSelectChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index: number) => void;
}

const TableRow: React.FC<TableRowProps> = ({ index, row, handleSelectChange }) => {
    return (
        <tr>
            <td>
                <input
                    style={{border: 'none'}}
                    type="text"
                    name="columnName"
                    value={row.columnName}
                    onChange={(e) => handleSelectChange(e, index)}
                />
            </td>
            <td>
                <select
                    name="dataType"
                    value={row.dataType}
                    onChange={(e) => handleSelectChange(e, index)}
                >
                    <option value="TEXT">TEXT</option>
                    <option value="INTEGER">INTEGER</option>
                    <option value="REAL">REAL</option>
                    <option value="MediaFile">MediaFile</option>
                </select>
            </td>
            <td>
                <input
                    type="checkbox"
                    name="pk"
                    checked={row.pk}
                    onChange={(e) => handleSelectChange(e, index)}
                />
            </td>
            <td>
                <input
                    type="checkbox"
                    name="fk"
                    checked={row.fk}
                    onChange={(e) => handleSelectChange(e, index)}
                />
            </td>
            <td>
                <input
                    type="checkbox"
                    name="uk"
                    checked={row.uk}
                    onChange={(e) => handleSelectChange(e, index)}
                />
            </td>
            <td>
                <input
                    type="checkbox"
                    name="isNotNull"
                    checked={row.isNotNull}
                    onChange={(e) => handleSelectChange(e, index)}
                />
            </td>
            <td>{/* 조인 나중에 넣을 예정... */}</td>
        </tr>
    );
};
