import { BaseController } from "./BaseController";
import { User } from "../models/userModel";

export class UserController extends BaseController {
    constructor() {
        super(User);
        this.hashProperty = 'password';
    }

    public getRouteList(): any[] {
        return [
            this.addEntityRoute(['admin']), 
            this.getAllEntitiesRoute(['admin', 'user']), 
            this.getEntityByIdRoute(['admin', 'user']), 
            this.updateEntityByIdRoute(['admin', 'user']), 
            this.deleteEntityByIdRoute(['admin'])
        ];
    }
}
