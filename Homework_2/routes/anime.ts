import {IncomingMessage, ServerResponse} from "http";
import {createAnime, getAllAnime, getAnime} from "../controllers/anime";
import {StatusCodes} from "http-status-codes";

export async function animeRouter(req: IncomingMessage, res: ServerResponse){
    let pathEntries = req.url?.split("/") || [];
    console.log(pathEntries);
    if (req.method == "POST") {
        if (pathEntries.length == 2) {
            createAnime(req, res);
            return;
        }
    } else if(req.method == "GET"){
        if (pathEntries.length == 2) {
            getAllAnime(req, res);
            return;
        } else if(pathEntries.length == 3){
            getAnime(req, res);
            return;
        }
    }
    res.writeHead(StatusCodes.BAD_REQUEST, {
        "Content-Type": "application/json"
    });
    res.end(JSON.stringify({
        message: "Bad path/verb used."
    }));
}