let offsetX = 0;      
let velocidad = 5;  
let paletaColores;
let cantidadTubos;
let grosor;
let datosTubos = [];  
let anchoObra;        

function setup() {
  createCanvas(600, 600);
  generarObra();
}

function draw() {
  background(255); 
  noStroke();

  if (keyIsDown(LEFT_ARROW)) {
    offsetX = max(0, offsetX - velocidad);
  }
  if (keyIsDown(RIGHT_ARROW)) {
    offsetX = min(anchoObra - width, offsetX + velocidad);
  }
  

  for (let i = 0; i < datosTubos.length; i++) {
    let tubo = datosTubos[i];
    dibujarTubo(tubo.yInicial, grosor, tubo.curvas, tubo.amplitud, tubo.colores);
  }
}

function generarObra() {
  offsetX = 0; 

  paletaColores = [
    color(255, 0, 0), color(0, 0, 255), color(0, 128, 0),
    color(255, 200, 0), color(255, 128, 0),
    color(255, 150, 200), color(100, 50, 0)
  ];
  
  cantidadTubos = int(random(6, 8)); 
  grosor = width / 8;                
  datosTubos = [];
  anchoObra = width * 2; 
  
  for (let i = 0; i < cantidadTubos; i++) {
    let yInicial = random(height * 0.2, height * 0.8);
    let curvas = int(random(3, 5));        
    let amplitud = random(80, 150);        
    
  
    let colores = [];
    for (let c = 0; c < curvas; c++) {
      colores.push(random(paletaColores));
    }
    
    datosTubos.push({yInicial, curvas, amplitud, colores});
  }
}


function cambiarColores() {
  for (let i = 0; i < datosTubos.length; i++) {
    let tubo = datosTubos[i];
    tubo.colores = [];
    for (let c = 0; c < tubo.curvas; c++) {
      tubo.colores.push(random(paletaColores));
    }
  }
}

function dibujarTubo(yBase, grosor, curvas, amplitud, colores) {
  let puntos = [];
  let pasoX = anchoObra / curvas;
  
  for (let x = -200; x <= anchoObra + 200; x += pasoX / 4) {
    let angulo = map(x, -200, anchoObra + 200, 0, TWO_PI * curvas);
    let y = yBase + sin(angulo) * amplitud;
    let px = x - offsetX; 
    puntos.push(createVector(px, constrain(y, 0, height)));
  }
  
  for (let c = 0; c < curvas; c++) {
    fill(colores[c]);
    
    beginShape();
    for (let j = 0; j < puntos.length; j++) {
      let px = puntos[j].x;
      let py = puntos[j].y;
      if (px >= c * pasoX - 200 - offsetX && px <= (c + 1) * pasoX + 200 - offsetX) {
        curveVertex(px, py);
      }
    }
    for (let j = puntos.length - 1; j >= 0; j--) {
      let px = puntos[j].x;
      let py = puntos[j].y + grosor;
      if (px >= c * pasoX - 200 - offsetX && px <= (c + 1) * pasoX + 200 - offsetX) {
        curveVertex(px, py);
      }
    }
    endShape(CLOSE);
  }
}

function keyPressed() {
  if (key === 'n') {
    generarObra();
  } else if (key === 'c') {
    cambiarColores(); 
  }
}

function mousePressed() {
  generarObra(); 
}
