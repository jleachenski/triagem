import aviso from '../componentes/aviso.js'

export default {
    components: {
        aviso
    },
    mounted() {
        setTimeout(() => {
            this.$emit('resetar')
            this.$emit('avancar', 0)
        }, 8000);
    },
    template: `
        <div class="z-10 w-full h-full flex items-center justify-center">
            <aviso titulo="TRIAGEM CONCLUÍDA, AGUARDE SER CHAMADO PELO MÉDICO!" />
        </div>
    `
}