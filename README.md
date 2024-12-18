##D-SIM
###"복잡도는 줄이고, 활용도는 높게"

D-SIM은 데이터베이스 설계 및 관리의 복잡성을 줄이고, 데이터를 직관적으로 활용할 수 있도록 돕는 웹 서비스입니다. 이 프로젝트는 사용자가 데이터베이스를 효율적으로 설계하고 관리하며, 다양한 데이터 활용 기능을 제공하는 것을 목표로 합니다.

📌 주요 기능
1. 데이터베이스 설계 및 관리
ERD 모드:
엔티티 생성 및 관계(FK) 연결.
DB 모드:
테이블 데이터 추가, 수정, 삭제 및 저장.
2. 데이터 입력 및 변환
Excel Import/Export:
엑셀 데이터를 테이블에 업로드하거나 다운로드.
SQL 생성:
다양한 DBMS(MySQL, Oracle 등)에서 사용할 CREATE 및 INSERT 문 자동 생성.
3. REST API와 데이터 접근
REST API URL 제공 및 클라이언트 코드 적용.
조건 기반 데이터 필터링(Custom API) 기능.
4. 데이터 변경 이력 관리
데이터 변경 사항 기록 및 조회.
5. 코드 자동화 및 파일 기반 데이터 생성
DTO 및 API 코드 자동 생성.
파일(.nds)을 이용해 데이터베이스 생성.
6. 미디어 관리 및 테이블 병합
이미지/동영상 저장 및 외부 접근 URL 제공.
여러 테이블 병합 및 결과 저장.
🔧 기술 스택
Frontend: React, TypeScript, SCSS
Backend: Spring Boot, Kotlin
Database: MySQL, Oracle
Deployment: GCP
협업 도구: Figma (UI/UX 설계), IntelliJ IDEA
🚀 시작하기
1. 설치 및 실행
클론하기
bash
코드 복사
git clone https://github.com/your-repository-url
cd D-SIM
의존성 설치
bash
코드 복사
npm install
개발 서버 실행
bash
코드 복사
npm start
2. 백엔드 서버 실행
Spring Boot 프로젝트를 빌드 및 실행합니다.
MySQL 또는 Oracle 설정을 .env 파일에서 변경하세요.
📄 프로젝트 구조
plaintext
코드 복사
D-SIM/
├── frontend/            # 프론트엔드 소스코드
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/             # 백엔드 소스코드
│   ├── src/
│   └── build.gradle
├── docs/                # 문서 및 발표 자료
└── README.md            # 프로젝트 설명 파일
🖥️ 주요 화면
로그인 및 토큰 발급 화면

이메일로 토큰 발급 및 로그인 가능.
ERD 및 DB 모드 화면

데이터베이스 설계 및 테이블 관리.
Excel Import/Export 화면

엑셀 파일로 데이터 관리.
REST API 및 필터링 화면

API URL 적용 및 데이터 접근.
🤝 기여 방법
이슈 생성 또는 기능 제안하기.
새로운 브랜치에서 작업하기.
Pull Request 생성.
🎉 개발자 및 기여자
김보영, 김예지, 주동호, 최현지
졸업작품 대상 수상 프로젝트 (2024)
