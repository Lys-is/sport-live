export default class UserDto {
   email;
   /** @type {string} */
   id;
   isActivated;

   constructor(model) {
      this.email = model.email;
      this.id = model._id;
      this.isActivated = model.isActivated;
   }
}
