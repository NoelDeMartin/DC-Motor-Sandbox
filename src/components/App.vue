<template>
    <div class="container mx-auto p-8">
        <h1 class="text-center text-2xl">DC Motor Sandbox</h1>

        <div class="flex justify-center flex-col">
            <AppInput
                v-model="voltage"
                name="Voltage (V)"
            />
            <AppInput
                v-model="intensity"
                name="Intensity (I)"
            />
        </div>
    </div>
</template>

<script>
import AppInput from './AppInput.vue';

export default {
    components: {
        AppInput,
    },

    data() {
        return {
            voltage: 0,
            intensity: 0,
        };
    },
};
</script>
