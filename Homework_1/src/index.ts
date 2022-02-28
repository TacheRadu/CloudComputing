import {IncomingMessage, ServerResponse} from "http";
import {makeLog} from "./util/logging"
import * as sequelize from 'sequelize'
import ErrnoException = NodeJS.ErrnoException;

const http = require('http');
const fs = require('fs');
const {StatusCodes} = require('http-status-codes');
const {getDate, getLocation, getWeather} = require('./util/api-methods')
import {dbConfig} from './models'
import {Log} from "./models/log";
import {selectMinMaxAvg} from "./util/api-methods";


const MIMETypes = {
    html: "text/html",
    css: "text/css",
    js: "application/javascript",
    xml: "text/xml",
    mp4: "video/mp4",
    png: "image/png",
    ico: "image/x-icon",
};

dbConfig
    .sync()
    .then(() => console.log("connected to db"))
    .catch(() => {
        throw "error";
    });
let server = http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
    const start = Date.now();
    const baseUrl = "https://" + req.headers.host + "/";
    const pathName = new URL(req.url!, baseUrl).pathname;
    const extension = req.url!.split(".")[1];
    let resource = req.url!.slice(1) === "" ? "/" : req.url!.slice(1);

    if (pathName.startsWith('/random/weather')) {
        let date = await getDate();
        let location = await getLocation();
        let weather = await getWeather(date, location);
        res.writeHead(StatusCodes.OK, {
            "Content-Type": "application/json"
        });
        res.end(JSON.stringify(weather));
        makeLog(start, "basic", req, res);
    } else if (pathName.startsWith('/metrics')) {

        let mma = await selectMinMaxAvg();
        // @ts-ignore
        let response = "<html><body><table><tr><td>Response/Latency</td><td>Min</td><td>Avg</td><td>Max</td></tr>"
        for (let i = 0; i < 5; i++){
            response += "<tr>";
            switch (i){
                case 0:
                    response += "<td>Basic</td>"
                    break;
                case 1:
                    response += "<td>Location</td>"
                    break;
                case 2:
                    response += "<td>RandInt</td>"
                    break;
                case 3:
                    response += "<td>Weather</td>"
                    break;
                case 4:
                    response += "<td>Misc</td>"
                    break;
            }
            // @ts-ignore
            response += "<td>" + mma[i].minLatency + "</td>";
            // @ts-ignore
            response += "<td>" + mma[i].avgLatency + "</td>";
            // @ts-ignore
            response += "<td>" + mma[i].maxLatency + "</td>";
            response += "</tr>"
        }
        response += "</table></body></html>"
        res.writeHead(StatusCodes.OK, {
            "Content-Type": "text/html"
        });
        res.end(response);
        makeLog(start, "misc", req, res);
    } else if (pathName === '/') {
        res.writeHead(StatusCodes.OK, {
            "Content-Type": "text/html"
        });
        if (fs.existsSync("public/index.html")) {
            fs.readFile("public/index.html", (err: ErrnoException, data: Buffer) => {
                if (err) {
                    console.log("[ ERROR ]: ", err.message);
                } else {
                    res.end(data);
                    makeLog(start, "misc", req, res);
                }
            });
        }
    } else {
        const mimetype = MIMETypes[extension === undefined ? "html" : extension as keyof typeof MIMETypes];
        if (mimetype) {
            res.writeHead(StatusCodes.OK, {
                "Content-Type": mimetype,
            });
        }

        if (fs.existsSync(resource)) {
            fs.readFile(resource, (err: ErrnoException, data: Buffer) => {
                if (err) {
                    console.log("[ ERROR ]: ", err.message);
                } else {
                    res.end(data);
                    makeLog(start, "misc", req, res);
                }
            });
        }

    }

});

server.listen(3212, "0.0.0.0", () => {
    console.log("listening")
});
