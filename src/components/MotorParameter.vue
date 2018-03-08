<template>
    <div class="flex justify-center items-center pt-6">

        <span class="w-32 mr-2">{{ name }}</span>

        <svg
            class="w-4 h-4 cursor-pointer mr-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            @click="$emit(locked ? 'unlock' : 'lock')"
        >
            <path
                v-if="locked"
                class="opacity-25"
                d="M4
                    8V6a6 6 0 1 1 12 0v2h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2
                    2H3a2 2 0 0 1-2-2v-8c0-1.1.9-2 2-2h1zm5
                    6.73V17h2v-2.27a2 2 0 1 0-2 0zM7
                    6v2h6V6a3 3 0 0 0-6 0z
                "
            />
            <path
                v-else
                d="M4
                    8V6a6 6 0 1 1 12 0h-3v2h4a2 2 0 0 1 2 2v8a2 2 0 0 1-2
                    2H3a2 2 0 0 1-2-2v-8c0-1.1.9-2 2-2h1zm5
                    6.73V17h2v-2.27a2 2 0 1 0-2 0zM7
                    6v2h6V6a3 3 0 0 0-6 0z
                "
            />
        </svg>

        <input
            :class="{'opacity-25': locked}"
            :disabled="locked"
            :value="value || 0"
            :min="min"
            :max="max"
            class="mr-2"
            type="range"
            @input="e => $emit('input', parseInt(e.target.value))"
        >

        <input
            :disabled="locked"
            :value="value ? Math.round(value * 100) / 100 : 0"
            class="w-16 text-right mr-2"
            type="float"
            @input="e => $emit('input', e.target.value? parseFloat(e.target.value) : 0)"
        >
        <span class="w-8">{{ units }}</span>

    </div>
</template>

<script>
export default {
    props: {
        name: {
            type: String,
            required: true,
        },

        value: {
            type: Number,
            required: true,
        },

        min: {
            type: Number,
            required: true,
        },

        max: {
            type: Number,
            required: true,
        },

        units: {
            type: String,
            required: true,
        },

        locked: {
            type: Boolean,
            required: true,
        },
    },
};
</script>
