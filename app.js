const express = require("express");
const path = require("path");
const app = express();
app.use(express.json());

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const dbPath = path.join(__dirname, "moviesData.db");
let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

//GET all Movies API
app.get("/movies/", async (request, response) => {
  const getAllMoviesQuery = `
        SELECT
          movie_name as movieName
        FROM
          movie;
    `;
  const movieArray = await db.all(getAllMoviesQuery);
  response.send(movieArray);
});

//POST a new movie
app.post("/movies/", async (request, response) => {
  const movieDetails = request.body;
  const { movieId, directorId, movieName, leadActor } = movieDetails;
  const addNewMovieQuery = `
        INSERT INTO movie (movie_id,director_id,movie_name,lead_actor)
        VALUES (${movieId},${directorId},'${movieName}','${leadActor}');`;
  const dbResponse = await db.run(addNewMovieQuery);
  const bookId = dbResponse.lastId;
  response.send({ movieId: movieId });
});
