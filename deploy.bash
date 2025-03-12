#!/bin/bash

# 설정
LOCAL_BUILD_DIR="./build"  # 로컬 빌드 디렉토리 (React 빌드 파일)
REMOTE_USER="sptjoodongho"  # 원격 서버의 사용자
REMOTE_HOST="35.216.53.231"  # 원격 서버의 IP 주소
REMOTE_DIR="/home/sptjoodongho"    # 원격 서버에 파일을 저장할 디.렉토리

# 빌드 파일 전송 시작
echo "빌드 파일 전송 시작"

# scp 명령어로 빌드 파일 전송
scp -r $LOCAL_BUILD_DIR/ $REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR

# 전송 완료 확인
if [ $? -eq 0 ]; then
    echo "빌드 파일 전송 완료"
else
    echo "빌드 파일 전송 실패"
    exit 1
fi

# 서버에서 새로운 파일이 제대로 배포되었는지 확인
ssh $REMOTE_USER@$REMOTE_HOST "ls $REMOTE_DIR"

echo "배포 프로세스 종료"
