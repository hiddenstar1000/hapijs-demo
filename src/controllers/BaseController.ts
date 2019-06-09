import * as boom from 'boom';
import { hashSync } from 'bcrypt';

export abstract class BaseController {
    private model: any;
    protected hashProperty: string;

    // POST
    protected addEntityRoute;
    // GET
    protected getAllEntitiesRoute;
    // GET 
    protected getEntityByIdRoute;
    // PUT
    protected updateEntityByIdRoute;
    // DELETE
    protected deleteEntityByIdRoute;

    constructor(model: any) {
        this.model = model;
        this.hashProperty = '';
        this.initBaseRoutes();
    }

    private initBaseRoutes(): void {
        this.addEntityRoute = (scope: string[]) => {
            return {
                method: 'POST',
                path: '/user',
                config: {
                    auth: {
                        strategy: 'jwt',
                        scope: scope
                    }
                },
                handler: async (request, h) => {
                    if (this.hashProperty != '' && request.payload[this.hashProperty]) {
                        request.payload[this.hashProperty] = hashSync(request.payload[this.hashProperty], 5);
                    }

                    const user = await this.model.create(request.payload);

                    return h.response({ statusCode: 201, message: 'Successfully Created', 'id': user._id }).code(201);
                }
            }
        }

        this.getAllEntitiesRoute = (scope: string[]) => {
            return {
                method: 'GET',
                path: '/user',
                config: {
                    auth: {
                        strategy: 'jwt',
                        scope: scope
                    }
                },
                handler: async (request, h) => {
                    const users = await this.model.find({});

                    return h.response(users).code(200);
                }
            }
        }

        this.getEntityByIdRoute = (scope: string[]) => {
            return {
                method: 'GET',
                path: '/user/{id}',
                config: {
                    auth: {
                        strategy: 'jwt',
                        scope: scope
                    }
                },
                handler: async (request, h) => {
                    const user = await this.model.findById(request.params.id);
                    if (user) {
                        return h.response(user).code(200);
                    } else {
                        return boom.notFound('user not found');
                    }
                }
            }
        }

        this.updateEntityByIdRoute = (scope: string[]) => {
            return {
                method: 'PUT',
                path: '/user/{id}',
                config: {
                    auth: {
                        strategy: 'jwt',
                        scope: scope
                    }
                },
                handler: async (request, h) => {
                    const user = await this.model.findById(request.params.id);
                    if (user) {
                        if (this.hashProperty != '' && request.payload[this.hashProperty]) {
                            request.payload[this.hashProperty] = hashSync(request.payload[this.hashProperty], 5);
                        }

                        await this.model.findByIdAndUpdate(request.params.id, request.payload);

                        return h.response({ statusCode: 200, message: 'Successfully Updated' }).code(200);
                    } else {
                        return boom.notFound('user not found');
                    }
                }
            }
        }

        this.deleteEntityByIdRoute = (scope: string[]) => {
            return {
                method: 'DELETE',
                path: '/user/{id}',
                config: {
                    auth: {
                        strategy: 'jwt',
                        scope: scope
                    }
                },
                handler: async (request, h) => {
                    const user = await this.model.findById(request.params.id);
                    if (user) {
                        await this.model.findByIdAndDelete(request.params.id);

                        return h.response({ statusCode: 200, message: 'Successfully Deleted' }).code(200);
                    } else {
                        return boom.notFound('user not found');
                    }
                }
            }
        }
    }

    public abstract getRouteList(): any[];
}
