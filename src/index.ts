interface User {
  birthYear: number;
}

function calculateIearOldTime(user: User){
  return new Date().getFullYear() - user.birthYear

}

const result = calculateIearOldTime({birthYear: 1981})
console.log(result)