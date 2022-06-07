# build_package

## 安装
    npm i -g build_package

## 使用
以下打包均不含当前文件夹下node_modules以及.开头的文件或文件夹，剩余文件均称所有,如不存在文件则会报错阻断程序
ts-node ./src/bin.ts 打包当前文件夹下所有文件且默认输出为out.zip
ts-node ./src/bin.ts ./src 打包前文件夹下的指定文件夹src且默认输出为out.zip
ts-node ./src/bin.ts ./src -o xxx 打包前文件夹下的指定文件夹src且输出为xxx
ts-node ./src/bin.ts -o xxx 打包前文件夹下的所有文件夹且输出为xxx