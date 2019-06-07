import * as boom from 'boom';

export abstract class BaseController {
    private model: any;

    // POST
    public addEntityRoute;
    // GET
    public getAllEntitiesRoute;
    // GET 
    public getEntityByIdRoute;
    // PUT
    public updateEntityByIdRoute;
    // DELETE
    public deleteEntityByIdRoute;

    constructor(model: any) {
        this.model = model;
        this.initBaseRoutes();
    }

    private initBaseRoutes(): void {
        this.addEntityRoute = () => {
            return {
                method: 'POST',
                path: '/user',
                handler: async (request, h) => {
                    const user = await this.model.create(request.payload);

                    return h.response({ statusCode: 201, message: 'Successfully Created', 'id': user._id }).code(201);
                }
            }
        }

        this.getAllEntitiesRoute = () => {
            return {
                method: 'GET',
                path: '/user',
                handler: async (request, h) => {
                    const users = await this.model.find({});

                    return h.response(users).code(200);
                }
            }
        }

        this.getEntityByIdRoute = () => {
            return {
                method: 'GET',
                path: '/user/{id}',
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

        this.updateEntityByIdRoute = () => {
            return {
                method: 'PUT',
                path: '/user/{id}',
                handler: async (request, h) => {
                    const user = await this.model.findById(request.params.id);
                    if (user) {
                        await this.model.findByIdAndUpdate(request.params.id, request.payload);

                        return h.response({ statusCode: 200, message: 'Successfully Updated' }).code(200);
                    } else {
                        return boom.notFound('user not found');
                    }
                }
            }
        }

        this.deleteEntityByIdRoute = () => {
            return {
                method: 'DELETE',
                path: '/user/{id}',
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
