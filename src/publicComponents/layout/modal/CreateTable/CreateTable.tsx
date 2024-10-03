import React, {useState} from 'react';
import BackgroundModal from "../../../UI/BackgroundModal";
import styles from './CreateTable.module.scss';
import LineTitle from "../../../UI/LineTitle";
import {useColumnData, useCreateTable, useRowState} from "./useCreateTable";
import {Notification} from "../Notification";
import Search from "../Search/Search";
import {useDataBase} from "../../../../contexts/DataBaseContext";

// 모달 (메인)
interface CreateDBProps {
    isOpenModal: boolean;
    onCloseModal(isOpenModal: boolean): void;
    isEntity?: boolean;
}

const CreateTable: React.FC<CreateDBProps> = ({ isOpenModal, onCloseModal, isEntity=false }) => {

    if (!isOpenModal) return null;

    return (
        <>
            <BackgroundModal
                width={60}
                height={75}
                onClose={onCloseModal}
            >
                <CreateTableForm isEntity={isEntity}/>
            </BackgroundModal>
        </>
    );
};

export default CreateTable;

interface CreateTableFormProps {
    isEntity?: boolean;
}

// 안에 내용 (상단)
export const CreateTableForm: React.FC<CreateTableFormProps> = ({isEntity=false}) => {
    const { selectedDataBase } = useDataBase();

    const {
        tableData,
        handleChange,
        handleSubmit,
        setColumns,
        errorMessage,
        setErrorMessage,
        successMessage,
        setSuccessMessage,
    } = useCreateTable(selectedDataBase);

    return (
        <>
            <div className={styles.modal}>
                <LineTitle text={isEntity ? '새로운 엔티티 생성' : '새로운 테이블 생성'} />
                <form className={styles.modal__form} onSubmit={handleSubmit}>
                    <div className={styles.modal__form__group}>
                        <section>
                            <label htmlFor="name">{isEntity ? '엔티티명' : '테이블명'}</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                onChange={handleChange}
                                value={tableData.name}
                            />
                        </section>
                        <section>
                            <label>데이터베이스명</label>
                            <input
                                type="text"
                                value={selectedDataBase ? selectedDataBase.name : ''}
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
                        <CreateTableColumn
                            isEntity={isEntity}
                            handleSetColumnData={ (newData: RowState[]) => setColumns(newData) }
                        />
                    </div>
                    <button className={styles.modal__form__submit}>{isEntity ? '엔티티 생성' : '테이블 생성'}</button>
                </form>
            </div>

            { errorMessage && <Notification
                onClose={() => setErrorMessage(null)}
                type="error"
                message={errorMessage}
            /> }

            { successMessage && <Notification
                onClose={() => setSuccessMessage(null)}
                type="success"
                message={successMessage}
            /> }
        </>
    );
};

// 테이블 컬럼
interface CreateTableColumnProps {
    handleSetColumnData: (newData: RowState[]) => void;
    isEntity?: boolean;
}

const CreateTableColumn: React.FC<CreateTableColumnProps> = ({ handleSetColumnData, isEntity=false }) => {
    const {
        rows,
        handleSelectChange,
        handleAddRow,
        handleRemoveRow,
        joinTables,
        handleSelectJoinTable,
        errorMessage,
        setErrorMessage
    } = useRowState();

    useColumnData(rows, handleSetColumnData);

    return (
        <>
            <div className={styles.createTableColumn}>
                <section className={styles.createTableColumn__titleSection}>
                    <label>{isEntity ? '엔티티 컬럼' : '테이블 컬럼'}</label>
                    <div className={styles.createTableColumn__buttonBox}>
                        <span onClick={handleAddRow}>+</span>
                        <span onClick={() => handleRemoveRow(rows.length - 1)}>-</span>
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
                            <th className={styles.join}>관계 연결</th>
                        </tr>
                        </thead>
                        <tbody>
                        {rows.map((row, index) => (
                            <TableRow
                                joinTables={joinTables}
                                handleSelectJoinTable={handleSelectJoinTable}
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

            {/*에러 모달*/}
            { errorMessage && <Notification
                onClose={() => setErrorMessage(null)}
                type="error"
                message={errorMessage}
            /> }
        </>
    );
};

// 테이블 컬럼 반복용
interface TableRowProps {
    joinTables: JoinTable[];
    handleSelectJoinTable: (selected: JoinTable, index: number) => void;
    index: number;
    row: RowState;
    handleSelectChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index: number) => void;
}

const TableRow: React.FC<TableRowProps> = ({ joinTables, handleSelectJoinTable, index, row, handleSelectChange }) => {
    const [showSearch, setShowSearch] = useState<boolean>(false);

    return (
        <tr>
            <td>
                <input
                    style={{border: 'none'}}
                    type="text"
                    name="name"
                    value={row.name}
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
                    name="isPkActive"
                    checked={row.isPkActive}
                    onChange={(e) => handleSelectChange(e, index)}
                />
            </td>
            <td>
                <input
                    type="checkbox"
                    name="isFkActive"
                    checked={row.isFkActive}
                    onChange={(e) => handleSelectChange(e, index)}
                />
            </td>
            <td>
                <input
                    type="checkbox"
                    name="isUkActive"
                    checked={row.isUkActive}
                    onChange={(e) => handleSelectChange(e, index)}
                />
            </td>
            <td>
                <input
                    type="checkbox"
                    name="isNotNullActive"
                    checked={row.isNotNullActive}
                    onChange={(e) => handleSelectChange(e, index)}
                />
            </td>
            <td className={styles.joinBox}>
                <input
                    style={{width: '90%'}}
                    type="text"
                    name="isJoinTableHash"
                    value={row.isJoinTableHash ? row.isJoinTableHash.split('-')[0] : ''}
                    onChange={(e) => handleSelectChange(e, index)}
                    readOnly
                />

                <div className={styles.joinBox__searchButton} >
                    <h5 onClick={() => setShowSearch(!showSearch)}>검색</h5>
                    <span className={styles.searchBox}>
                        <Search
                            title={"부모 테이블 검색"}
                            showSearch={showSearch}
                            setShowSearch={setShowSearch}
                            dataList={joinTables}
                            handleSelectData={handleSelectJoinTable}
                            type={'joinTable'}
                            index={index}
                        />
                    </span>
                </div>
            </td>
        </tr>
    );
};
