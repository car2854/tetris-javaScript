class TetrisControllers{

  // controller x,y
  controlControllers = [0,1];

  timeOut = 100;
  initialTime = 0;

  piece = {
    x: 0,
    y: 0,
    data: null
  };

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
  }
  
  updateGame(){
    
    this.time();

    this.tetrisView.clearScreen();
    this.tetrisView.render();
    this.tetrisView.renderTable(this.table);
    if(this.piece.data != null) this.tetrisView.renderPiece(this.piece);

    if (this.piece.data === null){
      this.piece.data = this.bagController.putOnePiece();
      this.piece.x = 5,
      this.piece.y = 0;
    }else{
      this.movePiece();
    }


  }
  
  movePiece(){

    if (this.verifyPiece()){
      
      this.piece.y = this.piece.y + this.controlControllers[1];
      this.piece.x = this.piece.x + this.controlControllers[0];
      this.controlControllers[0] = 0;
    }else{
      this.concatenate();
      this.piece  = { x: 0, y: 0, data: null };
    }
  }


  verifyPiece(){
    let isValid = true;
    this.piece.data[0].piece.forEach((elementY, y) => {
      elementY.forEach((elementX, x) => {
        if (
          y + this.piece.y + this.controlControllers[1] > 21 ||
          this.table[this.piece.y + y + this.controlControllers[1]][this.piece.x + x + this.controlControllers[0]] + elementX > 1
        ){
          isValid = false;
        }
      });
    });
    return isValid;
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
      this.controlControllers[0] = -1;
    }
    if (event.key === 'd'){
      this.controlControllers[0] = 1;
    }
  }

  time(){
    this.initialTime = this.initialTime + 1;
    if (this.initialTime === this.timeOut){
      this.initialTime = 0;
      this.controlControllers[1] = 1;
    }else this.controlControllers[1] = 0;
  }
}