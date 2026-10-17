const canvas = document.getElementById("waveCanvas");
const ctx = canvas.getContext("2d");

let width;
let height;
let dpr;

let mouseX = 0.5;
let mouseY = 0.5;

let targetX = 0.5;
let targetY = 0.5;

let time = 0;


/* ---------------- WAVE SETTINGS ---------------- */

const waves = [
    { frequency: 0.008, amplitude: 62, speed: 0.010, phase: 0 },
    { frequency: 0.011, amplitude: 78, speed: 0.013, phase: 1.2 },
    { frequency: 0.014, amplitude: 54, speed: 0.008, phase: 2.1 },
    { frequency: 0.017, amplitude: 69, speed: 0.015, phase: 3.4 },
    { frequency: 0.020, amplitude: 47, speed: 0.011, phase: 4.2 },
    { frequency: 0.024, amplitude: 58, speed: 0.017, phase: 5.1 },
    { frequency: 0.029, amplitude: 42, speed: 0.020, phase: 6.0 }
];


/* ---------------- CANVAS SIZE ---------------- */

function resizeCanvas() {

    dpr = Math.min(window.devicePixelRatio || 1, 2);

    width = canvas.clientWidth;
    height = canvas.clientHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();


/* ---------------- MOUSE ---------------- */

window.addEventListener("pointermove", (event) => {

    targetX = event.clientX / window.innerWidth;
    targetY = event.clientY / window.innerHeight;

});


/* ---------------- DRAW WAVE ---------------- */

function drawWave(wave, index) {

    /*
        Mouse Y controls amplitude.

        Top of screen  → smaller waves
        Bottom         → larger waves
    */

    const amplitudeMultiplier =
        0.55 + targetY * 1.15;


    /*
        Mouse X controls phase.
    */

    const mousePhase =
        (targetX - 0.5) * 5;


    ctx.beginPath();


    /*
        Seven waves sit around the center.
    */

    const verticalOffset =
        height * 0.42 + (index - 3) * 12;


    for (let x = 0; x <= width; x += 3) {

        const waveTime =
            time * wave.speed;

        const phase =
            wave.phase +
            waveTime +
            mousePhase;


        const y =
            verticalOffset +
            Math.sin(
                x * wave.frequency + phase
            ) *
            wave.amplitude *
            amplitudeMultiplier;


        if (x === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }


    /*
        Blue → turquoise → green.
    */

    const gradient =
        ctx.createLinearGradient(0, 0, width, 0);

    gradient.addColorStop(
        0,
        "rgba(31, 112, 174, 0.3)"
    );

    gradient.addColorStop(
        0.5,
        "rgba(40, 181, 148, 0.3)"
    );

    gradient.addColorStop(
        1,
        "rgba(56, 255, 192, 0.4)"
    );


    ctx.strokeStyle = gradient;

    ctx.lineWidth = 1;

    ctx.stroke();
}


/* ---------------- ANIMATION ---------------- */

function animate() {

    /*
        Smooth mouse movement.
    */

    mouseX += (targetX - mouseX) * 0.05;
    mouseY += (targetY - mouseY) * 0.05;


    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    /*
        Draw all seven waves.
    */

    waves.forEach(drawWave);


    time += 1;

    requestAnimationFrame(animate);
}


animate();