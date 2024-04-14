import express, { Application } from 'express'
import * as dotenv from 'dotenv'
import {connect, ConnectOptions } from 'mongoose'
import route from './routes';
dotenv.config()

const url = "mongodb+srv://arunkumar:Ditstek1234@cluster0.bea3hwz.mongodb.net/contact?retryWrites=true&w=majority";

export default class App {

    public app: Application;
    public port : number;

    constructor (port : number) {
        this.app = express()
        this.port = port;
        this.app.use(express.json());
        this.connectToRoute(); 
        this.connectToMongo();
        this.staticAssests();
        
    }

    private connectToMongo(){

        connect(`${url}`,{
            useUnifiedTopology: true,
            useNewUrlParser: true,

        }as ConnectOptions).then(() => {
            console.log("info->","Connected to mongoDB....");
        }).catch((e) => {
            console.log("info","There was and error to connect to mongodb");
            console.log(e);
        });
    }

    private connectToRoute(){
        this.app.use(express.json());

        this.app.use(route);
    }

    private staticAssests(){

        this.app.use(express.static('public'));
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log('server is running...');            
        })
    }

}