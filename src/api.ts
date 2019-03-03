import {Task, Handler, registTask} from './task'
const http = require('http')
import {exec} from "shelljs"
import * as fs from 'fs'

function  task(name: string, handler: Handler|string):Task {
    let handler1:Handler
    if (typeof handler === "string") {
        handler1 = buildSimpleCommandHandler(handler as string)
    } else{
        handler1 = handler as Handler
    }
    let t = new Task(name, handler1)
    registTask(t)
    return t
}

function shell(cmd:string) {
    exec(cmd)
}

const util = require('util')
const execSync = util.promisify(require('child_process').exec)

async function cmdP(cmd:string):Promise<string> {
    const { stdout } = await execSync(cmd)
    return stdout
  }

async function curlP (url:string):Promise<string> {
  return await new Promise((resolve, reject) => {
    let req = http.request({
      host: url,
      method: "GET",
      headers: {
        "User-Agent": "curl/7.62.0"
      }

    }, (res:any) => {
      res.on("data", (data:any) => {
        resolve(data.toString())
      })
    })
    req.end()
  })
}

function buildSimpleCommandHandler(cmd: string):Handler{
    return (args:string[]) => {
        shell(cmd)
    }
}

export function registAPI() {
    let globalObj = global as any
    globalObj.task = task
    globalObj.shell = shell
    globalObj.cmdP = cmdP
    globalObj.curlP = curlP
    globalObj.readFileSync = fs.readFileSync
    globalObj.readFileSync = fs.writeFileSync
}




