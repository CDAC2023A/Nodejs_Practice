// Constructor
// try to give first letter as uppercase when creating constructor function

function BankAccount(customerName, balance = 0) {
  this.customerName = customerName;
  this.accountNumber = Date.now();
  this.balance = balance;

  this.deposit = function (amount) {
    this.balance += amount;
  };
  this.withdraw = (amount) => {
    this.balance -= amount;
  };
}
const accounts = [];
// const akashAccount = new BankAccount("Akash Niwane", 50000);

// const ajayAccount = new BankAccount("Ajay Rahane", 1000000); //here we create an object of the constructor function and we can easily use the properties inside that function
// akashAccount.deposit(10000);
// ajayAccount.deposit(13000);
// akashAccount.withdraw(20000);
// console.log(akashAccount, ajayAccount);

//akashAccount.balance = 500000; // not allowed in oops
//===============================================

const accountForm = document.querySelector("#accountForm");
const customerName = document.querySelector("#CustomerName");
const balance = document.querySelector("#balance");
/////
const depositForm = document.querySelector("#depositForm");
const accountNumber = document.querySelector("#accountNumber");
const amount = document.querySelector("#amount");

accountForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const account = new BankAccount(customerName.value, +balance.value);
  accounts.push(account);
  console.log(accounts);
});
depositForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const account = accounts.find((account) => {
    if (account.accountNumber === +accountNumber.value) {
      console.log("Correct account number");
    } else {
      console.log("Please check Account number");
    } // here + sign indicate that it converted into a number
  });

  account.deposit(+amount.value);
  console.log(accounts);
});
