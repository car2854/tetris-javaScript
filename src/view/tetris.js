class TetrisView{
  constructor(id){
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');

  }

  clearScreen(){
    this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
  }

  render(){

    // 12 width
    for (let i = 0; i < 360; i+=30) {
      this.ctx.beginPath();
      this.ctx.moveTo(i,0);
      this.ctx.lineTo(i,800);
      this.ctx.strokeStyle = "blue";
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
    }

    // 22 height
    for (let i = 0; i < 660; i+=30) {
      this.ctx.beginPath();
      this.ctx.moveTo(0,i);
      this.ctx.lineTo(360,i);
      this.ctx.strokeStyle = "blue";
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
    }
  }

  renderTable(table){
    // console.clear();
    table.forEach((elementY, y) => {
      elementY.forEach((elementX , x) => {
        if (elementX > 0){
          this.ctx.fillStyle = 'blue';
          this.ctx.fillRect(x*30,y*30,30,30);
        }
      });
    });

  }

  renderPiece(piece){

    piece.data[0].piece.forEach((elementY, y) => {
      elementY.forEach((elementX, x) => {
        if (elementX > 0){
          this.ctx.fillStyle = 'blue';
          this.ctx.fillRect((x+piece.x) * 30,(y+piece.y)*30,30,30);
        }
      });
    });

  }
}