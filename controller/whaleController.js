require("dotenv").config();
const Binance = require("binance-api-node").default;
const client = Binance();
const fetch = require("node-fetch");
var fs = require("fs");

exports.getWhaleAlerts = async (req, res) => {
  let whales = await APIWhaleAlerts();
  res.send(whales);
};

APIWhaleAlerts = async () => {
  const url = `https://api.whale-alert.io/v1/transactions`;

  //   const tenSecondsAgo = Math.floor(new Date().getTime() / 1000 - 10);
  try {
    const resp = await fetch(url, {
      headers: {
        "X-WA-API-KEY": process.env.API_KEY,
      },
    });
    const body = await resp.text();
    return JSON.parse(body);
  } catch (e) {
    throw e;
  }
};

exports.filterWhalesByAmount = async (req, res) => {
  const whales = await APIWhaleAlerts();

  let bigwhale = new Array();
  let sharkOrLess = new Array();

  whales.transactions.map((whale) => {
    let amount = whale.amount;
    if (amount >= 1000) {
      bigwhale.push(whale);
    } else if (amount <= 999) {
      sharkOrLess.push(whale);
    }
  });
  res.json({
    bigwhale,
    sharkOrLess,
  });
};

exports.filterWhalesByExchange = async (req, res) => {
  const whales = await APIWhaleAlerts();

  let binance = new Array();
  let coinbase = new Array();
  let other = new Array();
  whales.transactions.map((w) => {
    if (w.to.owner === "binance") {
      binance.push(w);
    } else if (w.to.owner == "coinbase") {
      coinbase.push(w);
    } else {
      other.push(w);
    }
  });
  res.json({ body: { binance, coinbase, other } });
};

exports.filterWhalesBytransferType = async (req, res) => {
  const whales = await APIWhaleAlerts();
  let transfer = new Array();
  whales.transactions.map((w) => {
    if (w.transaction_type == req.params.type) {
      transfer.push(w);
    }
  });
  res.json({
    transfer_type: req.params.type,
    tamaño: transfer.length,
    transfer,
  });
};
// exports.filterWhalesBytransferType = async (req, res) => {
//     const whales = await APIWhaleAlerts();

//     let type = new Array();
//     let burn = new Array();
//     let other = new Array();
//     whales.transactions.map((w) => {
//       if (w.transaction_type == req.params.type) {
//         type.push(w);
//       } else if (w.transaction_type == "burn") {
//         burn.push(w);
//       } else {
//           other.push(w)
//       }
//     });
//     res.json({ other });
//   };
exports.getWhaleBySymbol = async (req, res) => {
  const whales = await APIWhaleAlerts();
  console.log(req.params.symbol);
  //   fs.writeFileSync("./jsonWhales/test.json", JSON.stringify(whales));

  const transactionsBySymbol = whales.transactions.filter((w) => {
    if (w.symbol == req.params.symbol) {
      return true;
    }
  });

  const flug = await coinScheema(await constult(req.params.symbol),transactionsBySymbol);
  res.json(flug);
};

async function constult(param) {
  let coin = await client
    .dailyStats({ symbol: `${param.toUpperCase()}BUSD` })
    .catch((err) => console.log(err));
  return coin;
}


async function coinScheema(coin, whales){

  let bigwhale = new Array();
  let sharkOrLess = new Array();

  whales.map((whale) => {
    let amount = whale.amount;
    if (amount >= 1000) {
      bigwhale.push(whale);
    } else if (amount <= 999) {
      sharkOrLess.push(whale);
    }
  });

  let coinScheema = {
    type: coin.blockchain,
    date: new Date().toUTCString(),
    properties: {
      symbol: coin.symbol,
      price: parseFloat(coin.askPrice)
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, "$&,"),
      priceChageFiat: `${coin.priceChangePercent}%`,
      openPrice: parseFloat(coin.openPrice)
        .toFixed(2)
        .replace(/\d(?=(\d{3})+\.)/g, "$&,"),
      whales: {
        count: whales.length,
        whales: {
          bigwhaleCount: bigwhale.length,
          bigwhale,
          sharkOrLessCount: sharkOrLess.length,
          sharkOrLess,
        }
      }
    }
  };
  return coinScheema;
}
