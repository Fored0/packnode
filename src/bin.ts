#!/usr/bin/env node
import fs from 'fs-extra';
import os from 'os'
import getTime from './time'
import { cwd } from 'process'
const archiver = require('archiver');
const spawn = require('cross-spawn');
const args = process.argv;

let outputDir = fs.readdirSync(cwd()).filter((file) => {
  return file.slice(0, 1) !== '.' && file !== 'node_modules'
})
let tmpPath = os.tmpdir()
const date = getTime.getYMDHMS((new Date).getTime())

function buildPackage(name?: string) {
  spawn.sync('npm', ['i', '--production'], { stdio: 'inherit', shell: true, cwd: `${tmpPath}/packnode/${date}` })
  let archive = archiver('zip', { zlib: { level: 9 } })
  let output
  if (name) {
    output = fs.createWriteStream(`${cwd()}/${name}`);
  } else {
    output = fs.createWriteStream(`${cwd()}/out.zip`);
  }
  archive.pipe(output);
  archive.directory(`${tmpPath}/packnode/${date}`, false);
  archive.finalize();
}

function logPath(outputName?: string) {
  console.log('打包文件夹路径为:', `${tmpPath}\\packnode\\${date}`);
  if (outputName) { console.log('压缩包路径为:', `${cwd()}\\${outputName}`); }
  else { console.log('压缩包输出路径为:', `${cwd()}\\out.zip`); }
}

//解析
if (args.length === 2) {
  outputDir.forEach((item) => {
    fs.copySync(`./${item}`, `${tmpPath}/packnode/${date}/${item}`, { overwrite: true })
  })
  buildPackage()
  logPath()
}
else {
  // 包含-o输出指定文件名,-o之后无参默认输出全部且为out.zip
  if (args.includes('-o')) {
    let index = args.indexOf('-o')
    const outputName = args.slice(index + 1, index + 2).join()
    //index为2说明打包整个文件为outputName,index>2说明打包[2,index)指定文件并且输出为outputName
    if (index > 2) {
      let inputDir = args.slice(2, index)
      let outDir = []
      inputDir.forEach((item) => {
        if (fs.existsSync(`${cwd()}/${item}`)) {
          outDir.push(item)
        } else {
          throw new Error(cwd() + '路径中不存在' + item + '该文件');
        }
      })
      if (outDir.length !== 0) {
        fs.copySync('./package.json', `${tmpPath}/packnode/${date}/package.json`, { overwrite: true })
        outDir.forEach((item) => {
          fs.copySync(`./${item}`, `${tmpPath}/packnode/${date}/${item}`, { overwrite: true })
        })
        buildPackage(outputName)
        logPath(outputName)
      }
    } else {
      outputDir.forEach((item) => {
        fs.copySync(`./${item}`, `${tmpPath}/packnode/${date}/${item}`, { overwrite: true })
      })
      buildPackage(outputName)
      logPath(outputName)
    }
  } else {
    // 不含-o，指定文件夹且输出为out.zip
    let outDir = []
    args.slice(2).forEach((item) => {
      if (fs.existsSync(`${cwd()}/${item}`)) {
        outDir.push(item)
      } else {
        throw new Error(cwd() + '路径中不存在' + item + '该文件');
      }
    })
    if (outDir.length !== 0) {
      fs.copySync('./package.json', `${tmpPath}/packnode/${date}/package.json`, { overwrite: true })
      outDir.forEach((item) => {
        fs.copySync(`./${item}`, `${tmpPath}/packnode/${date}/${item}`, { overwrite: true })
      })
      buildPackage()
      logPath()
    }
  }
}
