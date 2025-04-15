## D-SIM


#### "복잡도는 줄이고, 활용도는 높게"

D-SIM은 UI를 통해 데이터베이스 엔티티와 테이블 관리 등을 도와주는 종합 데이베이스 솔루션 입니다. 사용자는 D-SIM을 통해 데이터베이스 관련 작업을 자동화 하여 효율적인 일처리가 가능합니다.

---

📅 개발 기간
- 2024년 07월 ~ 2024년 10월 (3개월간)

---

### 📌 주요 기능

#### 1. 데이터베이스 설계 및 관리
   - ERD 모드: 엔티티 생성 및 관계(FK) 연결
   - DB 모드: 테이블 데이터 추가, 수정, 삭제 및 저장


#### 3. 데이터 입력 및 변환
   - Excel Import/Export: 엑셀 데이터를 테이블에 업로드하거나 다운로드
   - SQL 생성: 다양한 DBMS(MySQL, Oracle 등)에서 사용할 CREATE 및 INSERT 문 자동 생성


#### 4. REST API와 데이터 접근
   - REST API URL 제공 및 클라이언트 코드 적용
   - 조건 기반 데이터 필터링(Custom API) 기능

    
#### 5. 데이터 변경 이력 관리
   - 데이터 변경 사항 기록 및 조회


#### 6. 코드 자동화 및 파일 기반 데이터 생성
   - DTO 및 API 코드 자동 생성
   - 파일(.nds)을 이용해 데이터베이스 생성


#### 7. 미디어 관리 및 테이블 병합
   - 이미지/동영상 저장 및 외부 접근 URL 제공
   - 여러 테이블 병합 및 결과 저장

---

## 🔗 링크
🎞 시연 동영상 : https://www.youtube.com/watch?v=TCFZ6KjAqi4

💻 개발 산출물 : https://drive.google.com/file/d/1d6fW3QyB2JiKBZE89NaQrHvBLjc210j3/view

---


## 🔧 기술 스택
- Frontend: React, TypeScript, SCSS
- Backend: Spring Boot, Kotlin
- Database: MySQL
- Deployment: GCP
- 개발 도구: Figma, IntelliJ IDEA

---

## 🖥️ 주요 화면

#### 1. 로그인 및 토큰 발급 화면

![image](https://github.com/user-attachments/assets/6530bbf7-2913-4be2-b6bd-edb5e2d54b3d)
   - 이메일로 토큰 발급 및 로그인 가능



#### 3. ERD 모드 화면

![image](https://github.com/user-attachments/assets/e8d3a4f5-6b58-4c18-80d0-3ec9f3193680)
   - 데이터베이스 엔티티 설계 및 관리



#### 4. DB 모드 화면
   
![image](https://github.com/user-attachments/assets/8836d4fc-d2d0-428b-8b84-21260e059997)
   - 데이터베이스 테이블 관리



#### 5. Excel Import/Export 화면
   
![KakaoTalk_20241219_042045336](https://github.com/user-attachments/assets/94dff952-815d-4f50-a1b7-b64013b04c75)
   - 엑셀 파일로 데이터 관리



#### 6. REST API 및 필터링 화면
    
![KakaoTalk_20241219_042133403](https://github.com/user-attachments/assets/b73fbf5e-fe67-4d6b-8d0d-d78542c7403a)
   - API URL 적용 및 데이터 접근



#### 7. 데이터베이스 버전 관리 화면
    
![KakaoTalk_20241219_042154880](https://github.com/user-attachments/assets/91ab4238-f320-4336-a6a4-37451de1e340)
   - 데이터 이력 관리

  
---

## 🎉 개발자 및 기여자

- 김보영(프론트엔드)
- 주동호(백엔드)

🏆 졸업작품 대상 수상 프로젝트 (2024)

---


## 💥 기술적 도전

|            기술적 도전            | Why | How | Result |
|:-----------------------------------:|---|---|------|
| **ERD 시각화 및 무결성을 유지한 관계 연결 기능 구현** | ERD 설계 기능을 개발할 때 데이터의 무결성, 노드를 통한 엔티티 시각화가 필요함 | GoJS를 활용해 엔티티를 시각화 하였고, Ref를 활용하여 드래그 앤 드롭 방식으로 엔티티 생성 및 FK 연결 기능을 구현하여, 설계 단계에서 바로 데이터베이스 구축 가능하도록 개발 | 설계와 구축 과정이 유기적으로 연결되어 사용자의 작업 효율 증가, 관계 설정 시간 단축 |
| **모듈화 및 유지보수성 개선** | UI, 비즈니스 로직, 유틸 함수가 분리되지 않아 유지보수가 어려움 | UI, 비즈니스 로직, 유틸 함수를 모듈화하고, 재사용 가능한 컴포넌트 및 커스텀 훅 개발 | 코드 가독성 및 유지보수성 향상 → 신규 기능 추가 시 개발 속도 증가 |
| **성능 최적화** | lighthouse를 통해 평가 받을 시 각 페이지 마다 평균 60점으로 평가 됨| 이미지 WebP 변환 및 CDN 활용하여 이미지 로딩 속도 최적화 하였으며  Context API를 활용해 상태를 직접 업데이트하여 API 재호출 없이 실시간 반영 | lighthouse 평균 점수 90점으로 확장 |


