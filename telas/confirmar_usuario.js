import botao from '../componentes/botao.js'
import pergunta from '../componentes/pergunta.js'

export default {
    props: ['usuarioApp', 'senhaApp'],
    components: {
        botao,
        pergunta
    },
    methods: {

    },
    template: `
        <div class="z-10 w-full h-full flex flex-col items-center justify-evenly">
            <pergunta titulo="VOCÊ É ESSE PACIENTE?" />
            <div class="w-2/3 bg-emerald-700 text-white rounded shadow-lg flex flex-row p-10 divide-x divide-solid">
                <div class="w-2/3 text-base font-bold flex flex-col gap-y-10 divide-y divide-solid">
                    <div>
                        NOME: <span class="ml-4 text-2xl font-extrabold"> {{ usuarioApp.NOMEPACIENTE }} </span>
                    </div>
                    <div class="pt-5">
                        NASCIMENTO: <span class="ml-4 text-2xl font-extrabold"> {{ usuarioApp.DATANASC }} </span>
                    </div>
                </div>
                <div class="h-full w-1/3 flex flex-col items-center text-center justify-center text-2xl font-bold">
                    <span> SENHA </span>
                    <span class="text-5xl font-extrabold"> {{ usuarioApp.SENHA }} </span>
                </div>
            </div>
            <div class="flex w-full justify-evenly">
                <botao @click="$emit('avancar', 1)" class="bg-orange-600 border-orange-600 py-8 text-4xl" texto="NÃO" />
                <botao @click="$emit('avancar', 3)" class="bg-emerald-800 border-emerald-800 py-8 text-4xl" texto="SIM" />
            </div>
            <div @dblclick="$emit('emergencia'); $emit('avancar', 6)" class="w-20 h-20 fixed bg-transparent top-0 right-0">
            </div>
        </div>
    `
}