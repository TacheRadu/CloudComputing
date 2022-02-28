import {IncomingMessage, ServerResponse} from "http";
import {Log} from '../models'
import {LogAttributes} from "../models/log";


export async function makeLog(start: number, request_type: "basic" | "location" | "randint" | "weather" | "misc", req: IncomingMessage, res: ServerResponse) {
    Log.create({
        latency: Date.now() - start,
        requestType: request_type,
        request: req.url!,
        response: res.statusMessage!,
    } as LogAttributes).then(log => {
        log.save();
    })

}

