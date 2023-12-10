const exp = require("express");
const app = exp();
const path = require("path");
const { open } = require("sqlite");
app.use(exp.json());
const sqlite3 = require("sqlite3");
const db_path = path.join(__dirname, "cricketTeam.db");
let db = null;
// function to convert snakecase to camelcase
const convertsnakecase = (eachdb) => {
  return {
    playerId: eachdb.player_id,
    playerName: eachdb.player_name,
    jerseyNumber: eachdb.jersey_number,
    role: eachdb.role,
  };
};

//Database_connection

const installconnection = async () => {
  try {
    db = await open({
      filename: db_path,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server_staarted");
    });
  } catch (e) {
    console.log(e.message);
  }
};
installconnection();

//API 1

app.get("/players/", async (request, response) => {
  let query = `
    select
    *
    from 
    cricket_team`;
  let array = await db.all(query);
  response.send(array.map((each) => convertsnakecase(each)));
});
//API 2

app.post("/players/", async (request, response) => {
  let adding = request.body;
  let { player_name, jersey_number, role } = adding;
  const query = `
    INSERT INTO 
    cricket_team(player_name,jersey_number,role)
    VALUES
    ('${player_name}',${jersey_number},'${role}');`;
  let result = await db.run(query);
  response.send("Player Added to Team");
});

//API 3

app.get("/players/:playerId/", async (request, response) => {
  let { playerId } = request.params;
  let query = `
  select 
  *
  from
  cricket_team
  WHERE
  player_id=${playerId};`;
  const player_details = await db.get(query);
  response.send(convertsnakecase(player_details));
});
// API 4
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const { player_name, jersey_number, role } = request.body;
  let query = `
    UPDATE
    cricket_team
    SET
    player_name='${player_name}',
    jersey_number=${jersey_number},
    role='${role}'
    where 
    player_id=${playerId};`;
  let result = await db.run(query);
  response.send("Player Details Updated");
});

//API 5

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  let query = `
    DELETE FROM 
    cricket_team
    WHERE
    player_id=${playerId};`;
  let result = await db.run(query);
  response.send("Player Removed");
});
module.exports = app;
