//Prototype
// If you are creating an function inside constructor then we every time when we create an object for that the function also taking an memory so to
// reduce the memory loss we are using prototype

function BankAccount(customerName, balance) {
  this.customerName = customerName;
  this.accountNumber = Date.now();
  this.balance = balance;

  //   this.deposit = function (amount) {
  //     this.balance += amount;
  //   };
  //   this.withdraw = (amount) => {
  //     this.balance -= amount;
  //   };
}
const akashAccount = new BankAccount("Akash Niwane", 50000);

// const ajayAccount = new BankAccount("Ajay Rahane", 1000000);
//If we see here inside the constructor we are calling two functions like deposit and withdraw so every time when we
// create an object it take memeory

BankAccount.prototype.deposit = function (amount) {
  this.balance += amount;
};
BankAccount.prototype.withdraw = function (amount) {
  this.balance -= amount;
};
akashAccount.withdraw(25);
console.log(akashAccount);
