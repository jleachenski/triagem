import cartaoEscolha from '../componentes/cartao_escolha.js'
import pergunta from '../componentes/pergunta.js'

export default {
    components: {
        cartaoEscolha,
        pergunta
    },
    template: `
        <div class="z-10 w-full h-full flex flex-col items-center justify-evenly">
            <pergunta titulo="QUAL O MOTIVO DE SUA VISITA HOJE?" />
            <div class="flex items-center justify-evenly flex-wrap gap-x-10 gap-y-10 w-full">
                <cartao-escolha @click="$emit('avancar', 4)" texto="CONSULTA" />
                <cartao-escolha @click="$emit('attSintomas', 'MOSTRAR RESULTADOS DE EXAMES', '0'); $emit('finalizar'); $emit('avancar', 6);" texto="MOSTRAR RESULTADOS DE EXAMES" />
                <cartao-escolha @click="$emit('avancar', 5)" texto="OUTRO" />
            </div>
        </div>
    `
}