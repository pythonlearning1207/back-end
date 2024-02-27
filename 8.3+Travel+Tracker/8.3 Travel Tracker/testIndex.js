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
    let result = await db.query("SELECT countries_code FROM visited_countries");
    result = result.rows;
    let newArr= [];
    result.forEach(country =>{
        newArr.push(country.countries_code);
    })
    return newArr;
}
//get '/'
app.get("/", async(req, res)=>{
    let result = await checkVisited();
    res.render("index.ejs",{
        total: result.length,
        countries: result,
    })
})
//post add
app.post("/add", async(req, res)=>{
    let usersubmit = req.body.country;
    try {
        let result = await db.query(
            "SELECT countries_code FROM countries WHERE LOWER(countries_name) LIKE '%' || $1 || '%');", [usersubmit].toLowerCase());
        result = result.rows[0].countries_code;
        try {
            let insertResult = await db.query(
                "INSERT INTO visited_countries(country_code) VALUES($1);", [result]);
            res.redirect("/");
    
        } catch (err) {
            let data = await checkVisited();
            res.render("index.ejs",{
                total: data.length,
                countries: data,
                error: "Country has already been added."
            })
        }
    } catch (err) {
        let data = await checkVisited();
        res.render("index.ejs", {
            total: data.length,
            countries: data,
            error: "Cant't find the country you entered. Please try agian",
        })
    }
})
//listen
app.listen(port, (req, res)=>{
    console.log(`Server on port ${port}`);
})