# 1. Node.js v23.3.0 이미지를 사용하여 빌드
FROM node:23.3.0 AS build

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. 패키지 파일을 복사하고 의존성 설치
COPY package.json package-lock.json ./
RUN npm install

# 4. 프로젝트 소스를 복사
COPY . ./

# 5. React 프로젝트 빌드
RUN npm run build

# 6. nginx 이미지 사용하여 빌드된 파일을 서빙rrr
FROM nginx:alpine

# 7. 빌드된 정적 파일을 nginx의 서빙 디렉토리로 복사 ( 이 위치는 고정 )
COPY --from=build /app/build /usr/share/nginx/html

# 8. nginx의 기본 포트 80을 노출
EXPOSE 80

# 9. nginx 서버 시작
CMD ["nginx", "-g", "daemon off;"]
