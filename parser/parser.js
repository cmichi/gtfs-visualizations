var gtfs = require("./loader");

gtfs.load();
console.log(gtfs.getRouteById(87001));
