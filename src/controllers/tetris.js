
class TetrisControllers{

  // controller -x,y,+x
  controlControllers = [0,1,0];

  timeOut = CONFIG.TIME_OUT_Y;
  initialTime = 0;

  timeOutX = CONFIG.TIME_OUT_X;
  initialTimeX = 0;

  gameOver = false;

  piece = {
    x: 0,
    y: 0,
    data: null
  };

  points = 0;
  deleteLines = 0;

  constructor(tetrisView, pieces, bagController){
    this.tetrisView = tetrisView;
    this.pieces = pieces;
    this.bagController = bagController;

    this.table = [
      [0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0]
    ];

    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.addEventListener('keyup', this.handleKeyUp.bind(this));
  }
  
  updateGame(){
    
    this.tetrisView.clearScreen();
    this.tetrisView.render();
    this.tetrisView.renderTable(this.table);

    if(this.piece.data != null) this.tetrisView.renderPiece(this.piece);

    if (!this.gameOver){
  
      if (this.piece.data === null){
        this.piece.data = this.bagController.takeOnePiece();
        this.piece.x = 5,
        this.piece.y = 0;
        this.gameOver = (this.verifyPiece() != 'ok');
      }else{
        this.movePiece();
      }
  
      
      if (this.deleteLines === CONFIG.MAX_LINE_DELETE){
        this.deleteLines = 0;
        if (this.timeOut >= 20){
          this.timeOut = this.timeOut / 2;
        }
      }
    }else{

      // GameOver

    }

    

  }
  
  movePiece(){

    this.initialTime = this.initialTime + 1;
    this.initialTimeX = this.initialTimeX + 1;

    if (this.verifyPiece() === 'ok'){

      if (this.initialTime >= this.timeOut){
        this.initialTime = 0;
        this.piece.y = this.piece.y + this.controlControllers[1];
      }
      
      if (this.timeOutX <= this.initialTimeX){
        this.initialTimeX = 0;
        this.piece.x = this.piece.x - this.controlControllers[0];
        this.piece.x = this.piece.x + this.controlControllers[2];
      }


    }else if (this.verifyPiece() === 'limit-y'){
      this.concatenate();
      // Si concatena, se tiene que verificar las lineas para saber, si hay una linea completa, esto lo pongo aqui, por que logicamente, esto no se debe ejecutar todo el rato, simplemente cuando la pieza forma parte con la tabla
      this.verifyLineTable();
      this.piece  = { x: 0, y: 0, data: null };
    }else if(this.verifyPiece() === 'limit-x'){
      this.controlControllers[0] = 0;
      this.controlControllers[2] = 0;
    }
  }

  verifyLineTable = () => {

    let deleteLine = 0;

    this.table = this.table.filter((element, y) => {
      const exist = element.every((value) => {
        return value > 0;
      });
      if (exist){
        deleteLine++;
        return false;
      }
      return true;
    }).map((_) => _);
    
    while (deleteLine > 0) {
      this.table.unshift([0,0,0,0,0,0,0,0,0,0,0,0]);
      deleteLine--;
      this.points = this.points + 100;
      this.deleteLines++;  
    }

    this.tetrisView.renderPoints(this.points);

  }

  // Status: ok, limit-y, limit-x
  verifyPiece(){
    let status = 'ok';
    this.piece.data[0].piece.forEach((elementY, y) => {
      elementY.forEach((elementX, x) => {
        if (
          elementX != 0
          ){
          if (
            this.table[this.piece.y + y][this.piece.x + x + ( - this.controlControllers[0] + this.controlControllers[2])] + elementX > this.piece.data[0].code ||
            x + this.piece.x + this.controlControllers[2] > 11 ||
            x + this.piece.x - this.controlControllers[0] < 0
          ){
            status = 'limit-x';
            return
          }
          if (
            y + this.piece.y + this.controlControllers[1] > 21 ||
            this.table[this.piece.y + y + this.controlControllers[1]][this.piece.x + x] + elementX > this.piece.data[0].code
          ){
            status = 'limit-y';
            return;
          }
          if (
            x + this.piece.x + this.controlControllers[2] > 11  ||
            x + this.piece.x - this.controlControllers[0] < 0   ||
            y + this.piece.y + this.controlControllers[1] > 21  ||
            this.table[this.piece.y + y + this.controlControllers[1]][this.piece.x + x + ( - this.controlControllers[0] + this.controlControllers[2])] + elementX > this.piece.data[0].code
          ){
            status = 'limit-x';
            return;
          }
        }

      });
      if (status != 'ok') return;
    });
    return status;
  }

  concatenate(){
    this.piece.data[0].piece.forEach((elementY, y) => {
      elementY.forEach((elementX, x) => {
        this.table[this.piece.y + y][this.piece.x + x] = this.table[this.piece.y + y][this.piece.x + x] + elementX;
      });
    });
  }

  handleKeyDown(event){
    if (event.key === 'a'){
      this.controlControllers[0] = 1;
    }
    if (event.key === 'd'){
      this.controlControllers[2] = 1;
    }
    if (event.key === ' '){
      this.rotate();
    }
  }

  handleKeyUp(event){
    if (event.key === 'a'){
      this.controlControllers[0] = 0;
    }
    if (event.key === 'd'){
      this.controlControllers[2] = 0;
    }
  }

  rotate(){
    const pieceRotate = [];
    const lengthY = this.piece.data[0].piece.length;
    const lengthX = this.piece.data[0].piece[0].length;
    for (let i = 0; i < lengthX; i++) {
      const newRow = [];
      for (let j = 0; j < lengthY; j++) {
        newRow.push(this.piece.data[0].piece[j][(lengthX - 1) - i]);
      }
      pieceRotate.push(newRow);
    }
    if (this.verifyRotate(pieceRotate, this.piece)){
      this.piece.data[0].piece = pieceRotate;
    }
  }

  verifyRotate = (pieceRotate, piece) => {
    let isRotate = true;
    pieceRotate.forEach((elementY, y) => {
      elementY.forEach((elementX, x) => {
        if (this.table[y + piece.y][x + piece.x] === undefined || this.table[y + piece.y][x + piece.x] + elementX > piece.data[0].code) {
          isRotate = false;
          return;
        };
      });
      if (!isRotate){
        return;
      }
    });
    return isRotate;
  }

}