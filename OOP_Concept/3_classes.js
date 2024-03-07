//Classes
//const akashAccount = new BankAccount("Akash", 48000);--- here if you are calling object before class
// then it will not work or hoisting is not possible
class BankAccount {
  //const BankAccount=class{}
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
const akashAccount = new BankAccount("Akash", 48000);
akashAccount.deposit(3987);
console.log(akashAccount);
