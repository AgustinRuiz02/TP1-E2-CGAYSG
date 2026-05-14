let offsetX = 0;       // desplazamiento horizontal
let velocidad = 5;     // velocidad de movimiento
let paletaColores;
let cantidadTubos;
let grosor;
let datosTubos = [];   // guardamos parámetros de cada cinta
let anchoObra;         // ancho total de la obra extendida

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
  
  // dibujamos cada cinta desplazada por offsetX
  for (let i = 0; i < datosTubos.length; i++) {
    let tubo = datosTubos[i];
    dibujarTubo(tubo.yInicial, grosor, tubo.curvas, tubo.amplitud, tubo.colores);
  }
}

function generarObra() {
  offsetX = 0; // reiniciamos desplazamiento al generar nueva obra

  paletaColores = [
    color(255, 0, 0), color(0, 0, 255), color(0, 128, 0),
    color(255, 200, 0), color(255, 128, 0),
    color(255, 150, 200), color(100, 50, 0)
  ];
  
  cantidadTubos = int(random(6, 8)); 
  grosor = width / 8;                
  datosTubos = [];
  anchoObra = width * 2; // extendemos la obra más allá del canvas
  
  for (let i = 0; i < cantidadTubos; i++) {
    let yInicial = random(height * 0.2, height * 0.8);
    let curvas = int(random(3, 5));        
    let amplitud = random(80, 150);        
    
    // colores fijos para cada tramo
    let colores = [];
    for (let c = 0; c < curvas; c++) {
      colores.push(random(paletaColores));
    }
    
    datosTubos.push({yInicial, curvas, amplitud, colores});
  }
}

// 🔑 nueva función: cambia solo los colores de la obra actual
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
    generarObra(); // nueva obra completa
  } else if (key === 'c') {
    cambiarColores(); // solo cambia colores
  }
}

function mousePressed() {
  generarObra(); // regenerar obra con clic
}
