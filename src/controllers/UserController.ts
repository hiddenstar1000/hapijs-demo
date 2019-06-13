import { BaseController } from "./BaseController";
import { User } from "../models/userModel";

export class UserController extends BaseController {
    constructor() {
        super(User);
        this.entitySingular = 'user';
        this.entityPlural = 'users';
        this.hashProperty = 'password';
    }

    public getRouteList(): any[] {
        return [
            this.addEntityRoute(), 
            this.getAllEntitiesRoute(), 
            this.getEntityByIdRoute(), 
            this.updateEntityByIdRoute(), 
            this.deleteEntityByIdRoute()
        ];
    }
}
