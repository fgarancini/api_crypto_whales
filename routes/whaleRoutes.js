const Router = require("express").Router();
const controller = require("../controller/whaleController");

Router.route("/").get(controller.getWhaleAlerts);

Router.route("/:symbol").get(controller.getWhaleBySymbol);

Router.route("/whales/filter/whaleAmount").get(controller.filterWhalesByAmount);

Router.route("/whales/filter/transferType/:type").get(
  controller.filterWhalesBytransferType
);

Router.route("/whales/exchange").get(controller.filterWhalesByExchange);

module.exports = Router;
