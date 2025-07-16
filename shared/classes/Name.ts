
class Name {

    firstName: string;
    lastName: string;
    
    constructor(firstName: string, lastName: string) {
        this.firstName = firstName;
        this.lastName = lastName;
    }

    toJSON() {
        return {
          firstName: this.firstName,
          lastName: this.lastName,
        };
      }

}

export default Name;