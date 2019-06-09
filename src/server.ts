import { Server } from '@hapi/hapi';
import * as mongoose from 'mongoose';
import { UserController } from './controllers/UserController';
import { LoginController } from './controllers/LoginController';
import { User } from './models/userModel';

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

        await this.server.register(require('hapi-auth-jwt2'));

        this.server.auth.strategy('jwt', 'jwt', {
            key: 'privateKey123',
            validate: this.validate,
            verifyOptions: {
                algorithms: ['HS256']
            }
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

        const loginController = new LoginController();
        this.server.route(loginController.getRouteList());

        this.server.events.on('request', (request, event, tags) => {
            if (tags.error) {
                console.log(
                    `Request ${event.request} error: ${
                    event.error ? event.error.message : 'unknown'
                    }`
                );
            }
        });

        this.server.events.on('response', (request) => {
            console.log(`Response sent for request: ${request.info.id}`);
        });

        this.server.events.on('stop', () => {
            console.log('Server stopped');
        });

        try {
            await this.server.start();
        } catch (err) {
            console.log(err);
            process.exit(1);
        }

        console.log('Server running at:', this.server.info.uri);
    }

    private validate = async function (decoded, request, h) {
        const user = await User.findById(decoded.id);

        if (user) {
            return { isValid: true };
        }

        return { isValid: false };
    }
}
