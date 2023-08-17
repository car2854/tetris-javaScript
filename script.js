const tetrisView = new TetrisView('canvas');
const pieces = new Pieces();

// bag
const bagController = new BagController();

// controllers
const tetrisControllers = new TetrisControllers(tetrisView, pieces, bagController);

const gameLoop = () => {
  tetrisControllers.updateGame();
}

const intervalTime = 1;
setInterval(() => {
  gameLoop();
}, intervalTime);
