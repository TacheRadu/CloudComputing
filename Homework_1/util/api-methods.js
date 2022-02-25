const keys = require('./config')
const dateformat = require('date-and-time')
const axios = require('axios')

let getRandomInts = async (count, min, max) => {
    return (await axios.post("https://api.random.org/json-rpc/4/invoke", {
        "jsonrpc": "2.0",
        "method": "generateIntegers",
        "params": {
            "apiKey": keys.randomOrgKey,
            "n": count,
            "min": min,
            "max": max,
            "replacement": true
        },
        "id": 42
    })).data.result.random.data;
}
let getDate = async () => {
    let num = (await getRandomInts(1, 0, 7))[0];
    let date = new Date();
    date.setDate(date.getDate() - num);
    return dateformat.format(date, "YYYY-MM-DD");
}

let getLocation = async () => {
    let num = (await getRandomInts(1, 0, 23847))[0];
    return (await axios.get(
        `http://geodb-free-service.wirefreethought.com/v1/geo/cities?limit=1&offset=${num}&hateoasMode=off`
    )).data.data[0].city;
}

let getWeather = async (date, location) => {
    return (await axios.get(
        `http://api.weatherapi.com/v1/history.json?key=${keys.weatherApiKey}&q=${location}&dt=${date}`
    )).data
}

module.exports = {
    getDate,
    getLocation,
    getWeather,
}