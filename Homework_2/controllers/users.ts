import {IncomingMessage, ServerResponse} from "http";
import {User} from "../entity/user.dto";
import {StatusCodes} from "http-status-codes";
import {getRequestBody} from "../util/request-data";
import {AnimeEntry} from "../entity/anime-entry.dto";


export async function createUser(req: IncomingMessage, res: ServerResponse) {
    let body = await getRequestBody(req);
    if (body.name) {
        let newUser = new User();
        newUser.name = body.name;
        await newUser.save();
        if (newUser) {
            res.writeHead(StatusCodes.CREATED, {});
            res.end(JSON.stringify(newUser));
            return;
        }
        res.writeHead(StatusCodes.INTERNAL_SERVER_ERROR, {
            "Content-Type": "application/json"
        });
        res.end(JSON.stringify({
            message: "Could not create new user."
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

export async function getAllUsers(req: IncomingMessage, res: ServerResponse) {
    let users = await User.find();
    res.writeHead(StatusCodes.OK, {
        "Content-Type": "application/json"
    });
    res.end(JSON.stringify(users));
}

export async function getUser(req: IncomingMessage, res: ServerResponse) {
    let user = await User.findOne(req.url?.split("/")[2]);
    if (user) {
        await user.animeList;
        res.writeHead(StatusCodes.OK, {
            "Content-Type": "application/json"
        });
        res.end(JSON.stringify(user));
        return;
    }
    res.writeHead(StatusCodes.NOT_FOUND, {
        "Content-Type": "application/json"
    });
    res.end(JSON.stringify({
        message: "Invalid user id."
    }));
}

export async function getUserAnimeList(req: IncomingMessage, res: ServerResponse) {
    let user = await User.findOne(req.url?.split("/")[2]);
    if (user) {
        let animeList = await user.animeList;
        res.writeHead(StatusCodes.OK, {
            "Content-Type": "application/json"
        });
        res.end(JSON.stringify(animeList));
        return;
    }
    res.writeHead(StatusCodes.NOT_FOUND, {
        "Content-Type": "application/json"
    });
    res.end(JSON.stringify({
        message: "Invalid user id."
    }));
}

export async function getUserAnimeListEntry(req: IncomingMessage, res: ServerResponse) {
    let user = await User.findOne(req.url?.split("/")[2]);
    if (user) {
        let animeEntry = await AnimeEntry.findOne({
            where: {
                user,
                id: req.url?.split("/")[4]
            }
        });
        if (animeEntry) {
            res.writeHead(StatusCodes.OK, {
                "Content-Type": "application/json"
            });
            res.end(JSON.stringify(animeEntry));
            return;
        }
        res.writeHead(StatusCodes.NOT_FOUND, {
            "Content-Type": "application/json"
        });
        res.end(JSON.stringify({
            message: "Invalid anime entry id."
        }));
        return;
    }
    res.writeHead(StatusCodes.NOT_FOUND, {
        "Content-Type": "application/json"
    });
    res.end(JSON.stringify({
        message: "Invalid user id."
    }));
}

export async function updateUser(req: IncomingMessage, res: ServerResponse) {
    let body = await getRequestBody(req);
    let user = await User.findOne(req.url?.split("/")[2]);
    if (user) {
        if (body.name) {
            user.name = body.name;
        }
        await user.save();
        res.writeHead(StatusCodes.OK, {
            "Content-Type": "application/json"
        });
        res.end(JSON.stringify(user));
        return;
    }
    res.writeHead(StatusCodes.NOT_FOUND, {
        "Content-Type": "application/json"
    });
    res.end(JSON.stringify({
        message: "Invalid user id."
    }));
}

export async function updateUserAnimeListEntry(req: IncomingMessage, res: ServerResponse) {
    let body = await getRequestBody(req);
    let user = await User.findOne(req.url?.split("/")[2]);
    if (user) {
        let entry = await AnimeEntry.findOne({
            where: {
                user,
                id: req.url?.split("/")[4]
            }
        });
        if (entry) {
            if (body.episodesWatched) {
                entry.episodesWatched = body.episodesWatched;
            }
            if (body.status) {
                entry.status = body.status;
            }
            await entry.save();
            res.writeHead(StatusCodes.OK, {
                "Content-Type": "application/json"
            });
            res.end(JSON.stringify(entry));
            return;
        }
        res.writeHead(StatusCodes.NOT_FOUND, {
            "Content-Type": "application/json"
        });
        res.end(JSON.stringify({
            message: "Invalid anime entry id."
        }));
        return;
    }
    res.writeHead(StatusCodes.NOT_FOUND, {
        "Content-Type": "application/json"
    });
    res.end(JSON.stringify({
        message: "Invalid user id."
    }));
}