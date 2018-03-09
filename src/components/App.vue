<template>

    <div class="container mx-auto py-8 px-4">

        <h1 class="text-center text-4xl md:text-2xl">
            DC Motor Sandbox
        </h1>

        <div class="flex justify-center flex-col max-w-xl m-auto">

            <p class="text-right pt-6">
                <label>Input electrical power:</label>
                <span class="inline-block m-w-8 md:m-w-16">{{ rounded(inputPower, 2) }}</span>
                <span class="inline-block m-w-6 md:m-w-8">watts</span>
            </p>

            <MotorParameter
                v-model="voltage"
                :locked="locked === 'voltage'"
                :min="1"
                :max="100"
                class="pt-6"
                label="Voltage"
                units="V"
                @lock="locked = 'voltage'"
                @unlock="locked = 'current'"
            />

            <MotorParameter
                v-model="current"
                :locked="locked === 'current'"
                :min="1"
                :max="1000"
                class="pt-6"
                label="Current"
                units="mA"
                @lock="locked = 'current'"
                @unlock="locked = 'resistance'"
            />

            <MotorParameter
                v-model="resistance"
                :locked="locked === 'resistance'"
                :min="1"
                :max="1000"
                class="pt-6"
                label="Resistance"
                units="Ω"
                @lock="locked = 'resistance'"
                @unlock="locked = 'voltage'"
            />

            <MotorParameter
                v-model="efficiency"
                :min="1"
                :max="100"
                class="pt-6"
                label="Efficiency"
                units="%"
            />

            <p class="text-right pt-6">
                <label>Output mechanical power:</label>
                <span class="inline-block m-w-8 md:m-w-16">{{ rounded(outputPower) }}</span>
                <span class="inline-block m-w-6 md:m-w-8">watts</span>
            </p>

            <MotorParameter
                v-model="rotationalSpeed"
                :min="9"
                :max="20000"
                class="pt-6"
                label="Rotational Speed"
                units="RPM"
            />

            <MotorParameter
                v-model="angularSpeed"
                :min="1"
                :max="2095"
                class="pt-6"
                label="Angular Speed"
                units="rad/s"
            />

            <p class="text-right pt-6">
                <label>Torque:</label>
                <span class="inline-block m-w-8 md:m-w-16">{{ rounded(torque) }}</span>
                <span class="inline-block m-w-6 md:m-w-8">N•m</span>
            </p>

            <p class="text-right">
                <span class="inline-block m-w-8 md:m-w-16">{{ rounded(torque * 10.197162129779) }}</span>
                <span class="inline-block m-w-6 md:m-w-8">Kg•cm</span>
            </p>

            <p class="text-right pt-6">
                <label>Wheels count:</label>
                <select
                    v-model="wheelsCount"
                    class="w-14 md:w-24"
                >
                    <option
                        v-for="count in 10"
                        :key="count"
                        :value="count"
                    >
                        {{ count }}
                    </option>
                </select>
            </p>

            <MotorParameter
                v-model="wheelsRadius"
                :min="1"
                :max="1000"
                class="pt-6"
                label="Wheels radius"
                units="mm"
            />

            <p class="text-right pt-6">
                <label>Speed / Acceleration:</label>
                <span class="inline-block m-w-8 md:m-w-16">{{ rounded(speed) }}</span>
                <span class="inline-block m-w-6 md:m-w-8">m/s</span>
            </p>

            <p class="text-right pt-2">
                <label>Force (per wheel):</label>
                <span class="inline-block m-w-8 md:m-w-16">{{ rounded(force) }}</span>
                <span class="inline-block m-w-6 md:m-w-8">N</span>
            </p>

            <p class="text-right pt-2">
                <label>Mass (total):</label>
                <span class="inline-block m-w-8 md:m-w-16">{{ rounded(mass) }}</span>
                <span class="inline-block m-w-6 md:m-w-8">Kg</span>
            </p>

        </div>

    </div>

</template>

<script>
import MotorParameter from './MotorParameter.vue';

const INITIAL = {
    voltage: 6,
    current: 100,
    efficiency: 80,
    rotationalSpeed: 8500,
    wheelsCount: 2,
    wheelsRadius: 100,
};

const TWO_PI = 2 * Math.PI;
const SPEED_CONVERSION = TWO_PI / 60;

export default {
    components: {
        MotorParameter,
    },

    data() {
        return {
            locked: 'voltage',
            voltage: INITIAL.voltage, // Volts
            current: INITIAL.current, // Micro Amperes
            resistance: INITIAL.voltage / (INITIAL.current / 1000), // Ohms
            efficiency: INITIAL.efficiency, // Percentage
            rotationalSpeed: INITIAL.rotationalSpeed, // Revolutions per minute
            angularSpeed: INITIAL.rotationalSpeed * SPEED_CONVERSION, // Radians per second
            wheelsCount: INITIAL.wheelsCount,
            wheelsRadius: INITIAL.wheelsRadius, // Milimeters
        };
    },

    computed: {
        inputPower() {
            return this.voltage * this.current; // Watts
        },
        outputPower() {
            return this.inputPower * (this.efficiency / 100); // Watts
        },
        torque() {
            return this.outputPower / this.angularSpeed; // Newton-meters
        },
        force() {
            return this.torque / (this.wheelsRadius / 1000); // Newtons
        },
        speed() {
            return (this.rotationalSpeed / 60) * TWO_PI * (this.wheelsRadius / 1000); // Meters per seconds squared
        },
        mass() {
            const totalForce = this.force * this.wheelsCount;
            const acceleration = this.speed;

            // Newton's second Law
            return totalForce / acceleration; // Kilograms
        },
    },

    watch: {
        voltage() {
            this.ohmsLaw('voltage');
        },
        current() {
            this.ohmsLaw('current');
        },
        resistance() {
            this.ohmsLaw('resistance');
        },
        rotationalSpeed() {
            this.convert('rotationalSpeed');
            this.updateOutput();
        },
        angularSpeed() {
            this.convert('angularSpeed');
            this.updateOutput();
        },
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

        convert(propertyUpdated) {
            switch (propertyUpdated) {
                case 'rotationalSpeed':
                    this.angularSpeed = this.rotationalSpeed * SPEED_CONVERSION;
                    break;
                case 'angularSpeed':
                    this.rotationalSpeed = this.angularSpeed / SPEED_CONVERSION;
                    break;
            }
        },

        rounded(number, places = 2) {
            const displacement = 10 ** places || 1;
            return Math.round(number * displacement) / displacement;
        },
    },
};
</script>
