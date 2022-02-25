const http = require('http');
const fs = require('fs');
const { StatusCodes } = require('http-status-codes');
const { getDate, getLocation, getWeather } = require('./util/api-methods')


MIMETypes = {
    html: "text/html",
    css: "text/css",
    js: "application/javascript",
    xml: "text/xml",
    mp4: "video/mp4",
    png: "image/png",
    ico: "image/x-icon",
};


let server = http.createServer(async (req, res) => {
    const baseUrl = "https://" + req.headers.host + "/";
    const pathName = new URL(req.url, baseUrl).pathname;
    const extension = req.url.split(".")[1];
    let resource = req.url.slice(1) === "" ? "/" : req.url.slice(1);

    if (pathName.startsWith('/random/weather')) {
        let date = await getDate();
        let location = await getLocation();
        let weather = await getWeather(date, location);
        res.writeHead(StatusCodes.OK, {
            "Content-Type": "application/json"
        });
        res.end(JSON.stringify(weather));
    } else if (pathName === '/') {
        res.writeHead(StatusCodes.OK, {
            "Content-Type": "text/html"
        });
        if (fs.existsSync("index.html")) {
            fs.readFile("index.html", (err, data) => {
                if (err) {
                    console.log("[ ERROR ]:".error, err.message);
                } else {
                    res.end(data);
                }
            });
        }
    } else {
        const mimetype = MIMETypes[extension === undefined ? "html" : extension];
        if (mimetype) {
            res.writeHead(StatusCodes.OK, {
                "Content-Type": mimetype,
            });
        }

        if (fs.existsSync(resource)) {
            fs.readFile(resource, (err, data) => {
                if (err) {
                    console.log("[ ERROR ]:".error, err.message);
                } else {
                    res.end(data);
                }
            });
        }
        ;
    }
});

server.listen(3212, "0.0.0.0", () => {
    console.log("listening")
});
