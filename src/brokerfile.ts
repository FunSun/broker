import * as path from 'path'
import * as fs from 'fs'

export function runBrokerFile(useHome:boolean):void {
    let brokerFilePath = ""
    if (!useHome) {
        brokerFilePath = findBrokerFilePathFromCwd()
    }
    if (brokerFilePath === "") {
        brokerFilePath = findBrokerFilePathFromHome()
    }
    if (brokerFilePath === "") {
        throw "No brokerfile found."
    }

    if ((global as any).verbose === true) {
        console.log("Read brokerfile: ", brokerFilePath)
    }

    process.chdir(path.dirname(brokerFilePath))
    let brokerFileContent = fs.readFileSync(brokerFilePath).toString()
    eval(brokerFileContent)
}

function findBrokerFilePathFromCwd():string {
    let dir = process.cwd()
    while (dir !== "/") {
        let filename = path.join(dir, "broker.js")
        if (fs.existsSync(filename)) {
            return filename
        }
        dir = path.dirname(dir)
    }
    return ""
}

function findBrokerFilePathFromHome():string {
    let filename = path.join(process.env.HOME, "broker.js")
    if (fs.existsSync(filename)) {
        return filename
    }
    return ""
}

