export default {
    props: ['nome'],
    data() {
        return {
            ativo: false
        }
    },
    methods: {
        alternar() {
            this.ativo = !this.ativo
        }
    },
    template: `
        <div @click="alternar" :class="ativo ? 'bg-emerald-600 text-zinc-50' : 'bg-slate-200 text-gray-700'" class="px-4 flex items-center w-1/3 h-20 bg-gray-50 border border-zinc-50 cursor-pointer rounded shadow font-medium text-xl uppercase transition duration-300">
            {{ nome }}
        </div>
    `
}