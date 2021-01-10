class MemoJS {
    constructor() {
        this.totalTarjetas = []
        this.numeroTarjetas = 0
        this.verificarTarjetas = []
        this.tarjetasCorrectas = []
        this.agregarTarjetas = []
        this.numeroIntentos = 0

        this.$cardsContainer = document.querySelector('#cards-container')
        this.$contenedorGeneral = document.querySelector('.container')
        this.$boton = document.querySelector('.boton')

        this.events()
    }

    events() {
        document.addEventListener('DOMContentLoaded', () => {
            this.cargarPantalla()
            this.$boton.addEventListener('click', e => {
                window.location.reload()
            })
            window.addEventListener('contextmenu', e => {
                e.preventDefault()

            }, false)
        })
    }

    async cargarPantalla() {
        const respuesta = await fetch('../cards.json')
        const resultado = await respuesta.json()
        this.totalTarjetas = resultado
        if (this.totalTarjetas.length > 0) {
            this.totalTarjetas.sort(aleatorio)
            function aleatorio(a, b) {
                return Math.random() - 0.5;
            }
        }

        this.numeroTarjetas = this.totalTarjetas.length;

        let html = '';

        this.totalTarjetas.forEach(tarjeta => {
            html += `
                <div class="card">
                    <img src="${tarjeta.src}" alt="card">
                </div>
            `
        });

        this.$cardsContainer.innerHTML = html;
        this.iniciaJuego()
    }

    iniciaJuego() {
        const tarjetas = document.querySelectorAll('.card')
        tarjetas.forEach(tarjeta => {
            tarjeta.addEventListener('click', e => {
                if (!e.target.classList.contains('correcto')) {
                    this.clickTarjeta(e)
                }
            })
        })
    }

    clickTarjeta(e) {
        this.voltearTarjeta(e)
        let srcImage = e.target.childNodes[1].attributes[0].value
        let tarjeta = e.target

        this.verificarTarjetas.push(srcImage)
        this.agregarTarjetas.unshift(tarjeta)

        this.compararTarjeta()
    }

    voltearTarjeta(e) {
        e.target.style.backgroundImage = "none"
        e.target.childNodes[1].style.display = "block"
    }

    agregarTarjetas(tarjetas) {
        console.log(tarjetas);
    }

    fijarTarjeta(tarjetas) {
        tarjetas.forEach(tarjeta => {
            tarjeta.children[0].classList.add('correcto')
            tarjeta.classList.add('acertada')
            this.tarjetasCorrectas.push(tarjeta)
            this.victoria()
        })
    }

    regresarTarjeta(tarjetas) {
        tarjetas.forEach(tarjeta => {

            setTimeout(() => {
                tarjeta.style.backgroundImage = "url(../img/default.png)"
                tarjeta.childNodes[1].style.display = "none"
            }, 1000);
        });
    }

    compararTarjeta() {
        if (this.verificarTarjetas.length == 2) {
            if (this.verificarTarjetas[0] === this.verificarTarjetas[1]) {
                this.fijarTarjeta(this.agregarTarjetas)
            } else {
                this.regresarTarjeta(this.agregarTarjetas)
                this.numeroIntentos++
            }
            this.verificarTarjetas.splice(0)
            this.agregarTarjetas.splice(0)
        }
    }

    victoria() {

        if (this.tarjetasCorrectas.length === this.numeroTarjetas) {
            const mensaje = document.createElement('div')
            mensaje.classList.add('mensaje')
            mensaje.textContent = '¡Has Ganado el Juego!'

            const span = document.createElement('span')
            span.innerHTML = `
                <br><span>en ${this.numeroIntentos} intentos.
            `

            mensaje.appendChild(span)

            setTimeout(() => {
                this.$contenedorGeneral.appendChild(mensaje)
            }, 300);
        }
    }
}

new MemoJS()