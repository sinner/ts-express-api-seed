import envVars from "./bootstrap/env";
import {Server} from "./bootstrap/server";
import {UserRepository} from "./entity/repository/UserRepository";
import {User} from "./entity/User";

let server = new Server(envVars);
server.start();