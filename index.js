const http = require('http')
const fs = require('fs');

var requests = require('requests')

const homeFile = fs.readFileSync("home.html", 'utf-8')

const replaceVal = (tempVal, orgVal) => {
    console.log("temprature",orgVal.current.temp_c);
    let temprature = tempVal.replace("{%tempval%}", orgVal.current.temp_c)
    temprature = tempVal.replace("{%humadity%}", orgVal.current.humidity)
    temprature = tempVal.replace("{%cloud%}", orgVal.current.cloud)
    temprature = tempVal.replace("{%country%}", orgVal.location.country)
    temprature = tempVal.replace("{%location%}", orgVal.location.name)
    temprature = tempVal.replace("{%tempStatus%}", orgVal.current.cloud)
    return temprature
}

// console.log("19",temprature);

const server = http.createServer((req, res) => {
    // creating url
    if (req.url == "/") {
        console.log("api calls");
        requests("http://api.weatherapi.com/v1/current.json?key=55593f4f75bf485a804103056230210&q=mumbai&aqi=no")
        .on("data", (chunk) => {
            const objData = JSON.parse(chunk)
            // converting object data into array
            const arrData = [objData]
            console.log("response",arrData);
            const realTimeData = arrData.map((val) => replaceVal(homeFile, val)).join("")
            res.write(realTimeData)
            // console.log("realtimedata",realTimeData);
        })
        .on("end", (err) => {
            if (err) return console.log("connection closed due to error");
            res.end()
        })
    } 
})

server.listen(8000, "127.0.0.1")