#!/bin/sh

BASE_DIR="/home/urban"
PROJECT_DIR="prod-fe-memberportal"
PROJECT_NAME="prod-fe-memberportal"
PROJECT_RUN_FILE="./dist/main.js"


TODAY=`date +%y-%m-%d`

cd ${BASE_DIR}/${PROJECT_DIR}

echo "7. 배포 전 빌드 파일 백업"
tar -zcvf deploy_backup_$TODAY.tar ./dist

echo "8. 빌드 파일 제거"
rm -rf ./dist

echo "9. 배포 파일 압축풀기"
tar -zxvf deploy.tar --no-same-owner

