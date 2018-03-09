<template>
    <div class="motor-parameter flex flex-col justify-center items-center pt-6 md:flex-row">

        <label class="text-xl text-center w-full mr-2 mb-2 md:text-base md:text-left md:w-32 md:mb-0">
            {{ name }}
        </label>

        <div class="flex justify-center items-center flex-grow w-full md:w-auto">
            <svg
                class="cursor-pointer w-5 h-5 mr-1 md:mr-2 md:w-6 md:h-6"
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

            <RangeSlider
                :class="{'opacity-25': locked, 'cursor-pointer': !locked}"
                :disabled="locked"
                :value="value || 0"
                :min="min"
                :max="max"
                class="flex-grow mr-1 md:mr-2"
                @input="value => $emit('input', value)"
            />

            <input
                :disabled="locked"
                :value="value ? Math.round(value * 100) / 100 : 0"
                class="w-8 text-right mr-2 md:w-16"
                type="number"
                step="any"
                @input="e => e.target.value === '' || $emit('input', parseFloat(e.target.value))"
                @blur="e => e.target.value = value"
            >
            <span class="w-6 md:w-8">{{ units }}</span>
        </div>
    </div>
</template>

<script>
import RangeSlider from 'vue-range-slider';

export default {
    components: {
        RangeSlider,
    },
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

<style lang="scss">

    $rail-height: config('height.1');
    $knob-size: 1rem; // This should be "config('height.4');", but it is not possible to do sass operations with postcss variables
    $rail-color: config('colors.grey');
    $rail-fill-color: config('colors.black');
    $knob-color: config('colors.black');
    $knob-border: none;
    $knob-shadow: none;

    @import '~vue-range-slider/dist/vue-range-slider.scss';

    .motor-parameter {

        input[type=number] {
            -moz-appearance: textfield;
        }

        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            margin: 0;
        }

        svg {
            -webkit-tap-highlight-color: transparent;
        }

    }

</style>
