#!/bin/bash

echo "Did you pack the spring boot project (backend)? yes or no";

read packed

if [ $packed == 'yes' ]
then
   echo "Okay there we go ..."
else
  echo "please pack backend first!"
  exit;
fi

# move backend files to deployment dir
rm -rf ./ewa_deploy/backend/server
mkdir ./ewa_deploy/backend/server
echo "backend dist cleaned not build!"
echo "...................."
cp ./ewa_backend/target/ewa_backend-1.0.war ./ewa_deploy/backend/server
echo "backend dist updated!"

# move socket files to deployment dir
( cd ./ewa_socket ; npm i && npm run build )
rm -rf ./ewa_deploy/socket/server
mkdir ./ewa_deploy/socket/server
echo "socket dist cleaned and build!"
echo "...................."
cp -fR ./ewa_socket/dist/. ./ewa_deploy/socket/server

echo "socket package.jason copy!"
cp ./ewa_socket/package.json ./ewa_deploy/socket/server/package.json
cp ./ewa_socket/package-lock.json ./ewa_deploy/socket/server/package-lock.json
echo "socket dist updated!"

# move frontend files to deployment dir
( cd ./ewa_tetris ; npm i && ng build )
rm -rf ./ewa_deploy/frontend/tetris
mkdir ./ewa_deploy/frontend/tetris
echo "frontend dist cleaned and build!"
echo "...................."
cp -fR ./ewa_tetris/dist/tetris/. ./ewa_deploy/frontend/tetris
rm -rf ./ewa_tetris/dist
echo "frontend dist updated!"


echo "Deploying to your host?"
echo "What is your host login name (root@example.com):"
read hostname;
echo "The app wil be uploaded to:" $hostname ":/var/www/tetris on the server"

scp -r ewa_deploy/* $hostname:/var/www/tetris
ssh $hostname "cd /var/www/tetris; docker-compose up -d --build"

rm -rf ./ewa_deploy/backend/server ./ewa_deploy/socket/server ./ewa_deploy/frontend/tetris


