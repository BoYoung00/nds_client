#!/bin/bash

# 설정
USER="donghoju812"          # 원격 서버 사용자 이름
HOST="34.22.64.18"       # 원격 서버 호스트명 또는 IP
REMOTE_PATH="/home/donghoju812/data-client"  # 원격 서버에 파일을 저장할 경로

# 빌드 파일 전송
scp -r build/* $USER@$HOST:$REMOTE_PATH

echo "Deployment completed successfully!"