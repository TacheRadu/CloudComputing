import {IncomingMessage, ServerResponse} from "http";
import {getRequestBody} from "../util/request-data";
import {StatusCodes} from "http-status-codes";
import {Anime} from "../entity/anime.dto";

export async function createAnime(req: IncomingMessage, res: ServerResponse){
    let body = await getRequestBody(req);
    if(body.name){
        let newAnime = new Anime();
        newAnime.name = body.name;
        await newAnime.save();
        if(newAnime){
            res.writeHead(StatusCodes.CREATED, {
            });
            res.end(JSON.stringify(newAnime));
            return;
        }
        res.writeHead(StatusCodes.INTERNAL_SERVER_ERROR, {
            "Content-Type": "application/json"
        });
        res.end(JSON.stringify({
            message: "Could not create new anime."
        }));
        return;
    }
    res.writeHead(StatusCodes.BAD_REQUEST, {
        "Content-Type": "application/json"
    });
    res.end(JSON.stringify({
        message: "Parameters required were not provided."
    }));
}
