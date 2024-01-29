import pergunta from '../componentes/pergunta.js'
import pesquisa from '../componentes/pesquisa.js'
import sintoma from '../componentes/sintoma.js'
import botao from '../componentes/botao.js'

export default {
    props: ['sintomasEscolhidos', 'etapaAtual'],
    components: {
        pergunta,
        pesquisa,
        sintoma,
        botao
    },
    data() {
        return {
            sintomas: [],
            busca: '',
            labelPergunta: ''
        }
    },
    mounted() {
        if(this.etapaAtual == 4) {
            this.labelPergunta = "MARQUE OS SINTOMAS QUE VOCÊ POSSUI"
            this.sintomas = [
                { nome: 'Tosse', prioridade: 5 },
                { nome: 'Sintomas gripais', prioridade: 5 },
                { nome: 'Cefaleia (dor de cabeça)', prioridade: 5 },
                { nome: 'Vômito', prioridade: 5 },
                { nome: 'Diarreia', prioridade: 5 },
                { nome: 'Fraqueza', prioridade: 5 },
                { nome: 'Dor no corpo', prioridade: 5 },
                { nome: 'Dor no estômago ', prioridade: 5 },
                { nome: 'Abcesso', prioridade: 5 },
                { nome: 'Corpo estranho no olho', prioridade: 5 },
                { nome: 'Hemorragia (sangramento)', prioridade: 100 },
                { nome: 'Dificuldade respiratória', prioridade: 100 },
                { nome: 'Perda de função e/ou dormência nos braços e pernas', prioridade: 100 },
                { nome: 'Inconsciência/desmaio', prioridade: 100 },
                { nome: 'Dores intensas no peito, abdômen e cabeça', prioridade: 100 },
                { nome: 'Cortes profundos', prioridade: 100 },
                { nome: 'Picada ou mordida de animais peçonhentos', prioridade: 100 },
                { nome: 'Queimaduras', prioridade: 100 },
                { nome: 'Afogamentos', prioridade: 100 },
                { nome: 'Intoxicação por alimento ou medicamento', prioridade: 100 },
                { nome: 'Sangue no vômito, urina, fezes ou tosse', prioridade: 100 },
                { nome: 'Reação alérgica', prioridade: 100 },
                { nome: 'Febre persistente', prioridade: 100 },
                { nome: 'Agressões físicas', prioridade: 100 },
                { nome: 'Acidentes de carro, moto ou atropelamento', prioridade: 100 },
                { nome: 'Quedas', prioridade: 100 },
                { nome: 'Outros', prioridade: 5 }
            ]
        } else if(this.etapaAtual == 5) {
            this.labelPergunta = "SOLICITE UM SERVIÇO"
            this.sintomas = [
                { nome: 'Curativo', prioridade: 0 },
                { nome: 'Troca ou solicitação de receitas', prioridade: 0 },
                { nome: 'Exames', prioridade: 0 }
            ]
        }
    },
    methods: {
        attBusca(novo) {
            this.busca = novo
        }
    },
    template: `
        <div class="z-10 w-full h-full flex flex-col items-center">
            <pergunta class="mt-10" :titulo="labelPergunta" />
            <div :class="etapaAtual == 4 ? 'justify-center' : 'justify-end'" class="w-2/3 my-14 flex items-center gap-x-10">
                <div v-if="etapaAtual == 4" class="border-b-4 border-emerald-700 py-2 w-3/4">
                    <pesquisa  @attValor="attBusca" aviso="PESQUISE SEU SINTOMA" :valorPai="busca" />
                </div>
                <botao texto="FINALIZAR TRIAGEM" :disabled="sintomasEscolhidos.length > 0 ? false : true" :class="sintomasEscolhidos.length > 0 ? 'bg-blue-600 border-blue-600' : 'bg-gray-300 border-gray-300'" class="py-4 text-lg w-1/4" @click="$emit('finalizar'); $emit('avancar', 6);" />
            </div>
            <div class="flex flex-wrap justify-center w-full px-4 pb-20  gap-y-8 gap-x-8">
                <transition-group name="sintoma">
                    <template v-for="sintoma in sintomas" :key="sintoma.nome">
                        <sintoma v-show="sintoma.nome.toLowerCase().includes(busca.toLowerCase()) || busca == ''" @click="$emit('attSintomas', sintoma.nome, sintoma.prioridade)" :nome="sintoma.nome" />
                    </template>
                </transition-group>
            </div>
        </div>
    ` 
}