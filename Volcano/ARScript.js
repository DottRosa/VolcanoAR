//Numero massimo di particelle di lava
var MAX_N_LAVA_PARTICLES = 800;
//Numero massimo di particelle di fumo
var MAX_N_SMOKE_PARTICLES = 400;
//Numero di particelle di lava
var N_LAVA_PARTICLES = 400;
//Numero di particelle di fumo
var N_SMOKE_PARTICLES = 100;

//Determina quanto la velocità delle particelle di lava viene modificata
var LAVA_ACCELERATION = new THREE.Vector3(0, -0.02, 0);

//Flag che indica se cominciare e continuare l'eruttazione
var ERUPTS = false;
//Flag che indica se mettere in pausa l'animazione
var SMOKE_STOP = false;

//Vettori che simulano il vento per il fumo e per la lava
var smokeWind = new THREE.Vector3(0,0,0);
var lavaWind = new THREE.Vector3(0,0,0);

//Permette di caricare le texture
var loader = new THREE.TextureLoader();

//Array di texture per il fumo
var smokeTextureName = [
    loader.load("img/smoke1.png"),
    loader.load("img/smoke2.png"),
    loader.load("img/smoke3.png")
];

//Array di texture per la lava
var lavaTextureName = [
    loader.load("img/lava1.png"),
    loader.load("img/lava2.png"),
    loader.load("img/lava3.png"),
    loader.load("img/lava4.png"),
    loader.load("img/lava5.png"),
    loader.load("img/lava6.png")
];

//Texture per il vulcano
var vulcanTexture = loader.load("img/styleTexture/volcano_1.jpg");
//Mappa per creare il modello 3D del vulcano
var vulcanDisplacement = loader.load("img/vulcano-displacement.jpg");




/**
 * Prepara la GUI di controllo per le preferenze dell'utente
 */
function initGui(){
    
    var gui = new dat.GUI({
       width:350    //Larghezza della gui
    });
            
    //I parametri modificabili
    var params = {
        lavaAcceleration:-LAVA_ACCELERATION.y,  //Gravità
        lavaParticles:N_LAVA_PARTICLES,         //Numero di particelle di lava
        smokeParticles:N_SMOKE_PARTICLES,       //Numero di particelle di fumo
        windForceX:smokeWind.x,                 //Forza del vento lungo x
        windForceZ:smokeWind.z,                 //Forza del vento lungo z
        style:"volcano_1"
    };
    
    //Aggiungo il controllo della gravità per la lava
    gui.add(params, 'lavaAcceleration').name("Lava gravity").max(0.1).min(0.02).step(0.005).onChange(function(){
        LAVA_ACCELERATION = new THREE.Vector3(0, -params.lavaAcceleration, 0);  //Setto la nuova accelerazione
    });
    
    //Aggiungo il controllo del numero di particelle di lava
    gui.add(params, 'lavaParticles').name("Lava particles").max(MAX_N_LAVA_PARTICLES).min(0).step(1).onChange(function(){
        N_LAVA_PARTICLES = params.lavaParticles;
        for(var i=N_LAVA_PARTICLES; i<lavaParticles.length; i++){
            particleReset(lavaParticles[i]);   
        }
    }); 
    
    //Aggiungo il controllo del numero di particelle di fumo
    gui.add(params, 'smokeParticles').name("Smoke particles").max(MAX_N_SMOKE_PARTICLES).min(0).step(1).onChange(function(){
        N_SMOKE_PARTICLES = params.smokeParticles;
        for(var i=N_SMOKE_PARTICLES; i<smokeParticles.length; i++){
            particleReset(smokeParticles[i]);   
        }
    });
    
    //Aggiungo il controllo della forza del vento lungo la X
    gui.add(params, 'windForceX').name("Wind X axis").max(100).min(-100).step(1).onChange(function(){
        smokeWind.x = params.windForceX/100;
        lavaWind.x = params.windForceX/200;
    }); 
    
    //Aggiungo il controllo della forza del vento lungo la Z
    gui.add(params, 'windForceZ').name("Wind Z axis").max(100).min(-100).step(1).onChange(function(){
        smokeWind.z = params.windForceZ/100;
        lavaWind.z = params.windForceX/200;
    }); 
    
    //Aggiungo il cambiamento ambientale
    gui.add(params, 'style', [
            "volcano_1",
            "volcano_2",
            "volcano_3",
            "lava",
            "solidified_lava",
            "forest",
            "displacement",
            "mars",
            "moon",
            "encelado",
            "pluto",
            "black_paper",
            "wood",
            "plastic",
            "sand",
            "vortex",
            "mineral"
    ]).name("Style").onChange(function(){
        //Carico la nuova texture e la aggiorno
        vulcan.material.map = loader.load("img/styleTexture/"+params.style+".jpg");
        vulcan.material.needsUpdate = true;
        //Imposto i colori di base della lava e del fumo
        smokeColors = SMOKE_COLORS;
        lavaColors = LAVA_COLORS;
        
        //In base all'ambiente scelto, modifico il colore del fumo e della lava
        switch(params.style){
            case "solidified_lava": //Fumo più bianco
                smokeColors = [
                    0xffffff,
                    0xeeeeee,
                    0xdddddd
                ];
                break;
                
            case "mars" :
                smokeColors = [ //Fumo con sfumature di rosso
                    0xff9300,
                    0xff0000
                ];
                lavaColors = smokeColors;
                break;
                
            case "pluto" :
                smokeColors = [ //Fumo con sfumature di rosso
                    0xb13737,
                    0x8b4447,
                    0xffffff
                ];
                lavaColors = smokeColors;
                break;
            
            case "encelado" :   //Cryovolcano
                smokeColors = [ 
                    0x00baff,
                    0xa9deff,
                    0xffffff
                ]; 
                
                lavaColors = smokeColors;
                break;
                
            case "mineral" :
                smokeColors = [ //Fumo con sfumature viola
                    0x00baff,
                    0xa9deff,
                    0x7d13ac
                ];
                lavaColors = smokeColors;
                break;
                
            case "wood" :
                smokeColors = [ //Fumo con sfumature di rosa
                    0xffb2b2
                ];
                lavaColors = smokeColors;
                break;
                
            case "vortex" :
                smokeColors = [ //Fumo con sfumature di blu
                    0x0000ff,
                    0x2570ff
                ];
                lavaColors = smokeColors;
                break;
                
            case "plastic" :
                smokeColors = SMOKE_COLORS; //Fumo e lava grigio scuro
                lavaColors = smokeColors;
                break;
        }
        
        //Aggiorno il colore del fumo e della lava
        applyColorMap(smokeParticles, smokeColors);
        applyColorMap(lavaParticles, lavaColors);
        
    }); 
    
    //Pulsanti
    var button = {
        erupts:function(){  //Pulsante per cominciare l'eruttazione
            ERUPTS = true;  
            SMOKE_STOP = false;
        },
        pause:function(){   //Pulsante per fermare l'animazione
            ERUPTS = false;
            SMOKE_STOP = true;
        }
    };
    
    gui.add(button,'erupts').name("Erupts");    //Aggiungo il pulsante per l'eruttazione
    gui.add(button,'pause').name("Pause");      //Aggiungo il pulsante per fermare l'animazione 
    
}


	window.onload = function(){
        
        //Istanzio la GUI di controllo
        initGui();
        
		navigator.getUserMedia = navigator.getUserMedia || 
		                         navigator.webkitGetUserMedia ||
		                         navigator.mozGetUserMedia || 
								 navigator.msGetUserMedia;
		if(!navigator.getUserMedia){
			console.log("getUserMedia non è supportato");
			fallback();
		} else {
			//Connessione alla webcam
			var video = document.getElementById("hiddenVideo");
			navigator.getUserMedia({ 
                audio: false, 
                video: true 
            },
            function(stream){ 
				video.src = URL.createObjectURL(stream);	
            },
            function(err){
                console.log("Errore: " + err.name); 
                video.src = "marker.webm";
            });
            
			video.onloadedmetadata = start_processing;
		}
	}



	function start_processing(event){
	
		//Converto la matrice della prospettiva da JSARToolKit a Three.js
		function ConvertCameraMatrix(m) {
			myMat = new THREE.Matrix4();
			myMat.set( 
				m[0], m[4], m[8], m[12],
				-m[1], -m[5], -m[9], -m[13],
				m[2], m[6], m[10], m[14],
				m[3], m[7], m[11], m[15]
			);
			return myMat;
		}
			
		//Converto la matrice del marker da JSARToolKit a Three.js e ruoto la X +90°
		function ConvertMarkerMatrix(m) {
			myMat = new THREE.Matrix4();
			myMat.set(
				m.m00, m.m02, -m.m01, m.m03,
				m.m10, m.m12, -m.m11, m.m13, 
				m.m20, m.m22, -m.m21, m.m23,
				0, 0, 0, 1
			);
			return myMat;
		}
		
		/**
         * Crea il container che ospiterà tutti gli elementi della scena
         */
		function createContainer(){
			container = new THREE.Object3D();
			container.matrixAutoUpdate = false;
			scene.add(container);
			var axisHelper = new THREE.AxisHelper(65/2);
			container.add(axisHelper);

            lavaParticles = new Array(MAX_N_LAVA_PARTICLES);    //Array di particelle di lava
            
            //Creo le singole particelle di lava
            for(var i=0; i<MAX_N_LAVA_PARTICLES; i++){
                lavaParticles[i] = generateParticle(
                    lavaTextureName[Math.floor(getRandomInRange(0, lavaTextureName.length))],
                    LAVA_COLORS[Math.floor(getRandomInRange(0, LAVA_COLORS.length))],
                    createRange(-0.8, 0.8, 1, 2, -0.8, 0.8),
                    LAVA_ID
                );
                container.add(lavaParticles[i]);
            }
            
            smokeParticles = new Array(MAX_N_SMOKE_PARTICLES);  //Array di particelle di fumo
            
            //Creo le singole particelle di fumo
            for(var i=0; i<MAX_N_SMOKE_PARTICLES; i++){
                smokeParticles[i] = generateParticle(
                    smokeTextureName[Math.floor(getRandomInRange(0, smokeTextureName.length))],
                    SMOKE_COLORS[Math.floor(getRandomInRange(0, SMOKE_COLORS.length))],
                    createRange(-0.2, 0.2, 0.5, 2, -0.2, 0.2),
                    SMOKE_ID
                );
                container.add(smokeParticles[i]);
            }
            
            //Creo il vulcano
            vulcan = generateVulcan(vulcanDisplacement, vulcanTexture);
            container.add(vulcan);
		}
		
		
        
        /**
         * Gestisce l'illuminazione della scena
         */
		function illumination(){
            
            var pointLight = new THREE.PointLight(0xAAAAAA, 1, 0);
            pointLight.position.set( 100, 300, 200 );
            container.add(pointLight);
            
			var ambLight = new THREE.AmbientLight(0xFFFFFF);
			container.add(ambLight);
		}
        
        /**
         * Aggiorna ad ogni frame la posizione di ogni particella
         */
        function update(){
            //Aggiorna le particelle di lava se è in corso l'eruttazione
            if(ERUPTS){
                for(var i=0; i<N_LAVA_PARTICLES; i++){
                    //Calcolo la nuova posizione della particella in base velocità e accelerazione
                    lavaParticles[i].velocity.addVectors(lavaParticles[i].velocity, LAVA_ACCELERATION);
                    lavaParticles[i].position.addVectors(lavaParticles[i].position, lavaParticles[i].velocity);
                    
                    //Scalo la particella man mano che esce dalla bocca del vulcano. In questo modo non si vedono
                    //gli sprite fermi dentro il vulcano
                    if(lavaParticles[i].scale.x < LAVA_SCALE){ 
                        particleScale(lavaParticles[i], LAVA_ID);
                    }
                    
                    //Cambio la direzione in base al vento
                    if((lavaWind.x != 0 || lavaWind.z != 0)){
                        lavaParticles[i].position.addVectors(lavaParticles[i].position, lavaWind);
                    }
                    //Se le particelle toccano il suolo le resetto
                    if(lavaParticles[i].position.y <= 0){
                        particleReset(lavaParticles[i]);
                    }
                }
            }
            
            //Se l'animazione non è stata fermata aggiorno le particelle di fumo
            if(!SMOKE_STOP){
                //Aggiorna le particelle di fumo
                for(var i=0; i<N_SMOKE_PARTICLES; i++){
                    //Aggiorna la posizione della particella di fumo in base alla velocità
                    smokeParticles[i].position.addVectors(smokeParticles[i].position, smokeParticles[i].velocity);
                    
                    //Viene applicato il vento alla particella di fumo
                    if((smokeWind.x != 0 || smokeWind.z != 0) && smokeParticles[i].position.y > 80){
                        smokeParticles[i].position.addVectors(smokeParticles[i].position, smokeWind);
                    }
                    
                    //Scala il fumo in base alla sua posizione sull'asse y
                    particleScale(smokeParticles[i], SMOKE_ID);
                    
                    //Se la particella di fumo ha raggiunto l'apice in y, la resetto
                    if(smokeParticles[i].position.y >= 200){
                        particleReset(smokeParticles[i]);
                    }
                }
            }
            
        }

		

		//Setto il video e le canvas
		var hvideo = document.getElementById("hiddenVideo");
		var hcanvas = document.getElementById("hiddenCanvas");
		var dcanvas = document.getElementById("drawingCanvas");
		var ocanvas = document.getElementById("outCanvas");
		hcanvas.width = ocanvas.width = dcanvas.width = hvideo.clientWidth;
		hcanvas.height = ocanvas.height = dcanvas.height = hvideo.clientHeight;
		//Non mostro il video
		hvideo.style.display = "none";
		//Non mostro le due canvas
		hcanvas.style.display = "none";
		dcanvas.style.display = "none";
		
		//Setto JSARToolKit
		var ART_raster = new NyARRgbRaster_Canvas2D(hcanvas);
		var ART_param = new FLARParam(hcanvas.width, hcanvas.height);
		//Il numero passato come parametro indica i millimetri del marker
		var ART_detector = new FLARMultiIdMarkerDetector(ART_param, 65);
		ART_detector.setContinueMode(true);
		
		//Setto three.js
		var renderer = new THREE.WebGLRenderer( {canvas: dcanvas} );
		renderer.autoClear = false;

		//Creo il backgrond e la sua camera
		var bgTexture = new THREE.Texture(hcanvas);
		var bgPlane = new THREE.Mesh(
			new THREE.PlaneGeometry(2,2),
			new THREE.MeshBasicMaterial({
                map: bgTexture, 
                depthTest: false, 
                depthWrite: false
            })
		);
		var bgCamera = new THREE.Camera();
		var bgScene = new THREE.Scene();
		bgScene.add(bgPlane);
		bgScene.add(bgCamera);
		
		//Creo la scena
		var scene = new THREE.Scene();
		var camera = new THREE.Camera();
		var tmp = new Float32Array(16);
		ART_param.copyCameraMatrix(tmp,1,10000);
		camera.projectionMatrix = ConvertCameraMatrix(tmp); //Punta alla z positiva
		scene.add(camera);
        
		createContainer();    //Creo l'oggetto container che conterrà tutti gli oggetti 3d
		illumination();       //Setto l'illuminazione
		
		//Processo ogni frame
		setInterval(function(){
			//Aggiorno la canvas nascosta 
			hcanvas.getContext("2d").drawImage(hvideo, 0, 0, hcanvas.width, hcanvas.height);
			hcanvas.changed = true;
			bgTexture.needsUpdate = true;
			//Disegno lo sfondo
			renderer.clear();
			renderer.render(bgScene, bgCamera);

            //Aggiorno tutte le componenti della scena
            update();
            
			//Esegue la marker detection
			var markerCount = ART_detector.detectMarkerLite(ART_raster, 128);
			//Se il marker è stato trovato si passa alla renderizzazione
			if(markerCount > 0){
				var tmat = new NyARTransMatResult();
				ART_detector.getTransformMatrix(0, tmat);
				container.matrix = ConvertMarkerMatrix(tmat);
				renderer.render( scene, camera );
			}
			ocanvas.getContext("2d").drawImage( dcanvas, 0, 0, dcanvas.width, dcanvas.height );
		}, 40);
	}