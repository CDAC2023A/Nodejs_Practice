//Inheritance

//Inheritance on class
class BankAccount {
  customerName;
  accountNumber;
  balance = 0;

  constructor(customerName, balance = 0) {
    this.customerName = customerName;
    this.accountNumber = Date.now();
    this.balance = balance;
  }

  deposit(amount) {
    this.balance += amount;
  }
  withdraw(amount) {
    this.balance -= amount;
  }
}

class CurrentAccount extends BankAccount {
  transactionLimit = 50000;
  constructor(customerName, balance = 0) {
    super(customerName, balance);
  }
  takeBussinessLoan(amount) {
    console.log("Taking business loan" + amount);
  }
}
class SavingAccount extends BankAccount {
  transactionLimit = 50000;
  constructor(customerName, balance = 0) {
    super(customerName, balance);
  }
  takePersonalLoan(amount) {
    console.log("Taking personal loan \n" + amount);
  }
}
//===============================================================================================//
// // inheritance on constructor function
// function BankAccount(customerName, balance = 0) {
//   this.customerName = customerName;
//   this.accountNumber = Date.now();
//   this.balance = balance;
// }
// BankAccount.prototype.deposit = function (amount) {
//   this.balance += amount;
// };
// BankAccount.prototype.withdraw = function (amount) {
//   this.balance -= amount;
// };

// //////
// function CurrentAccount(customerName, balance = 0) {
//   BankAccount.call(this, customerName, balance); // Here we are inheriting from parent to child // Constructor linking
//   this.transactionLimit = 50000;
// }
// CurrentAccount.prototype = Object.create(BankAccount.prototype); // here we are attaching the parent prototype to child prototype
// CurrentAccount.prototype.takeBussinessLoan = function (amount) {
//   console.log("Taking business loan" + amount);
// };
// /////

// function SavingAccount(customerName, balance = 0) {
//   BankAccount.call(this, customerName, balance); // Here we are inheriting from parent to child // Constructor linking
//   this.transactionLimit = 10000;
// }

// SavingAccount.prototype = Object.create(BankAccount.prototype);
// SavingAccount.prototype.takePersonalLoan = function (amount) {
//   console.log("Taking personal loan" + amount);
// };

const akashAccount = new SavingAccount("Akash Niwane", 50000);
akashAccount.deposit(9000);
akashAccount.withdraw(543);
akashAccount.takePersonalLoan(50000);
console.log(akashAccount);
