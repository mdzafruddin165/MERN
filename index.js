const express = require(express);
const app = express();

app.use(express.json());

app.get("/", (res, req) => {
  res.send("Backend Running!");
});

const Port = 5000;

app.listen(Port, () => {
  console.log(`Server is Running on {Port}`);
});
