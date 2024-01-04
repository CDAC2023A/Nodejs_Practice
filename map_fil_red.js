const arr = [1, 5, 4, 8, 9, 3, 7, 6];

const users = [
  { name: "Akash", job: "se", age: 25 },
  { name: "Ajay", job: "et", age: 33 },
  { name: "Yogesh", job: "mt", age: 25 },
  { name: "Nayan", job: "kt", age: 28 },
];
const student = [
  { name: "Smith", age: 31, marks: 80 },
  { name: "Jenny", age: 15, marks: 69 },
  { name: "John", age: 15, marks: 35 },
  { name: "Tiger", age: 7, marks: 55 },
];

//map
const output = arr.map((x) => x * 2);
console.log(output);

//filter
const outputf = arr.filter((y) => y % 2);
console.log(outputf);

//reduce
function findSum(arr) {
  let sum = 0;
  for (i = 0; i < arr.length; i++) {
    sum = sum + arr[i];
  }
  return sum;
}
console.log(findSum(arr));

//actual way of reduce

const reduceout = arr.reduce(function (acc, curr) {
  acc = acc + curr;
  return acc;
}, 0);

console.log(reduceout);

const combine = users.filter((x) => x.age < 30).map((x) => x.name);
console.log(combine);

const combine2 = users.reduce(function (acc, curr) {
  if (curr.age < 30) {
    acc.push(curr.name);
  }
  return acc;
}, []);
console.log(combine2);

const task = student.reduce(function (acc, curr) {
  const age = curr.age;

  acc[age] = acc[age] || [];
  acc[age].push(curr);
  return acc;
}, []);

console.log(task);
