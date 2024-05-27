const { User } = require('../models');

class UserDto {
  constructor(model) {
    this.id = model.id;
    this.email = model.email;
    this.phone = model.phone;
    this.first_name = model.first_name;
    this.last_name = model.last_name;
    this.confirmed = model.confirmed;
  }
}

module.exports = UserDto;
