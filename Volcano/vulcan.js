/**
 * Genera un vulcano a partire da una displacement map
 */
function generateVulcan(displacement, texture){
    var vulcanGeometry = new THREE.PlaneGeometry(200,200,30,30);        //Geometria del piano
    var rotation = new THREE.Matrix4().makeRotationX(3*Math.PI/2);      //Imposto il parallelismo con il piano del marker
    var traslation = new THREE.Matrix4().makeTranslation(0,-65/2,0);    //Sposto in verticale il piano
    
    //Applico le trasformazioni
    vulcanGeometry.applyMatrix(rotation);
    vulcanGeometry.applyMatrix(traslation);

    //Materiale del vulcano
    var vulcanMaterial = new THREE.MeshPhongMaterial({
        displacementMap:displacement, 
        displacementScale:150, 
        map:texture,
        transparent:true
    });
    
    return new THREE.Mesh(vulcanGeometry, vulcanMaterial);
}