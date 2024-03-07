//static

class config {
  static dbUser = "akash";
  static nickname = "harish";
  static apitoken = "ijnbghj";
}

console.log(config.apitoken);
// //Utility  function and static properties
// class User {
//   static id = 1; // here we are creating an static id inside a class so we can easily use that
//   constructor(name, age = 0, income) {
//     this.name = name;
//     this.age = age;
//     this.income = income;
//     this.id = User.id++; //Here we are creating a ststic id inside a class and is not connected to instance
//   }

//   //   static compareByAge(user1, user2) {
//   //     return user1.age - user2.age;
//   //   }
//   //   static compareByName(user1, user2) {
//   //     return user1.name.localeCompare(user2.name);
//   //   }
// }
// const user1 = new User("Akash", 29, 32000); // This is all are instance or object
// const user2 = new User("Kalyani", 25, 46000);
// const user3 = new User("Master", 65, 65000);
// const user4 = new User("pran", 20, 98000);
// const Users = [user1, user2, user3, user4];

// //Users.sort(User.compareByName);
// console.log(Users);
