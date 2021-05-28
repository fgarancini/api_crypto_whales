const express = require("express");
const morgan = require("morgan");
const app = express();
const port = 3000;



const whaleRouter = require("./routes/whaleRoutes");

var fs = require("fs");

app.use(morgan("dev"));
app.enable('trust proxy');
app.use(whaleRouter);

// app.get("/", async (req, res) => {
//   let whales = await getWhaleAlerts();
//   fs.writeFileSync("./jsonWhales/test.json", JSON.stringify(whales));
//   res.send(whales);
// });

// app.get("/:blockchain", async (req, res) => {
//   // console.log(req.params.blockchain);
//   let whales = await getWhaleByCoin(req.params.blockchain);
//   // console.log(whales);
//   res.send(whales);
// });

const getWhaleByCoin = async (param) => {
  const whales = await getWhaleAlerts();
  const t = new Array();
  whales.transactions.map((w) => {
    if (w.blockchain == param) {
      t.push(w);
    }
  });
  return t;
};
const getWhaleBySymbol = async (param) => {
  const whales = await getWhaleAlerts();
  const t = new Array();
  whales.transactions.map((w) => {
    if (w.symbol == param) {
      t.push(w);
    }
  });
  return t;
};

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
