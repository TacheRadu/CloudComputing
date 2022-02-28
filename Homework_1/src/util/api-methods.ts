import axios from "axios";
import {Log} from "../models"
import {LogAttributes} from "../models/log";
import {config} from './config'
import * as sequelize from "sequelize";

const dateformat = require('date-and-time')

export async function selectMinMaxAvg(){
    let res = [];
    let x = ["basic", "location", "randint", "weather", "misc"]
    for ( let i in x){
        res.push((await Log.findAll({
            attributes: [[sequelize.fn('min', sequelize.col('latency')), 'minLatency'],
                [sequelize.fn('max', sequelize.col('latency')), 'maxLatency'],
                [sequelize.fn('avg', sequelize.col('latency')), 'avgLatency'],
            ],
            where: {
                requestType: x[i]t rm 
            }
            // @ts-ignore
        }))[0].dataValues);
    }
    return res;
}

export async function getRandomInts(count: number, min: number, max: number) {
    let start = Date.now();
    let res = await axios.post("https://api.random.org/json-rpc/4/invoke", {
        "jsonrpc": "2.0",
        "method": "generateIntegers",
        "params": {
            "apiKey": config.randomOrgKey,
            "n": count,
            "min": min,
            "max": max,
            "replacement": true
        },
        "id": 42
    });
        Log.create({
            latency: Date.now() - start,
            request: "https://api.random.org/json-rpc/4/invoke",
            response: res.statusText,
            requestType: "randint",
        } as LogAttributes).then((log) => {
            log.save();
        })

    return res.data.result.random.data;
}

export async function getDate() {
    let num = (await getRandomInts(1, 0, 7))[0];
    let date = new Date();
    date.setDate(date.getDate() - num);
    return dateformat.format(date, "YYYY-MM-DD");
}

export async function getLocation() {
    let num = (await getRandomInts(1, 0, 23847))[0];
    let start = Date.now();
    let res = await axios.get(
        encodeURI(`http://geodb-free-service.wirefreethought.com/v1/geo/cities?limit=1&offset=${num}&hateoasMode=off`)
    );
    Log.create({
        latency: Date.now() - start,
        request: `http://geodb-free-service.wirefreethought.com/v1/geo/cities?limit=1&offset=${num}&hateoasMode=off`,
        response: res.statusText,
        requestType: "location",
    } as LogAttributes).then((log) => {

        log.save();
    })
    return res.data.data[0].city;
}

export async function getWeather(date: Date, location: string): Promise<object> {
    try {
        let start = Date.now();
        let res = await axios.get(
            encodeURI(`http://api.weatherapi.com/v1/history.json?key=${config.weatherApiKey}&q=${location}&dt=${date}`)
        );
        Log.create({
            latency: Date.now() - start,
            request: `http://api.weatherapi.com/v1/history.json?key=${config.weatherApiKey}&q=${location}&dt=${date}`,
            response: res.statusText,
            requestType: "weather",
        } as LogAttributes).then((log) => {
            log.save();
        })
        return res.data;
    } catch {
        console.log("Retrying...")
        return getWeather(date, await getLocation());
    }
}