import fastify from "fastify";

const app = fastify()

app.get("/hello", () => {
  return "Hello Flavio"
})

app.listen({
  port: 33333
}).then(() => {
  console.log("listening on port 33333")
}).catch((error) => {
console.log("error: ", error.message)
})