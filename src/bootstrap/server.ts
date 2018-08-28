import * as Fs from "fs";
import * as Path from "path";
import "reflect-metadata";
import "@tsed/swagger";
import "@tsed/typeorm";
import {ServerLoader, ServerSettings, GlobalAcceptMimesMiddleware} from "@tsed/common";
import { Connection } from 'typeorm';

const rootDir = Path.resolve(__dirname+'/../..');
const sslKeyFile = Fs.readFileSync(
    Path.resolve(process.cwd()+'/'+process.env.SSL_KEY)
);
const sslCertFile = Fs.readFileSync(
    Path.resolve(process.cwd()+'/'+process.env.SSL_CERT)
);

const sslPassPhrase = process.env.SSL_PASSPHRASE;
const httpPort = process.env.HTTP_PORT;
const httpsPort = process.env.HTTPS_PORT;

const dbSettingsPath = `${rootDir}/ormconfig.json`;
const databaseSettings = JSON.parse(Fs.readFileSync(dbSettingsPath, 'utf8'));

console.log(`Reading DB settings from file from ${dbSettingsPath}: \n ${databaseSettings}`);

@ServerSettings({
    rootDir,
    acceptMimes: ["application/json"],
    debug: false,
    httpPort,
    httpsPort,
    httpsOptions: {
        key: sslKeyFile,
        cert: sslCertFile,
        passphrase: sslPassPhrase
    },
    typeorm: {
        'db': databaseSettings
    },
    swagger: {
        path: "/api-docs"
    },
    mount: {
        "/": `${rootDir}/controllers/current/**/*.ts`,
        "/v1": `${rootDir}/controllers/v1/**/*.ts`
    },
    componentsScan: [
        `${rootDir}/middlewares/**/*.ts`,
        `${rootDir}/services/**/*.ts`,
        `${rootDir}/converters/**/*.ts`
    ],
    customServiceOptions: {}
})
export class Server extends ServerLoader {

    constructor(private processEnv: any, private connection: Connection) {
        super();
    }

    /**
     * This method let you configure the middleware required by your application to works.
     * @returns {Server}
     */
    public $onMountingMiddlewares(): void|Promise<any> {

        const cookieParser = require('cookie-parser'),
            bodyParser = require('body-parser'),
            compress = require('compression'),
            methodOverride = require('method-override');

        let RateLimit = require('express-rate-limit');

        let apiLimiter = new RateLimit({
            windowMs: 15*60*1000, // 15 minutes
            max: 100,
            delayAfter: 50, // begin slowing down responses after the first request / 0 = disabled
            message: "Too many requests, please try again later."
        });

        this.use(GlobalAcceptMimesMiddleware)
            .use(cookieParser())
            .use(compress({}))
            .use(methodOverride())
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({extended: true}))
            .use('/api/', apiLimiter);

        return null;
    }

    public $onReady(){
        console.log(`Server started...`);
    }

    public $onServerInitError(err){
        console.error(err);
    }

}
