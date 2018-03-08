<template>
    <div class="flex justify-center pt-6">
        {{ name }}
        <input
            :value="value"
            type="range"
            @input="e => $emit('input', e.target.value)"
        >
        {{ value }}
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
    },
};
</script>
