export default {
    props: ['texto'],
    template: `
        <div class="w-60 h-32 md:w-1/4 md:h-40 flex items-center justify-center bg-emerald-700 text-xl md:text-3xl font-bold text-white text-center cursor-pointer rounded-xl shadow-xl">
            {{texto}}
        </div>
    `
}