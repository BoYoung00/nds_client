// import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
// import {getDataBasesForCurrentUser} from "../services/api";
// import {Notification} from "../publicComponents/layout/modal/Notification";
//
//
// interface ErdContextType {
//     databases: DataBaseEntity[];
//     setDatabases: React.Dispatch<React.SetStateAction<DataBaseEntity[]>>;
//     selectedDataBase: DataBaseEntity | null;
//     setSelectedDataBase: (db: DataBaseEntity | null) => void;
//     loading: boolean;
//     errorMessage: string | null;
//     fetchDatabases: () => void;
// }
//
// // Context 생성
// const ErdContext = createContext<ErdContextType | undefined>(undefined);
//
// export const ErdProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//     const [loading, setLoading] = useState<boolean>(false);
//
//     const [databases, setDatabases] = useState<DataBaseEntity[]>([]);
//     const [selectedDataBase, setSelectedDataBase] = useState<DataBaseEntity | null>(null);
//
//     const [errorMessage, setErrorMessage] = useState<string | null>(null);
//
//     const fetchDatabases = async () => {
//         try {
//             setLoading(true);
//             const data = await getDataBasesForCurrentUser();
//             setDatabases(data);
//         } catch (error) {
//             setErrorMessage('데이터베이스를 가져오는 중 오류가 발생했습니다.');
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     useEffect(() => {
//         fetchDatabases();
//     }, []);
//
//     return (
//         <>
//             <ErdContext.Provider
//                 value={{
//                     loading,
//                     selectedDataBase,
//                     setSelectedDataBase,
//                     databases,
//                     setDatabases,
//                     fetchDatabases,
//                     errorMessage,
//                 }}
//             >
//                 {children}
//             </ErdContext.Provider>
//             {/* 오류 모달 */}
//             { errorMessage && <Notification
//                 onClose={() => setErrorMessage(null)}
//                 type="error"
//                 message={errorMessage}
//             /> }
//         </>
//
//     );
// };
//
// // Context를 사용하는 커스텀 훅
// export const useErd = (): ErdContextType => {
//     const context = useContext(ErdContext);
//     if (context === undefined) {
//         throw new Error('useErd must be used within a ErdProvider');
//     }
//     return context;
// };