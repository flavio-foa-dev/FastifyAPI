function calculateIearOldTime(user) {
    return new Date().getFullYear() - user.birthYear;
}
var result = calculateIearOldTime({ birthYear: 1981 });
console.log(result);
