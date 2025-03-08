#!/bin/bash

# 构建前端
echo "Building frontend..."
npm run build

# 启动前端服务
echo "Starting frontend server..."
# cd ../twichain-client
npm run start