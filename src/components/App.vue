<template>

    <div class="container mx-auto py-8 px-4">

        <h1 class="text-center text-4xl md:text-2xl">
            DC Motor Sandbox
        </h1>

        <div class="flex justify-center flex-col max-w-xl m-auto">
            <MotorParameter
                v-model="voltage"
                :locked="locked === 'voltage'"
                :min="1"
                :max="100"
                name="Voltage"
                units="V"
                @lock="locked = 'voltage'"
                @unlock="locked = 'current'"
            />
            <MotorParameter
                v-model="current"
                :locked="locked === 'current'"
                :min="1"
                :max="1000"
                name="Current"
                units="mA"
                @lock="locked = 'current'"
                @unlock="locked = 'resistance'"
            />
            <MotorParameter
                v-model="resistance"
                :locked="locked === 'resistance'"
                :min="1"
                :max="1000"
                name="Resistance"
                units="Ω"
                @lock="locked = 'resistance'"
                @unlock="locked = 'voltage'"
            />
        </div>

    </div>

</template>

<script>
import MotorParameter from './MotorParameter.vue';

export default {
    components: {
        MotorParameter,
    },

    data() {
        return {
            locked: 'voltage',
            voltage: 6,
            current: 220,
            resistance: 27.27,
        };
    },

    watch: {
        voltage() { this.ohmsLaw('voltage'); },
        current() { this.ohmsLaw('current'); },
        resistance() { this.ohmsLaw('resistance'); },
    },

    methods: {
        ohmsLaw(propertyUpdated) {
            let propertyAffected;
            switch (propertyUpdated) {
                case 'voltage':
                    propertyAffected = this.locked === 'resistance' ? 'current' : 'resistance';
                    break;
                case 'current':
                    propertyAffected = this.locked === 'voltage' ? 'resistance' : 'voltage';
                    break;
                case 'resistance':
                    propertyAffected = this.locked === 'current' ? 'voltage' : 'current';
                    break;
            }
            switch (propertyAffected) {
                case 'voltage':
                    this.voltage = (this.current / 1000) * this.resistance;
                    break;
                case 'current':
                    this.current = (this.voltage / this.resistance) * 1000;
                    break;
                case 'resistance':
                    this.resistance = this.voltage / (this.current / 1000);
                    break;
            }
        },
    },
};
</script>
