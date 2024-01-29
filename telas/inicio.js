import aviso from '../componentes/aviso.js'

export default {
    components: {
        aviso
    },
    template: `
        <div @click="$emit('avancar', 1)" class="z-10 w-full h-full flex items-center justify-center cursor-pointer">
            <aviso class="animate-bounce" titulo="CLIQUE NA TELA PARA INICIAR A SUA TRIAGEM!" />
        </div>
    `
}