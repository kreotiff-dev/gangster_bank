const UserModel = require("../models/user-model");

module.exports = class UserDto {
    email;
    id;
    confirmed;

    constructor(model) {
        this.email = model.email
        this.id = model.id
        this.confirmed = model.confirmed
    }
}