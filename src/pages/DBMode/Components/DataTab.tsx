import React, {useRef} from 'react';
import styles from '../DBMode.module.scss';
import refresh from '../../../assets/images/refresh.png';
import addData from '../../../assets/images/addData.png';
import deleteData from '../../../assets/images/deleteData.png';
import save from '../../../assets/images/save.png';
import updateSave from '../../../assets/images/updateSave.png';
import {Notification} from '../../../publicComponents/layout/modal/Notification';
import {useAutoColumnWidth, useDataTab, useSearchPosition} from "../hooks/useDataTab";
import Search from "../../../publicComponents/layout/modal/Search/Search";
import {useTable} from "../../../contexts/TableContext";
import TableView from "../../../publicComponents/layout/TableView";
import {findColumnInfo} from "../../../utils/utils";

const DataTab: React.FC = () => {
    const { fetchTables, selectedTable } = useTable();

    const {
        hooks: {
            tableStructure,
            selectedRow,
            setSelectedRow,
            createDataList,
            updateDataList,
            deleteDataList,
            deletedRows,
            imagePaths,
            videoPaths,
            isJoinTable,
            isSsrViewVisible,
            joinTableStructure,
            joinParentsTable,
            showCopyMessage
        },
        handlers: {
            handleAddData,
            handleDeleteData,
            handleSave,
            handleInputChange,
            handleInputBlur,
            handleRefreshClick,
            handleResetTableData,
            handleSelectData,
            findJoinDataList,
            toggleSsrView,
            handleCopyJoinTableUrl
        },
        modals: {
            questionMessage,
            setQuestionMessage,
            errorMessage,
            setErrorMessage,
            successMessage,
            setSuccessMessage,
        }
    } = useDataTab();

    // input text 안의 값에 따라 너비 변경
    const inputRefs = useRef<{ [key: string]: HTMLInputElement }>({});
    useAutoColumnWidth([createDataList, updateDataList, deleteDataList], inputRefs);

    if (!tableStructure) return null;
    const columns = tableStructure ? Object.keys(tableStructure) : [];

    return (
        <>
            <div className={styles.dataTab}>
                <header className={styles.dataTab__header}>
                    <span onClick={handleRefreshClick}>
                        <img src={refresh} alt="refresh" />
                        REFRESH
                    </span>
                    <span onClick={handleAddData}>
                        <img src={addData} alt="addData" />
                        ADD_DATA
                    </span>
                    <span onClick={handleDeleteData}>
                        <img src={deleteData} alt="deleteData" />
                        DELETE_DATA
                    </span>
                    <span onClick={handleSave}>
                        {createDataList.length === 0 && updateDataList.length === 0 && deleteDataList.length === 0 ?
                            <img src={save} alt="save" />
                            :
                            <img src={updateSave} alt="updateSave" />
                        }
                        SAVE
                    </span>
                </header>
                <main className={styles.dataTab__main}>
                    <table>
                        <thead>
                        <tr>
                            {columns.map((columnKey, index) => {
                                const columnNameMatch = columnKey.match(/name=([\w가-힣]+),/);
                                const columnName = columnNameMatch ? columnNameMatch[1] : `Column ${index + 1}`;
                                return <th key={index}>{columnName}</th>;
                            })}
                        </tr>
                        </thead>
                        <tbody>
                        {columns.length > 0 && tableStructure[columns[0]].map((_, rowIndex) => (
                            <tr key={rowIndex} onClick={() => setSelectedRow(rowIndex)}>
                                {columns.map(columnKey => {
                                    const joinTableHashMatch = columnKey.match(/joinTableHash=([\w가-힣]+)/);
                                    const joinTableHash = joinTableHashMatch ? joinTableHashMatch[1] : `null`;
                                    const cellData = tableStructure[columnKey][rowIndex] || { id: null, data: '' };
                                    return (
                                        <td
                                            key={cellData.id || columnKey + rowIndex}
                                            className={`${selectedRow === rowIndex ? styles.selectedCell : ''} ${deletedRows.includes(rowIndex) ? styles.deletedCell : ''}`}
                                        >
                                            { joinTableHash !== 'null' ?
                                                <DataCell
                                                    type={'join'}
                                                    value={cellData.data}
                                                    columnKey={columnKey}
                                                    rowIndex={rowIndex}
                                                    dataList={findJoinDataList()}
                                                    handleSelectData={handleSelectData}
                                                />
                                                :
                                                <>
                                                    { cellData.dataType === 'MediaFile' ?
                                                        <DataCell
                                                            type={'media'}
                                                            value={cellData.data}
                                                            columnKey={columnKey}
                                                            rowIndex={rowIndex}
                                                            dataList={[...imagePaths, ...videoPaths]}
                                                            handleSelectData={handleSelectData}
                                                        />
                                                        :
                                                        <input
                                                            ref={el => {
                                                                if (el) inputRefs.current[`${columnKey}-${rowIndex}`] = el;
                                                            }}
                                                            type="text"
                                                            value={cellData.data}
                                                            data-column-key={columnKey}
                                                            onChange={e => handleInputChange(e, columnKey, rowIndex)}
                                                            onBlur={handleInputBlur}
                                                            placeholder={'NULL'}
                                                        />
                                                    }
                                                </>
                                            }
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </main>
                { isJoinTable &&
                    <div className={styles.joinTableView}>
                        {isSsrViewVisible && (
                            <div className={styles.ssrView}>
                                <section className={styles.joinInfoBox}>
                                    <section className={styles.joinInfo}>
                                        <p>조인 정보</p>
                                        <strong>- 부모 테이블</strong> <br/>
                                        이름 : {joinParentsTable?.name} <br/>
                                        설명 : {joinParentsTable?.comment} <br/>
                                        PK행 이름 : {
                                        Object.keys(joinParentsTable?.tableInnerStructure || {})
                                            .map((key: string) => findColumnInfo(key))
                                            .filter((columnInfo) => columnInfo.isPk)  // PK인 컬럼만 필터링
                                            .map((columnInfo) => columnInfo.name)     // 컬럼 이름만 추출
                                            .join(', ') || '없음'
                                    } <br/><br/>
                                        <strong>- 자식 테이블</strong> <br/>
                                        이름 : {selectedTable?.name} <br/>
                                        설명 : {selectedTable?.comment} <br/>
                                        FK행 이름 : {
                                        Object.keys(selectedTable?.tableInnerStructure || {})
                                            .map((key: string) => findColumnInfo(key))
                                            .filter((columnInfo) => columnInfo.isFk)  // FK인 컬럼만 필터링
                                            .map((columnInfo) => columnInfo.name)     // 컬럼 이름만 추출
                                            .join(', ') || '없음'
                                    } <br/>
                                    </section>
                                    <section className={styles.copyButtonContainer}>
                                        {showCopyMessage && <span className={styles.copyMessage}>복사 되었습니다.</span>}
                                        <button className={styles.copyButton} onClick={handleCopyJoinTableUrl}>
                                            REST API Url 복사
                                        </button>
                                    </section>
                                </section>
                                <section className={styles.tableViewBox}>
                                    <TableView tableStructure={joinTableStructure} useAltStyle={false} />
                                </section>
                            </div>
                        )}
                        <p onClick={(e) => {e.stopPropagation(); toggleSsrView();}}>Join</p>
                    </div>
                }
            </div>

            {/*새로고침 모달*/}
            { questionMessage && <Notification
                onClose={() => setQuestionMessage(null)}
                type="question"
                message={questionMessage}
                onConfirm={async () => {
                    await fetchTables();
                    handleResetTableData();
                }}
            /> }

            {/*에러 모달*/}
            { errorMessage && <Notification
                onClose={() => setErrorMessage(null)}
                type="error"
                message={errorMessage}
            /> }

            {/*성공 모달*/}
            { successMessage && <Notification
                onClose={() => setSuccessMessage(null)}
                type="success"
                message={successMessage}
            /> }
        </>
    );
};

export default DataTab;

interface DataCellProps {
    type: 'join' | 'media';
    value: string;
    columnKey: string;
    rowIndex: number;
    dataList: any[];
    handleSelectData: (selectedData: MediaFile, columnKey: string, rowIndex: number) => void;
}

const DataCell: React.FC<DataCellProps> = ({
                                               type,
                                               value,
                                               columnKey,
                                               rowIndex,
                                               dataList,
                                               handleSelectData,
                                           }) => {
    const {
        showSearch,
        searchPosition,
        searchBoxRef,
        buttonRef,
        handleButtonClick,
        setShowSearch
    } = useSearchPosition(null);

    return (
        <div className={styles.dataBox}>
            <input
                type="text"
                value={value}
                placeholder='NULL'
                readOnly
            />
            <button
                ref={buttonRef}
                className={styles.searchBut}
                onClick={handleButtonClick}
            >
                {type === 'join' ? 'Join' : 'Media'}
            </button>
            {showSearch && searchPosition && (
                <span
                    ref={searchBoxRef}
                    className={styles.searchBox}
                    style={{
                        position: 'absolute',
                        top: searchPosition.y,
                        left: searchPosition.x
                    }}
                >
                    <Search
                        title={type === 'join' ? '조인 데이터 검색' : '미디어 데이터 검색'}
                        showSearch={showSearch}
                        setShowSearch={setShowSearch}
                        dataList={dataList}
                        handleSelectData={(item) => handleSelectData(item, columnKey, rowIndex)}
                        type={type === 'join' ? 'joinData' : 'media'}
                        index={rowIndex}
                    />
                </span>
            )}
        </div>
    );
};
