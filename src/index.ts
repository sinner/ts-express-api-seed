import * as Fs from "fs";
import * as Path from "path";
import {getConnectionManager, createConnection, ConnectionManager, Connection} from "typeorm";
import envVars from "./bootstrap/env";
import {Server} from "./bootstrap/server";
import {UserRepository} from "./entity/repository/UserRepository";
import User from "./entity/User";

const rootDir = Path.resolve(__dirname+'/..');
const dbSettingsPath = `${rootDir}/ormconfig.json`;
const databaseSettings = JSON.parse(Fs.readFileSync(dbSettingsPath, 'utf8'));

createConnection().then(async connection => {
    let server = new Server(envVars, connection);
    server.start();
}).catch (error => {
    console.log(error);
});