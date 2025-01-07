// Escena, càmera i renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const camera = new THREE.PerspectiveCamera(75, (window.innerWidth - 200) / (window.innerHeight - 50), 0.1, 1000);
camera.position.set(0, 20, 35); // Posició fixa de la càmera
camera.lookAt(0, 0, 0); // Mirar cap al centre de l'escena


const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth - 200, window.innerHeight - 50);
const canvas = renderer.domElement;
document.getElementById('mainCanvas').appendChild(canvas);

// Crear un pla invisible per calcular interseccions
const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0); // Pla a Y = 0

// Control de camara para el usuario:
/*
- Zoom: rueda raton
- 'Arrastrar escena': click derecho
- Rotar camara: Click y dejar presionado boton izquierdo del raton
*/
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Habilitar amortiguación (suaviza el movimiento)
controls.dampingFactor = 0.05;
controls.rotateSpeed = 0.1;   // Ajustar velocidad de rotación


const debugSphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
);

scene.add(debugSphere);


function createGrid(width, height, cellSize) {
    const divisionsX = Math.floor(width / cellSize);  // Nombre de divisions en X
    const divisionsZ = Math.floor(height / cellSize); // Nombre de divisions en Z

    const gridHelper = new THREE.GridHelper(
        Math.max(width, height),  // Mida total de la graella (agafa el màxim)
        Math.max(divisionsX, divisionsZ) // Nombre de divisions (agafa el màxim)
    );
    gridHelper.position.set(0.5, 0, 0.5);
    gridHelper.scale.set(1.5, 1.5, 1.5);
    gridHelper.isNonSelectable = true;
    scene.add(gridHelper);
}

// Exemple d'ús
createGrid(30, 30, 1);

// Raycaster i variables globals
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let dragTarget = null;

const models = []; // Llista de models a la escena
const pivots = []; // Llista de pivots a la escena

const loader = new THREE.GLTFLoader();

// Llum ambiental i direccional
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 10, 10);
scene.add(ambientLight, directionalLight);

//// Animació contínua
//function animate() {
//    renderer.render(scene, camera);
//    requestAnimationFrame(animate);
//}
//animate();

function animate() {
    requestAnimationFrame(animate);

    controls.update(); // Requerido si enableDamping está activado
    renderer.render(scene, camera);
}
animate();




/* Seleccionar elemento */
let selectedModelPath = null; // Variable para guardar el modelo seleccionado
// Gestiona clics als thumbnails per carregar models
document.querySelectorAll('.thumbnail').forEach((thumbnail) => {
    thumbnail.addEventListener('click', () => {
        // Escogemos el modelo (dejarlo seleccionado)
        selectedModelPath = thumbnail.dataset.model;
        loadModel(selectedModelPath);

        document.querySelectorAll('.thumbnail').forEach((el) => el.classList.remove('selected')); // Deseleccionamos el resto de elementos
        thumbnail.classList.add('selected'); // Marca el thumbnail actual como seleccionado
    });
});


function calculateMousePosition(event) {
    const sidebarWidth = document.getElementById('sidebar').offsetWidth;
    const controlsHeight = document.getElementById('controls').offsetHeight;
    const canvasWidth = window.innerWidth - sidebarWidth;

    // Coordenades del ratolí corregides segons el desplaçament del canvas
    mouse.x = ((event.clientX - sidebarWidth) / canvasWidth) * 2 - 1;
    mouse.y = -((event.clientY + controlsHeight) / window.innerHeight) * 2 + 1;

    // Actualitzar el raycaster segons la càmera i la posició del ratolí
    raycaster.setFromCamera(mouse, camera);

    // Calcular la intersecció amb el pla horitzontal
    const intersectionPoint = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, intersectionPoint);
    //debugSphere.position.copy(intersectionPoint);
    return intersectionPoint;
}

// Funció per carregar un model
function loadModel(modelPath) {
    // Si hay un modelo en pantalla, eliminarlo antes de cargar uno nuevo
    if (dragTarget) {
        scene.remove(dragTarget);

        // Buscar el índice del modelo en la lista de modelos
        const index = models.indexOf(dragTarget);
        if (index !== -1) {
            models.splice(index, 1); // Eliminar el modelo de la lista
        }

        dragTarget = null;
    }

    loader.load(modelPath, (gltf) => {
        const model = gltf.scene;
        model.name = modelPath.split('.')[0];
        model.name = model.name.split('/')[2];
        model.position.set(0, 0, 0);
        model.scale.set(0.2, 0.2, 0.2);



        /*if (model.name === "box_test") { // Comprova si el model és box.glb
            model.traverse((child) => {
                if (child.isMesh) {
                    child.material.depthTest = false; // Ignora profunditat
                    child.material.depthWrite = false; // No escriu a la profunditat
                }
            });
        }*/


        const box = new THREE.Box3().setFromObject(model); // Caixa d'encapsulament del model
        const size = box.getSize(new THREE.Vector3()); // Obtenim les dimensions del model
        const center = box.getCenter(new THREE.Vector3()); // Centre del model
        model.position.sub(center); // Ajustar la posició perquè el pivot quedi al centre
        model.position.y = size.y / 2 - center.y; // Ajustar posición del modelo para que quede sobre el suelo

        const pivot = new THREE.Object3D(); // Crear el pivot
        pivot.add(model); // Afegir el model al pivot
        pivot.name = model.name;
        pivot.position.copy(center); // Posicionar el pivot on hauria d'estar el model

        pivot.orientacio = 0;
        pivot.height = size.y; // Afegir la propietat d'alçada al pivot
        pivot.x = size.x;
        pivot.z = size.z;
        pivot.bif = 0;

        scene.add(pivot);
        models.push(model); // Afegim el pivot a la llista
        pivots.push(pivot);
        dragTarget = pivot;

    });
}

function checkCollision(targetPivot) {
    const targetBox = new THREE.Box3().setFromObject(targetPivot); // Caixa que envolta el pivot

    for (const pivot of pivots) {
        if (pivot !== targetPivot && pivot.name !== "box_test") { // No comparar amb ell mateix
            const pivotBox = new THREE.Box3().setFromObject(pivot);
            if (targetBox.intersectsBox(pivotBox)) { // Comprova col·lisió
                return pivot; // Col·lisió detectada
            }
        }
    }
    return null; // No hi ha col·lisió
}


// Actualitzar la posició del model perquè coincideixi amb el ratolí
canvas.addEventListener("mousemove", (event) => {
    const intersectionPoint = calculateMousePosition(event);
    if (intersectionPoint) {
        if (dragTarget) {
            debugSphere.position.set(intersectionPoint.x, (dragTarget.height / 2), intersectionPoint.z);
            if (dragTarget.name === "box_test") {
                collision = checkCollision(dragTarget);
                if (collision) {
                    dragTarget.position.set(intersectionPoint.x, (dragTarget.height / 2) + collision.height - 0.25, intersectionPoint.z);
                }
                else {
                    dragTarget.position.set(intersectionPoint.x, (dragTarget.height / 2), intersectionPoint.z);
                }
            }
            else {
                dragTarget.position.set(intersectionPoint.x, (dragTarget.height / 2), intersectionPoint.z);
            }

        }
    }
});

// Afegir un event listener per a les tecles de fletxa
window.addEventListener('keydown', (event) => {
    if (!dragTarget) return; // Si no hi ha cap model seleccionat, no fem res

    switch (event.key) {
        case 'ArrowRight': // Fletxa dreta
            dragTarget.rotation.y -= Math.PI / 2; // Girar 90 graus en sentit horari
            dragTarget.orientacio -= 90;
            break;
        case 'ArrowLeft': // Fletxa esquerra
            dragTarget.rotation.y += Math.PI / 2; // Girar 90 graus en sentit antihorari
            dragTarget.orientacio += 90;
            break;
    }

    dragTarget.orientacio = (dragTarget.orientacio + 360) % 360;
    console.log(`Nova orientació del pivot: ${dragTarget.orientacio} graus`);
});


var isDragging = false;
// Aturar el moviment del model quan es fa clic amb el botó esquerre del ratolí
canvas.addEventListener("click", (event) => {
    if (event.button === 0) { // Botó esquerre del ratolí
        if (event.defaultPrevented) return;

        dragTarget = null;

        if (selectedModelPath) {
            loadModel(selectedModelPath); // Añade una nueva instancia del modelo
        }
        else if (!isDragging) {
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(models, true); // 

            if (intersects.length > 0) {

                let obj = getParentGroup(intersects[0].object);

                console.log(obj);

                dragTarget = obj;

                isDragging = true; // Comenzar a arrastrar
            }
        }
        else if (isDragging)
            isDragging = false;
    }
});

function getParentGroup(object) {
    while (object.parent && !(object.parent instanceof THREE.Scene)) {
        object = object.parent;
    }
    return object;
}

// Al hacer click derecho, desactivar el model seleccionado
canvas.addEventListener("contextmenu", (event) => {
    if (selectedModelPath)
        selectedModelPath = null; // Desactivar el modelo seleccionado

    if (dragTarget) {
        scene.remove(dragTarget);

        // Buscar el índice del modelo en la lista de modelos
        const index = models.indexOf(dragTarget);
        if (index !== -1) {
            models.splice(index, 1); // Eliminar el modelo de la lista
        }

        dragTarget = null;
    }

    document.querySelectorAll('.thumbnail').forEach((el) => el.classList.remove('selected')); // Deseleccionamos el resto de elementos
});


///* Evento para anyadir el modelo */
//document.addEventListener('click', (event) => {
//    event.preventDefault(); // Evita el menú contextual del clic derecho
//    if (selectedModelPath) {
//        loadModel(selectedModelPath); // Añade una nueva instancia del modelo
//    }
//});



// Variables per al cronòmetre
let timerInterval = null;
let elapsedTime = 0;
let speedMultiplier = 1; // Controla la velocitat del cronòmetre

function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

function updateTimerDisplay() {
    document.getElementById('timer').textContent = formatTime(elapsedTime);
}

function isCenterInsideBoundingBox(modelA, modelB) {
    // Crear caixes delimitadores per als dos models
    const boxA = new THREE.Box3().setFromObject(modelA);
    const boxB = new THREE.Box3().setFromObject(modelB);

    // Obtenir el centre de la caixa de modelA
    const centerB = boxB.getCenter(new THREE.Vector3());

    const pointToCheck = new THREE.Vector3(centerB.x, boxA.min.y, centerB.z);

    // Comprovar si el centre de modelA està dins de la caixa de modelB
    return boxA.containsPoint(pointToCheck);
}

function mourecostats(pivot, random, orientacio) {
    let counter = 0; // Comptador de moviments
    const interval = setInterval(() => {
        if (counter >= 6) {
            clearInterval(interval); // Atura el moviment després de 5 segons
            return;
        }
        switch (orientacio) {
            case 0:
                pivot.position.x += 0.25 * speedMultiplier * random; // Mou només el pivot que està en col·lisió
                break;
            case 1:
                pivot.position.z += 0.25 * speedMultiplier * random; // Mou només el pivot que està en col·lisió
                break;
 
        } // Mou l'objecte en l'eix X
        counter++; // Incrementa el comptador de moviments
    }, 1000); // Executa cada 1000 ms (1 segon)

    pivot.bif = 0;
}

function abs(x, y) {
    if (x > y) return x - y;
    else return y - x;
}

function moveCollidingPivots(speed) {
    pivots.forEach((pivot) => {
        if (pivot.name === "box_test") {
            collision = checkCollision(pivot);
            if (collision) {
                switch (collision.orientacio) {
                    case 0:
                        pivot.position.z += speed; // Mou només el pivot que està en col·lisió
                        break;
                    case 90:
                        pivot.position.x += speed; // Mou només el pivot que està en col·lisió
                        break;
                    case 180:
                        pivot.position.z -= speed; // Mou només el pivot que està en col·lisió
                        break;
                    case 270:
                        pivot.position.x -= speed; // Mou només el pivot que està en col·lisió
                        break;
                }

                switch (collision.name) {
                    case "Bifurcator":
                        if (isCenterInsideBoundingBox(pivot, collision)) {
                            const randomIndex = Math.floor(Math.random() * 3) - 1;
                            switch (collision.orientacio) {
                                case 0:
                                    if (pivot.bif === 0) {
                                        mourecostats(pivot, randomIndex, 0)
                                        pivot.bif = 1;
                                    }
                                    
                                    break;
                                case 90:
                                    if (pivot.bif === 0) {
                                        mourecostats(pivot, randomIndex, 1)
                                        pivot.bif = 1;
                                    }
                                    break;
                                case 180:
                                    if (pivot.bif === 0) {
                                        mourecostats(pivot, randomIndex, 0)
                                        pivot.bif = 1;
                                    }
                                    break;
                                case 270:
                                    if (pivot.bif === 0) {
                                        mourecostats(pivot, randomIndex, 1)
                                        pivot.bif = 1;
                                    }
                                    break;
                            }
                        }

                        break;

                    case "Union2":
                        switch (collision.orientacio) {
                            case 0:
                                if (pivot.bif === 0) {
                                    if (pivot.position.x > pivot.x + collision.position.x) {
                                        mourecostats(pivot, -1, 0)
                                    }
                                    else if (pivot.position.x < pivot.x + collision.position.x && abs(pivot.position.x, collision.position.x) > pivot.x) {
                                        mourecostats(pivot, 1, 0)
                                    }

                                    pivot.bif = 1;
                                }
                                pivot.position.z -= 2*speed; // Mou només el pivot que està en col·lisió
                                break;
                            case 90:
                                if (pivot.bif === 0) {
                                    if (pivot.position.z > pivot.z + collision.position.z) {
                                        mourecostats(pivot, -1, 1)
                                    }
                                    else if (pivot.position.z < pivot.z + collision.position.z && abs(pivot.position.z, collision.position.z) > pivot.z) {
                                        mourecostats(pivot, 1, 1)
                                    }

                                    pivot.bif = 1;
                                }
                                pivot.position.x -= 2*speed; // Mou només el pivot que està en col·lisió
                                break;
                            case 180:
                                if (pivot.bif === 0) {
                                    if (pivot.position.x > pivot.x + collision.position.x) {
                                        mourecostats(pivot, -1, 0)
                                    } 
                                    else if (pivot.position.x < pivot.x + collision.position.x && abs(pivot.position.x, collision.position.x) > pivot.x) {
                                        mourecostats(pivot, 1, 0)
                                    }
                                    
                                    pivot.bif = 1;
                                }
                                pivot.position.z += 2*speed; // Mou només el pivot que està en col·lisió
                                break;
                            case 270:
                                if (pivot.bif === 0) {
                                    if (pivot.position.z > pivot.z + collision.position.z) {
                                        mourecostats(pivot, -1, 1)
                                    }
                                    else if (pivot.position.z < pivot.z + collision.position.z && abs(pivot.position.z, collision.position.z) > pivot.z) {
                                        mourecostats(pivot, 1, 1)
                                    }

                                    pivot.bif = 1;
                                }
                                pivot.position.x += 2*speed; // Mou només el pivot que està en col·lisió
                                break;
                        }

                }
            }
            

        }
    });
}


// Afegim la comprovació de col·lisions al cronòmetre
document.getElementById('startButton').addEventListener('click', () => {
    if (timerInterval === null) {
        const startTime = Date.now() - elapsedTime / speedMultiplier;
        timerInterval = setInterval(() => {
            elapsedTime = (Date.now() - startTime) * speedMultiplier;
            updateTimerDisplay();

            moveCollidingPivots(0.25 * speedMultiplier);

        }, 1000 / speedMultiplier);
    }
});


document.getElementById('pauseButton').addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
});

document.getElementById('stopButton').addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
    elapsedTime = 0;
    updateTimerDisplay();
});

document.getElementById('doubleSpeedButton').addEventListener('click', () => {
    if (timerInterval !== null) {
        if (speedMultiplier === 2) {
            // Tornar a velocitat normal
            speedMultiplier = 1;
        } else {
            // Canviar a doble velocitat
            speedMultiplier = 2;
        }
        clearInterval(timerInterval);
        const startTime = Date.now() - elapsedTime / speedMultiplier;
        timerInterval = setInterval(() => {
            elapsedTime = (Date.now() - startTime) * speedMultiplier;
            updateTimerDisplay();

            moveCollidingPivots(0.25 * speedMultiplier);

        }, 1000 / speedMultiplier);
    }
});

// Resize handler
window.addEventListener("resize", () => {
    camera.aspect = (window.innerWidth - 200) / (window.innerHeight - 50);
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth - 200, window.innerHeight - 50);
});