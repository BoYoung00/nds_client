## D-SIM


#### "복잡도는 줄이고, 활용도는 높게"

D-SIM은 데이터베이스 설계 및 관리의 복잡성을 줄이고, 데이터를 직관적으로 활용할 수 있도록 돕는 웹 서비스입니다. 이 프로젝트는 사용자가 데이터베이스를 효율적으로 설계하고 관리하며, 다양한 데이터 활용 기능을 제공하는 것을 목표로 합니다.

---

### 📌 주요 기능

1. 데이터베이스 설계 및 관리
   - ERD 모드:
       - 엔티티 생성 및 관계(FK) 연결.
   - DB 모드:
       - 테이블 데이터 추가, 수정, 삭제 및 저장.


3. 데이터 입력 및 변환
   - Excel Import/Export:
       - 엑셀 데이터를 테이블에 업로드하거나 다운로드.
   - SQL 생성:
       - 다양한 DBMS(MySQL, Oracle 등)에서 사용할 CREATE 및 INSERT 문 자동 생성.


4. REST API와 데이터 접근
   - REST API URL 제공 및 클라이언트 코드 적용.
   - 조건 기반 데이터 필터링(Custom API) 기능.

    
5. 데이터 변경 이력 관리
   - 데이터 변경 사항 기록 및 조회.


6. 코드 자동화 및 파일 기반 데이터 생성
   - DTO 및 API 코드 자동 생성.
   - 파일(.nds)을 이용해 데이터베이스 생성.


7. 미디어 관리 및 테이블 병합
   - 이미지/동영상 저장 및 외부 접근 URL 제공.
   - 여러 테이블 병합 및 결과 저장.

---

## 🔧 기술 스택
- Frontend: React, TypeScript, SCSS
- Backend: Spring Boot, Kotlin
- Database: MySQL, Oracle
- Deployment: GCP
- 협업 도구: Figma (UI/UX 설계), IntelliJ IDEA, Git

---

## 🖥️ 주요 화면

#### 1. 로그인 및 토큰 발급 화면

![image](https://github.com/user-attachments/assets/6530bbf7-2913-4be2-b6bd-edb5e2d54b3d)
   - 이메일로 토큰 발급 및 로그인 가능.



#### 3. ERD 모드 화면

![image](https://github.com/user-attachments/assets/e8d3a4f5-6b58-4c18-80d0-3ec9f3193680)
   - 데이터베이스 엔티티 설계 및 관리.



#### 4. DB 모드 화면
   
![image](https://github.com/user-attachments/assets/8836d4fc-d2d0-428b-8b84-21260e059997)
   - 데이터베이스 테이블 관리.



#### 5. Excel Import/Export 화면
   
![KakaoTalk_20241219_042045336](https://github.com/user-attachments/assets/94dff952-815d-4f50-a1b7-b64013b04c75)
   - 엑셀 파일로 데이터 관리.



#### 6. REST API 및 필터링 화면
    
![KakaoTalk_20241219_042133403](https://github.com/user-attachments/assets/b73fbf5e-fe67-4d6b-8d0d-d78542c7403a)
   - API URL 적용 및 데이터 접근.



#### 7. 데이터베이스 버전 관리 화면
    
![KakaoTalk_20241219_042154880](https://github.com/user-attachments/assets/91ab4238-f320-4336-a6a4-37451de1e340)
   - 데이터 이력 관리.

  
---

## 🤝 기여
- 화면 전환 없이 한 화면에서 여러 기능을 처리할 수 있는 사용자 친화적인 UI를 설계 및 구현.
- GoJS를 활용해 엔티티를 그래프 형식으로 시각화하고 관계(FK) 연결 기능 개발.
- Context API로 상태 관리를 최적화하여 서버와의 통신 횟수를 최소화.
- Excel 데이터를 테이블에 업로드하고 내보내는 Import/Export 기능 구현.
- 다양한 DBMS에 대한 SQL CREATE 및 INSERT 문 자동 생성 기능 개발.
- REST API URL 제공 및 조건 기반 데이터 필터링 기능 추가.
- 데이터 변경 내역을 기록하고 조회할 수 있는 Stamping 기능 구현.
- 공용 UI 및 유틸리티 로직을 모듈화하여 코드 재사용성을 향상.
- Ref를 사용해 관계 연결 시 제약 조건을 적용하여 데이터 무결성 보장.
- 백엔드와 협력하여 JSON 데이터 설계와 오류를 해결하며 효율적인 데이터 관리 구현.

---

## 🎉 개발자 및 기여자

- 김보영(프론트엔드)
- 주동호(백엔드)

🏆 졸업작품 대상 수상 프로젝트 (2024)


🎞 시연 동영상 : https://www.youtube.com/watch?v=TCFZ6KjAqi4
