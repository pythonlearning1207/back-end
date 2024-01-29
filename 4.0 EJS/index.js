import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;
var weekend = false;

app.set("view engine", "ejs");
function myGetDay(req, res, next) {
    const today = new Date();
    const yesterday = new Date(today.getTime() - 86400000);
    console.log(today);
    const dayOfWeek = today.getDay();
    console.log(dayOfWeek);
    if (dayOfWeek === 0 || dayOfWeek === 6) {
        weekend = true;
    }
    next();
}

app.use(myGetDay);

app.get("/", (req, res)=> {
    if (weekend) {
        res.render("index.ejs",{
            dayType: "weekend",
            advise: "It's time to have fun",
        });
    } else {
        res.render("index.ejs",{
            dayType: "weekday",
            advise: "It's time to work hard",
        });
    }
})

app.listen(port, (req, res)=> {
    console.log(`Server is listening on port ${port}`);
})