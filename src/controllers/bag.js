class BagController{
  
  bag = [];

  constructor(){
    this.pieces = new Pieces();
  }

  putOnePiece(){
    if (this.bag.length === 0) this.fillBag();
    const piece = this.bag.pop();
    return piece;
  }

  fillBag(){

    const {i,o,s,z,l,j,t} = this.pieces;

    const piecesBag = [i,o,s,z,l,j,t];

    while (piecesBag.length > 0) {
      
      const max = piecesBag.length;
      const random = Math.floor(Math.random() * (max - 0)) + 0;

      this.bag.push(piecesBag.splice(random , 1))

    }

  }
}