class UserDto {
  constructor(model) {
    this.id = model.id;
    this.email = model.email;
    this.phone = model.phone;
    this.firstName = model.firstName;
    this.lastName = model.lastName;
    this.confirmed = model.confirmed;
  }
}

module.exports = UserDto;
