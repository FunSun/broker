export type Handler = (args:string[], options?:any) => void

export class Task {
    name: string
    handler: Handler
    description: string = ""

    constructor(name: string, handler: Handler) {
        this.name = name
        this.handler = handler
    }

    desc(d:string) {
        this.description = d
    }
}

let tasks:{[key:string]:Task} = {}

export function registTask(t: Task):void {
    tasks[t.name] = t
}

export function getTask(name: string):Task {
    return tasks[name]
}

export function getAllTask():{[key:string]:Task} {
    return tasks
}
