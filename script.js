// 1. CONFIGURACIÓN PERSONALIZADA
const fechaInicio = new Date('2025-09-21T18:25:00'); 
const TELEFONO = "34685387298"; 

// 2. ESTADO INICIAL
let saldo = parseInt(localStorage.getItem('saldo')) || 0;
let quizCompletado = localStorage.getItem('quizCompletado') === 'false';
let cuponesComprados = JSON.parse(localStorage.getItem('cuponesComprados')) || [];

// 3. DATOS DE CUPONES
const cupones = [
    { id: 1, nombre: "Massatge Profesional", precio: 100, tipo: "whatsapp", valor: "Vull el meu massatge chikibeibi" },
    { id: 2, nombre: "Picnic al Atardecer", precio: 150, tipo: "whatsapp", valor: "Anem de picnic" },
    { id: 3, nombre: "Chef per una nit", precio: 200, tipo: "whatsapp", valor: "Avui em cuines tu, jefe." },
    { id: 4, nombre: "Cita Sorpresa", precio: 300, tipo: "whatsapp", valor: "Bomboclat!" },
    { id: 5, nombre: "Dia de Sí a Tot", precio: 500, tipo: "whatsapp", valor: "Avui escullo jo tot!" },
    { id: 6, nombre: "Regal Físic #1", precio: 100, tipo: "fisico", valor: "Obre el regal 1" },
    { id: 7, nombre: "Regal Físic #2", precio: 100, tipo: "fisico", valor: "Obre el regal 2" },
    { id: 8, nombre: "Regal Físic #3", precio: 100, tipo: "fisico", valor: "Obre el regal 3" },
    { id: 9, nombre: "Regal Físic #4", precio: 100, tipo: "fisico", valor: "Obre el regal 4" },
    { id: 10, nombre: "Regal Físic #5", precio: 100, tipo: "fisico", valor: "Obre el regal 5" }
];

// 4. SISTEMA DE MENSAJES (TOAST)
function mostrarMensaje(texto) {
    const toast = document.getElementById('toast-container');
    toast.innerText = texto;
    toast.classList.add('visible');
    setTimeout(() => toast.classList.remove('visible'), 3000);
}

// 5. CÁLCULO DEL CONTADOR
function actualizarContador() {
    const ahora = new Date();
    let anios = ahora.getFullYear() - fechaInicio.getFullYear();
    let mesesTotal = (ahora.getMonth()) - (fechaInicio.getMonth()) + (anios * 12);
    let fechaAux = new Date(fechaInicio);
    fechaAux.setMonth(fechaAux.getMonth() + mesesTotal);
    if (fechaAux > ahora) { mesesTotal--; fechaAux = new Date(fechaInicio); fechaAux.setMonth(fechaAux.getMonth() + mesesTotal); }
    const diferenciaMs = ahora - fechaAux;
    const d = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));
    const h = Math.floor((diferenciaMs / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diferenciaMs / 1000 / 60) % 60);
    const s = Math.floor((diferenciaMs / 1000) % 60);
    const mesesElem = document.getElementById('meses');
    if (mesesElem) {
        mesesElem.innerText = mesesTotal;
        document.getElementById('dias').innerText = d < 10 ? '0' + d : d;
        document.getElementById('horas').innerText = h < 10 ? '0' + h : h;
        document.getElementById('minutos').innerText = m < 10 ? '0' + m : m;
        document.getElementById('segundos').innerText = s < 10 ? '0' + s : s;
    }
}

// 6. GESTIÓN DE SALDO Y UI
function sumarSaldo(cantidad) {
    saldo += cantidad;
    actualizarSaldoVisual();
}

function actualizarSaldoVisual() {
    document.querySelectorAll('.saldo-valor').forEach(el => el.innerText = saldo);
    localStorage.setItem('saldo', saldo);

    const btnTienda = document.getElementById('btn-tienda');
    if (btnTienda) {
        if (quizCompletado) {
            btnTienda.disabled = false;
            btnTienda.innerText = "Anar a la tenda";
            btnTienda.style.opacity = "1";
        } else {
            btnTienda.disabled = true;
            btnTienda.innerText = "Completa el quiz primer";
            btnTienda.style.opacity = "0.5";
        }
    }

    if(quizCompletado) {
        const btnQuiz = document.getElementById('btn-quiz');
        if(btnQuiz) { 
            btnQuiz.disabled = true; 
            btnQuiz.innerText = "Quiz (Completat)"; 
            btnQuiz.style.opacity = "0.5"; 
        }
    }
}

function mostrarPantalla(id) {
    document.querySelectorAll('.pantalla').forEach(p => p.classList.add('oculto'));
    document.getElementById(id).classList.remove('oculto');
}

// 7. LÓGICA DE LA TIENDA
function irATienda() {
    if (quizCompletado) {
        renderizarTienda();
        mostrarPantalla('pantalla-tienda');
    } else {
        mostrarMensaje("¡Has de completar el Quiz primer!");
    }
}

function renderizarTienda() {
    const contenedor = document.getElementById('contenedor-cupones');
    contenedor.innerHTML = '';
    cupones.forEach(cupon => {
        const estaComprado = cuponesComprados.includes(cupon.id);
        const tarjeta = document.createElement('div');
        tarjeta.className = `tarjeta-cupon ${estaComprado ? 'comprat' : ''}`;
        tarjeta.innerHTML = `
            <div class="cupon-nombre">${cupon.nombre}</div>
            <div class="cupon-precio">❤️ ${cupon.precio}</div>
            <button class="btn-principal btn-comprar" 
                ${(saldo < cupon.precio || estaComprado) ? 'disabled' : ''} 
                onclick="comprarCupon(${cupon.id})">
                ${estaComprado ? 'Comprat' : 'Comprar'}
            </button>
        `;
        contenedor.appendChild(tarjeta);
    });
}

function comprarCupon(id) {
    const cupon = cupones.find(c => c.id === id);
    if (!cupon || saldo < cupon.precio) return;
    saldo -= cupon.precio;
    cuponesComprados.push(id);
    localStorage.setItem('cuponesComprados', JSON.stringify(cuponesComprados));
    actualizarSaldoVisual();
    renderizarTienda();
    if (cupon.tipo === "whatsapp") {
        const url = `https://wa.me/${TELEFONO}?text=${encodeURIComponent("✅✅ CUPÓN COMPRAT ✅✅ \n - " + cupon.nombre + ": " + cupon.valor)}`;
        window.open(url, '_blank');
        mostrarMensaje("¡Cupón canjeado! Obrint WhatsApp...");
    } else {
        mostrarMensaje("¡Regalo desbloqueado! Pista: " + cupon.valor);
    }
}

// 8. TUS PREGUNTAS DEL QUIZ Y LÓGICA DE PUNTUACIÓN
const preguntas = [
    { p: "Quina pel·lícula vam veure la primera quedada?", r: ["Los Goonies", "IT 2", "Expediente Warren"], c: 2 },
    { p: "Quin és el meu menjar preferit?", r: ["Lasaña", "Espaguetis a la carbonara", "Sushi"], c: 1 },
    { p: "Quin dia vam quedar per primer cop?", r: ["21 Sept", "20 Sept", "28 Sept"], c: 0 },
    { p: "A quina disco ens vam conéixer?", r: ["Legendfest", "Carlos Kirk Music", "Wolf"], c: 2 },
    { p: "Quina és la meva sèrie preferida?", r: ["Prison Break", "Bodyguard", "Vis a Vis"], c: 0 },
];
let preguntaActual = 0;
let bloqueadoQuiz = false;
let respuestasCorrectas = 0; // Contador de aciertos al primer intento
let falloEnPreguntaActual = false; // Rastreador de errores por pregunta

function iniciarQuiz() {
    if(quizCompletado) return;
    preguntaActual = 0;
    respuestasCorrectas = 0;
    bloqueadoQuiz = false;
    mostrarPantalla('pantalla-quiz');
    document.getElementById('opciones-quiz').classList.remove('oculto');
    document.getElementById('pregunta-texto').classList.remove('oculto');
    document.getElementById('resultado-quiz').classList.add('oculto');
    mostrarPregunta();
}

function mostrarPregunta() {
    bloqueadoQuiz = false;
    falloEnPreguntaActual = false; // Reiniciamos el rastreador de fallos para la nueva pregunta
    document.getElementById('btn-siguiente-quiz').classList.add('oculto');
    const q = preguntas[preguntaActual];
    document.getElementById('pregunta-texto').innerText = q.p;
    const contenedor = document.getElementById('opciones-quiz');
    contenedor.innerHTML = '';
    q.r.forEach((op, i) => {
        const btn = document.createElement('button');
        btn.innerText = op;
        btn.className = 'opcion-btn';
        btn.onclick = (e) => verificarRespuesta(i, e.target);
        contenedor.appendChild(btn);
    });
}

function verificarRespuesta(indice, elemento) {
    if(bloqueadoQuiz) return;
    const q = preguntas[preguntaActual];
    if(indice === q.c) {
        elemento.classList.add('correcto');
        bloqueadoQuiz = true;
        // Solo sumamos acierto si no ha fallado antes en esta misma pregunta
        if (!falloEnPreguntaActual) {
            respuestasCorrectas++;
        }
        document.getElementById('btn-siguiente-quiz').classList.remove('oculto');
    } else {
        elemento.classList.add('error');
        falloEnPreguntaActual = true; // Marcamos que ha fallado en esta pregunta
    }
}

function siguientePregunta() {
    preguntaActual++;
    if(preguntaActual < preguntas.length) {
        mostrarPregunta();
    } else {
        finalizaQuiz();
    }
}

function finalizaQuiz() {
    quizCompletado = true;
    localStorage.setItem('quizCompletado', 'true');
    sumarSaldo(200);
    
    // Mostramos el marcador final (ej: 3/3)
    document.getElementById('marcador-final').innerText = `Resultat: ${respuestasCorrectas} / ${preguntas.length}`;
    
    document.getElementById('opciones-quiz').classList.add('oculto');
    document.getElementById('pregunta-texto').classList.add('oculto');
    document.getElementById('btn-siguiente-quiz').classList.add('oculto');
    document.getElementById('resultado-quiz').classList.remove('oculto');
    actualizarSaldoVisual();
}

// 9. MINIJUEGOS (LÓGICA)
let puntosCatch = 0;
let tiempoCatch = 20;
let catchInterval, spawnInterval;

function iniciarCatch() {
    puntosCatch = 0;
    tiempoCatch = 20;
    document.getElementById('catch-puntos').innerText = "0";
    document.getElementById('catch-tiempo').innerText = "20";
    document.getElementById('area-juego').innerHTML = '';
    mostrarPantalla('pantalla-catch');
    catchInterval = setInterval(() => {
        tiempoCatch--;
        document.getElementById('catch-tiempo').innerText = tiempoCatch;
        if(tiempoCatch <= 0) finalizarCatch();
    }, 1000);
    spawnInterval = setInterval(crearCorazon, 600);
}

function finalizarCatch() {
    clearInterval(catchInterval);
    clearInterval(spawnInterval);
    sumarSaldo(puntosCatch * 5);
    mostrarMensaje("¡Fin! Has ganado " + (puntosCatch * 5) + " Lovecoins");
    setTimeout(() => mostrarPantalla('pantalla-juegos'), 2000);
}

function salirDeJuego() {
    clearInterval(catchInterval);
    clearInterval(spawnInterval);
    mostrarPantalla('pantalla-inicio');
}

function crearCorazon() {
    const area = document.getElementById('area-juego');
    if (!area || area.closest('.oculto')) return;
    const c = document.createElement('div');
    c.innerHTML = "❤️";
    c.className = "corazon-drop";
    c.style.left = Math.random() * 85 + "%";
    c.style.top = Math.random() * 85 + "%";
    c.onclick = () => { puntosCatch++; document.getElementById('catch-puntos').innerText = puntosCatch; c.remove(); };
    area.appendChild(c);
    setTimeout(() => { if(c.parentNode) c.remove(); }, 800);
}

const emojis = ["🌹", "🌹", "🎁", "🎁", "💖", "💖", "🍫", "🍫", "💍", "💍", "💌", "💌", "✈️", "✈️", "🍷", "🍷"];
let cartasReveladas = [];
let parejasEncontradas = 0;

function iniciarMemoria() {
    mostrarPantalla('pantalla-memoria');
    parejasEncontradas = 0;
    const tablero = document.getElementById('tablero-memoria');
    tablero.innerHTML = '';
    const barajado = [...emojis].sort(() => Math.random() - 0.5);
    barajado.forEach((emoji) => {
        const carta = document.createElement('div');
        carta.className = 'carta';
        carta.dataset.emoji = emoji;
        carta.onclick = () => revelarCarta(carta);
        tablero.appendChild(carta);
    });
}

function revelarCarta(carta) {
    if(cartasReveladas.length < 2 && !carta.classList.contains('revelada')) {
        carta.classList.add('revelada');
        carta.innerText = carta.dataset.emoji;
        cartasReveladas.push(carta);
        if(cartasReveladas.length === 2) setTimeout(chequearPareja, 700);
    }
}

function chequearPareja() {
    const [c1, c2] = cartasReveladas;
    if(c1.dataset.emoji === c2.dataset.emoji) {
        parejasEncontradas++;
        if(parejasEncontradas === 8) { sumarSaldo(150); mostrarMensaje("¡Parejas completas! +150 Lovecoins"); setTimeout(() => mostrarPantalla('pantalla-juegos'), 2000); }
    } else { c1.classList.remove('revelada'); c1.innerText = ''; c2.classList.remove('revelada'); c2.innerText = ''; }
    cartasReveladas = [];
}

// 10. INICIALIZACIÓN AUTOMÁTICA
setInterval(actualizarContador, 1000);
actualizarContador();
actualizarSaldoVisual();
