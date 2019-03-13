import { Server } from 'hapi';
import * as mongoose from 'mongoose';
import { UserController } from './controllers/UserController';

export class APIServer {
    private server: Server;

    constructor() {
        mongoose.connect(
            'mongodb://demo:demo123@ds021984.mlab.com:21984/hapijs-demo',
            { useNewUrlParser: true }
        );

        mongoose.connection.on('connected', () => {
            console.log('Connected to MongoDB');
        });

        mongoose.connection.on('error', () => {
            console.log('Error while conneting to MongoDB');
        });
    }

    public async init() {
        // Create a server with a host and port
        this.server = Server({
            host: 'localhost',
            port: 8000
        });

        // Add the route
        this.server.route({
            method: 'GET',
            path: '/',
            handler: (request, h) => {
                return 'Hapi.js Demo API';
            }
        });

        const userController = new UserController();
        this.server.route(userController.getRouteList());

        try {
            await this.server.start();
        } catch (err) {
            console.log(err);
            process.exit(1);
        }

        console.log('Server running at:', this.server.info.uri);
    }
}
