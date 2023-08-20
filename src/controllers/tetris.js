class TetrisControllers{

  // controller x,y
  controlControllers = [0,1];

  timeOut = 100;
  initialTime = 0;

  timeOutX = 25;
  initialTimeX = 0;

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
    document.addEventListener('keyup', this.handleKeyUp.bind(this));
  }
  
  updateGame(){
    
    this.tetrisView.clearScreen();
    this.tetrisView.render();
    this.tetrisView.renderTable(this.table);
    if(this.piece.data != null) this.tetrisView.renderPiece(this.piece);

    if (this.piece.data === null){
      this.piece.data = this.bagController.takeOnePiece();
      this.piece.x = 5,
      this.piece.y = 0;
    }else{
      this.movePiece();
    }


  }
  
  movePiece(){

    if (this.verifyPiece() === 'ok'){

      this.initialTime = this.initialTime + 1;
      if (this.initialTime === this.timeOut){
        this.initialTime = 0;
        this.piece.y = this.piece.y + this.controlControllers[1];
      }
      
      this.initialTimeX = this.initialTimeX + 1;
      if (this.timeOutX === this.initialTimeX){
        this.initialTimeX = 0;
        this.piece.x = this.piece.x + this.controlControllers[0];
      }

      

    }else if (this.verifyPiece() === 'limit-y'){
      this.concatenate();
      this.piece  = { x: 0, y: 0, data: null };
    }else if(this.verifyPiece() === 'limit-x'){
      this.controlControllers[0] = 0;
    }
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
            this.table[this.piece.y + y][this.piece.x + x + this.controlControllers[0]] + elementX > this.piece.data[0].code ||
            x + this.piece.x + this.controlControllers[0] > 11 ||
            x + this.piece.x + this.controlControllers[0] < 0
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
      this.controlControllers[0] = -1;
    }
    if (event.key === 'd'){
      this.controlControllers[0] = 1;
    }
    if (event.key === ' '){
      this.rotate();
    }
  }

  handleKeyUp(event){
    if (['a','d'].includes(event.key)) this.controlControllers[0] = 0;
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

    let isValue = true;

    pieceRotate.forEach((elementY, y) => {
      elementY.forEach((elementX, x) => {
        if (this.table[y + piece.y][x + piece.x] === undefined || this.table[y + piece.y][x + piece.x] + elementX > piece.data[0].code) {
          isValue = false;
          return;
        };
      });
      if (!isValue){
        return;
      }
    });

    return isValue;
  }

}