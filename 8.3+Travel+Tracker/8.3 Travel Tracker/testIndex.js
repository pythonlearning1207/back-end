import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
const app = express();
const port = 3000;
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "world",
    password: "Jia3202128",
    port: 5432,
});
db.connect();
//checkVisited()
async function checkVisited(){
    let result = await db.query("SELECT country_code FROM visited_countries;");
    result = result.rows;
    let newArr= [];
    result.forEach(country =>{
        newArr.push(country.country_code);
    })
    return newArr;
}
//get '/'
app.get("/", async(req, res)=>{
    let result = await checkVisited();
    console.log(result);
    res.render("index.ejs",{
        total: result.length,
        countries: result,
    })
})
//post add
app.post("/add", async(req, res)=>{
    let usersubmit = req.body.country;
    console.log(usersubmit);
    try {
        const result = await db.query("SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';", [usersubmit.toLowerCase()]);
        const data = result.rows[0];
        const countryCode = data.country_code;
        console.log(countryCode);
        try {
            await db.query(
                "INSERT INTO visited_countries(country_code) VALUES($1);", [countryCode]);
            res.redirect("/");
    
        } catch (err) {
            console.log(err);
            const data = await checkVisited();
            res.render("index.ejs",{
                total: data.length,
                countries: data,
                error: "Country has already been added."
            })
        }
    } catch (err) {
        console.log(err);
        const data = await checkVisited();
        res.render("index.ejs", {
            total: data.length,
            countries: data,
            error: "Country name does not exist, try again.",
        })
    }
})
//listen
app.listen(port, (req, res)=>{
    console.log(`Server on port ${port}`);
})