//Encapsulation

class BankAccount {
  customerName;
  accountNumber;
  #balance = 0;

  constructor(customerName, balance = 0) {
    this.customerName = customerName;
    this.accountNumber = Date.now();
    this.#balance = balance;
  }

  deposit(amount) {
    this.#balance += amount;
  }
  withdraw(amount) {
    this.#balance -= amount;
  }
  set Balance(amount) {
    if (isNaN(amount)) {
      throw new Error("Amount is not a valid input");
    } else {
      this.#balance = amount;
    }
  }
  get Balance() {
    return this.#balance;
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

const masterAccount = new CurrentAccount("Akash Niwane", 90000);
//masterAccount.balance = "hello"; //here is a problem like we can set balance outside the class which is not good we can pass anything like string  number
//To resolve this issue we can go with encapsulation
//masterAccount.setBalance(10000000);
masterAccount.Balance = 3087;
console.log(masterAccount);
console.log(masterAccount.Balance);
