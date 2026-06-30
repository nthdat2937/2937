const THREE = require('three');
const shape = new THREE.Shape();
shape.moveTo(-4, 20); 
shape.quadraticCurveTo(-15, 35, -25, 15); 
shape.lineTo(-35, -15); 
shape.quadraticCurveTo(-38, -25, -25, -25); 
shape.lineTo(25, -25); 
shape.quadraticCurveTo(38, -25, 35, -15); 
shape.lineTo(25, 15); 
shape.quadraticCurveTo(15, 35, 4, 20); 
shape.lineTo(-4, 20); 

const hole = new THREE.Path();
hole.moveTo(-10, 5);
hole.lineTo(10, 5);
hole.lineTo(16, -5);
hole.lineTo(16, -15);
hole.lineTo(-16, -15);
hole.lineTo(-16, -5);
hole.lineTo(-10, 5);
shape.holes.push(hole);

try {
    const geo = new THREE.ShapeGeometry(shape);
    console.log("Success! Vertices: ", geo.attributes.position.count);
} catch (e) {
    console.error("Error generating geometry:", e);
}
