import {IncomingMessage, ServerResponse} from "http";
import {getRequestBody} from "../util/request-data";
import {User} from "../entity/user.dto";
import {Anime} from "../entity/anime.dto";
import {AnimeEntry} from "../entity/anime-entry.dto";
import {StatusCodes} from "http-status-codes";

export async function addAnimeToUserList(req: IncomingMessage, res: ServerResponse) {
    let body = await getRequestBody(req);
    let user = await User.findOne(req.url?.split("/")[2]);
    if (user) {
        let theAnime = await Anime.findOne(body.id);
        if (theAnime) {
            let newEntry = new AnimeEntry();
            newEntry.anime = theAnime;
            newEntry.user = user;
            newEntry.status = body.status || "Plan to watch";
            await newEntry.save();
            if (newEntry) {
                res.writeHead(StatusCodes.CREATED, {
                    "Content-Type": "application/json"
                });
                res.end(JSON.stringify(newEntry));
                return;
            }
            res.writeHead(StatusCodes.INTERNAL_SERVER_ERROR, {
                "Content-Type": "application/json"
            });
            res.end(JSON.stringify({
                message: "Could not add anime to list."
            }));
            return;
        }
        res.writeHead(StatusCodes.BAD_REQUEST, {
            "Content-Type": "application/json"
        });
        res.end(JSON.stringify({
            message: "Bad anime id."
        }));
        return;
    }
    res.writeHead(StatusCodes.BAD_REQUEST, {
        "Content-Type": "application/json"
    });
    res.end(JSON.stringify({
        message: "Bad user id."
    }));
}
