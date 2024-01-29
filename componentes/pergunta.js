export default {
    props: ['titulo'],
    template: `
        <div class="text-4xl md:text-5xl text-center w-3/4 font-black text-emerald-900">
            {{ titulo }}
        </div>
    `
}