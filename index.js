const server = require("./server");
const log = console.log;
const chalk = require("chalk");
const PORT = process.env.PORT || 4000;

const database = require("./configs/databaseConfig/database"); // database initialization
database();

server.listen(PORT, () => {
  log(chalk.bgGreenBright(`Server is running on port ${PORT}`));
});
