let a = ['x', 'y', 23]
a.Test = 'foo'
// for (i = 0; i < a.length; i++) {
//   console.log(a[i])
// }

for (const i in a) {
  console.log(i)
}
