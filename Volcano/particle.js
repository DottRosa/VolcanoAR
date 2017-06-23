//Posizione di partenza per le particelle di lava
var LAVA_POS_Y = 60;
//Posizione di partenza per le particelle di fumo
var SMOKE_POS_Y = 40;    
//Dimensione delle particelle di lava
var LAVA_DIM = 8;   
//Dimensione delle particelle di fumo
var SMOKE_DIM = 15;  
//Scalatura delle particelle di lava
var LAVA_SCALE = 10;
//Scalatura delle particelle di fumo
var SMOKE_SCALE = 10;

//I possibili colori della lava
var LAVA_COLORS = [
    0xFF0000,
    0xFF3C00,
    0xFF7B00,
    0xFFED00,
    0xf8ff48,
    0x636363
];

//I possibili colori del fumo
var SMOKE_COLORS = [
    0x444444,
    0xAAAAAA,
    0x666666,
    0x000000
];

//Id delle particelle di lava
var LAVA_ID = 0;
//Id delle particelle di fumo
var SMOKE_ID = 1;




/**
 * Dati 'min' e 'max' restituisce un numero random
 * compreso tra i due valori
 */
function getRandomInRange(min, max) {
    return Math.random() * (max - min) + min;
}


/**
 * Dato un range per le componenti x,y,z la funzione
 * restituisce un Vector3 con valori a caso compresi
 * nei valori min e max specificati nel range
 */
function randomVelocity(range){
    return (new THREE.Vector3(getRandomInRange(range.x.min, range.x.max), 
                              getRandomInRange(range.y.min, range.y.max), 
                              getRandomInRange(range.z.min, range.z.max)));
}


/**
 * Resetta tutte le componenti necessarie di una
 * particella in modo tale che ricominci la sua
 * animazione
 */
function particleReset(particle){
    particle.position.x = -20;
    particle.position.y = LAVA_POS_Y;
    particle.position.z = 30;
    particle.velocity = randomVelocity(particle.range);
    particle.rotation = getRandomInRange(0, Math.PI*2);
    particle.scale.set(0,0);
}

/**
 * Genera un range che indica i valori massimi e minimi
 * degli spostamenti nei tre assi. Sono necessari per calcolare
 * la velocità casuale della particella coinvolta
 */
function createRange(minX, maxX, minY, maxY, minZ, maxZ){
    return {
        x : {
            min : minX,
            max : maxX
        },
        y : {
            min : minY,
            max : maxY
        },
        z : {
            min : minZ,
            max : maxZ
        }
    };
}


/**
 * Funzione che dato un value di partenza e un range [istart, istop] a cui
 * appartiene, calcola il nuovo valore in base al nuovo range [ostart, ostop]
 */
function map(value, istart, istop, ostart, ostop) {
    return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
}


/**
 * Permette l'espansione della particella in base al suo particleID.
 * Se l'id è pari a LAVA_ID, p viene trattato come una particella di lava,
 * mentre se l'id è uguale a SMOKE_ID, p sarà una particella di fumo
 */
function particleScale(p){
    var scaleDim;
    if(p.particleID == LAVA_ID){
        scaleDim = p.scale.x+0.5;
        
    } else if(p.particleID == SMOKE_ID){
        scaleDim = map(p.position.y, 40, 200, 10, 70);
    }
    
    p.scale.set(scaleDim, scaleDim);
}

/**
 * Data un sistema di particelle, viene cambiato il colore di ciascuna di
 * esse in base all'array colors di colori. I colori vengono applicati
 * casualmente.
 */
function applyColorMap(particles, colors){
    for(var i=0; i<particles.length; i++){
        particles[i].material.color.setHex(colors[Math.floor(getRandomInRange(0, colors.length))]);
        particles[i].material.needsUpdate = true;
    }
}


/**
 * Genera una particella (sprite) in base ad una texture,
 * un colore ed un range per lo spostamento
 */
function generateParticle(texture, color, range, id){
    //Crea lo sprite della particella di lava
    var p = new THREE.Sprite(
        new THREE.SpriteMaterial({ 
            map: texture,
            transparent:true,
            rotation:getRandomInRange(0, Math.PI*2),
            color:color,       
            depthWrite:false   //Renderizza correttamente gli sprite senza che si sovrappongano
        })
    );
    p.particleID = id;      //L'id della particella che si distingue tra lava e fumo
    p.range = range;
    particleReset(p);       //Imposta tutti i valori di default della particella
    
    return p;
}
