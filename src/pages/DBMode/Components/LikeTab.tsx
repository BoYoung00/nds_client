import React from 'react';
import styles from '../DBMode.module.scss';
import doubleArrow from '../../../assets/images/doubleArrow.png';
import TableView from "../../../publicComponents/layout/TableView";
import {Notification} from "../../../publicComponents/layout/modal/Notification";
import {useLikeTab} from "../hooks/useLikeTab";
import CopyButton from "../../../publicComponents/UI/CopyButton";

const LikeTab: React.FC = () => {
    const {
        hooks: {
            loading,
            tableStructure,
            filteredTableStructure,
            columnNames,
            columns,
            selectedColumnData,
            inputValues,
            selectOptions,
            filterApiUrl,
        },
        handlers: {
            handleSelectChange,
            handleInputChange,
            handleOptionChange,
            addSelectBox,
            removeSelectBox,
            fetchFilterSave,
        },
        modals: {
            successMessage,
            setSuccessMessage,
            errorMessage,
            setErrorMessage
        }
    } = useLikeTab();

    if (!tableStructure) return null;

    return (
        <>
            <div className={styles.likeTab}>
                <section className={styles.filterUrlBox}>
                    <p>Filter get url :</p>
                    { filterApiUrl ?
                        <div className={styles.filterUrlWrap}>
                            <span> {filterApiUrl}</span>
                            <span>
                                <CopyButton url={filterApiUrl} />
                            </span>
                        </div>
                        :
                        <div style={{fontSize: '.8rem', color: 'gray'}}>필터를 저장해주세요.</div>
                    }
                </section>
                <section className={styles.likeTab__filterContainer}>
                    <div className={styles.filterBox}>
                        <div className={styles.addRemoveButBox}>
                            <span onClick={addSelectBox}>+</span>
                            <span onClick={removeSelectBox}>-</span>
                        </div>
                        {columns.map((selectedColumnName, index) => (
                            <div className={styles.filterInputBox} key={index}>
                                <label>
                                    <span>Column</span>
                                    <select value={selectedColumnName} onChange={(event) => handleSelectChange(index, event)} >
                                        <option value="">행 선택</option>
                                        {columnNames.map(name => (
                                            <option key={name} value={name}>
                                                {name}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <div className={styles.filterSelectBox}>
                                    {['INTEGER', 'REAL'].includes(selectedColumnData[index]?.type) ? (
                                        <>
                                            <label>
                                                <span>Option</span>
                                                <select value={selectOptions[index]} onChange={(event) => handleOptionChange(index, event)}>
                                                    <option value="">옵션 선택</option>
                                                    <option value="GREATER">{'>'}</option>
                                                    <option value="LESS">{'<'}</option>
                                                    <option value="EQUAL">{'='}</option>
                                                </select>
                                            </label>
                                            <label>
                                                <span>Number</span>
                                                <input type="text" value={inputValues[index]} onChange={(event) => handleInputChange(index, event)} />
                                            </label>
                                        </>
                                    ) : (
                                        <>
                                            <label>
                                                <span>Option</span>
                                                <select value={selectOptions[index]} onChange={(event) => handleOptionChange(index, event)}>
                                                    <option value="">옵션 선택</option>
                                                    <option value="FIRST">First</option>
                                                    <option value="INCLUDE">INCLUDE</option>
                                                    <option value="LAST">Last</option>
                                                </select>
                                            </label>
                                            <label>
                                                <span>Word</span>
                                                <input type="text" value={inputValues[index]} onChange={(event) => handleInputChange(index, event)} />
                                            </label>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={styles.saveButBox}>
                        <span>※ 해당 상태는 REST API에서 데이터를 가지고 올 때 적용 되는 필터입니다.</span>
                        <button onClick={fetchFilterSave}>필터 상태 저장하기</button>
                    </div>
                </section>
                <section className={styles.doubleArrowImgWrap}>
                    <img src={doubleArrow} alt="화살표" />
                </section>
                <section className={styles.likeTab__previewContainer} style={{padding: '0'}}>
                    <TableView tableStructure={filteredTableStructure} />
                </section>
            </div>

            { successMessage && <Notification
                onClose={() => setSuccessMessage(null)}
                type="success"
                message={successMessage}
            /> }

            { errorMessage && <Notification
                onClose={() => setErrorMessage(null)}
                type="error"
                message={errorMessage}
            /> }
        </>
    );
};

export default LikeTab;
