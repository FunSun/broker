#!/usr/bin/env node

import {registAPI} from './api'
import {runBrokerFile} from './brokerfile'
import {getTask, getAllTask} from './task'

function runTask(args: Args) {
    let taskName = args.taskName
    let task = getTask(taskName)
    if (task === undefined) {
        throw `Task ${taskName} not found.`
    }
    task.handler(args.taskArgs)
}

class Args {
    globalOptions: {[key:string]:boolean} = {}
    taskName: string = ""
    taskArgs: string[] = []
    taskOptions: {[key:string]:string} = {}
}

function parseArgs() {
    let args = new Args
    let rawArgs  = process.argv.slice(2)
    if (rawArgs.length === 0) {
        args.globalOptions["help"] = true
        return args
    }
    while (rawArgs.length != 0 && rawArgs[0][0] === '-') {
        switch(rawArgs[0]) {
            case '-v':
            args.globalOptions["verbose"] = true
            break
            case '-g':
            args.globalOptions["global"] = true
            break
            case '-h':
            args.globalOptions["help"] = true
            break
        }
        rawArgs = rawArgs.slice(1)
    }
    if (rawArgs.length === 0) {
        args.globalOptions["help"] = true
        return args
    }
    args.taskName = rawArgs[0]
    args.taskArgs = rawArgs.slice(1)
    return args
}

function printHelp() {
    let tasks = getAllTask()
    console.log("This is help.")
    console.log("")
    for (let taskname in tasks) {
        let taskLine = taskname
        if (tasks[taskname].description !== "") {
            taskLine += " -- " + tasks[taskname].description
        }
        console.log(taskLine)
    }
}

function main() {
    try {
        registAPI()

        let args = parseArgs()
        if (args.globalOptions["verbose"]) {
            (global as any).verbose = true
        }
        runBrokerFile(args.globalOptions["global"])
        if (args.globalOptions["help"]) {
            printHelp()
            return
        }
        if ((global as any).verbose) {
            console.log("cwd: ", process.cwd())
        }
        runTask(args)
    } catch(e) {
        console.log(e)
    }
}

main()
