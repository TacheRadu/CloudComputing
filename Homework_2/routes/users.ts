import {IncomingMessage, ServerResponse} from "http"
import {StatusCodes} from "http-status-codes";
import {createUser, getAllUsers, getUser, getUserAnimeList, getUserAnimeListEntry} from "../controllers/users";
import {addAnimeToUserList} from "../controllers/anime-entry";

export async function usersRouter(req: IncomingMessage, res: ServerResponse) {
    let pathEntries = req.url?.split("/") || [];
    console.log(pathEntries);
    if (req.method == "POST") {
        if (pathEntries.length == 2) {
            createUser(req, res);
            return;
        } else if (pathEntries.length == 4) {
            addAnimeToUserList(req, res);
        }
    } else if (req.method == "GET") {
        if (pathEntries.length == 2) {
            getAllUsers(req, res);
            return;
        } else if (pathEntries.length == 3) {
            getUser(req, res);
            return;
        } else if (pathEntries.length == 4 && pathEntries[3] == "anime") {
            getUserAnimeList(req, res);
            return;
        } else if (pathEntries.length == 5 && pathEntries[3] == "anime") {
            getUserAnimeListEntry(req, res);
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