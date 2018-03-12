<template>

    <div class="container mx-auto py-8 px-4">

        <h1 class="text-center text-4xl md:text-2xl">
            DC Motor Sandbox
        </h1>

        <div class="flex justify-center flex-col max-w-xl m-auto">

            <h2 class="flex text-center text-xl mt-4">
                <AppSwitch
                    :value="false"
                    class="invisible"
                />
                <span class="flex-grow">Motor</span>
                <AppSwitch v-model="motor" />
            </h2>

            <div
                v-if="motor"
                class="flex flex-col border border-grey bg-grey-lightest p-4 mt-4"
            >

                <MotorParameter
                    v-model="voltage"
                    :locked="locked === 'voltage'"
                    :min="1"
                    :max="100"
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
                    v-model="rotationalSpeed"
                    :min="9"
                    :max="20000"
                    class="pt-6"
                    label="Speed"
                    units="RPM"
                />

                <MotorParameter
                    v-model="motorEfficiency"
                    :min="1"
                    :max="100"
                    class="pt-6"
                    label="Efficiency"
                    units="%"
                />

            </div>

            <table
                cellspacing="0"
                class="border border-grey-light mt-4 self-center"
            >

                <tr>
                    <th class="border-b border-r border-grey-light p-2">
                        Output power
                    </th>
                    <td class="border-b border-grey-light p-2">
                        {{ rounded(outputPower) }} watts
                    </td>
                </tr>

                <tr>
                    <th class="border-b border-r border-grey-light p-2">
                        Speed
                    </th>
                    <td class="border-b border-grey-light p-2">
                        {{ rounded(rotationalSpeed) }} RPM | {{ rounded(angularSpeed) }} rad/s
                    </td>
                </tr>

                <tr>
                    <th class="border-r border-grey-light p-2">
                        Torque
                    </th>
                    <td class="p-2">
                        {{ rounded(torque) }} mN•m | {{ rounded(torque * TORQUE_CONVERSION) }} Kg•cm
                    </td>
                </tr>

            </table>

            <h2 class="flex text-center text-xl mt-4">
                <AppSwitch
                    :value="false"
                    class="invisible"
                />
                <span class="flex-grow">Gearbox</span>
                <AppSwitch v-model="gearbox" />
            </h2>

            <div
                v-if="gearbox"
                class="flex flex-col border border-grey bg-grey-lightest p-4 mt-4"
            >

                <MotorParameter
                    v-model="reduction"
                    :min="1"
                    :max="50"
                    label="Reduction"
                    units="x"
                />

                <MotorParameter
                    v-model="gearboxEfficiency"
                    :min="1"
                    :max="100"
                    class="pt-6"
                    label="Efficiency"
                    units="%"
                />

            </div>

            <table
                cellspacing="0"
                class="border border-grey-light mt-4 self-center"
            >

                <tr>
                    <th class="border-b border-r border-grey-light p-2">
                        Speed
                    </th>
                    <td class="border-b border-grey-light p-2">
                        {{ rounded(reducedRotationalSpeed) }} RPM | {{ rounded(reducedAngularSpeed) }} rad/s
                    </td>
                </tr>

                <tr>
                    <th class="border-r border-grey-light p-2">
                        Torque
                    </th>
                    <td class="p-2">
                        {{ rounded(augmentedTorque) }} mN•m | {{ rounded(augmentedTorque * TORQUE_CONVERSION) }} Kg•cm
                    </td>
                </tr>

            </table>

            <h2 class="flex text-center text-xl mt-4">
                <AppSwitch
                    :value="false"
                    class="invisible"
                />
                <span class="flex-grow">Wheels</span>
                <AppSwitch v-model="wheels" />
            </h2>

            <div
                v-if="wheels"
                class="flex flex-col border border-grey bg-grey-lightest p-4 mt-4"
            >

                <p class="text-right ">
                    <label>Count:</label>
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
                    label="Radius"
                    units="mm"
                />

            </div>

            <table
                cellspacing="0"
                class="border border-grey-light mt-4 self-center"
            >

                <tr>
                    <th class="border-b border-r border-grey-light p-2">
                        Speed
                    </th>
                    <td class="border-b border-grey-light p-2">
                        {{ rounded(wheelsSpeed) }} m/s
                    </td>
                </tr>

                <tr>
                    <th class="border-b border-r border-grey-light p-2">
                        Force
                    </th>
                    <td class="border-b border-grey-light p-2">
                        {{ rounded(wheelsForce) }} N/wheel
                    </td>
                </tr>

                <tr>
                    <th class="border-r border-grey-light p-2">
                        Maximum load
                    </th>
                    <td class="p-2">
                        <template v-if="mass < 1">
                            {{ rounded(mass * 1000) }} g
                        </template>
                        <template v-else>
                            {{ rounded(mass) }} Kg
                        </template>
                    </td>
                </tr>

            </table>

        </div>

    </div>

</template>

<script>
import AppSwitch from './AppSwitch.vue';
import MotorParameter from './MotorParameter.vue';

const INITIAL = {
    voltage: 6,
    current: 100,
    rotationalSpeed: 8500,
    motorEfficiency: 80,
    reduction: 1,
    gearboxEfficiency: 100,
    wheelsCount: 2,
    wheelsRadius: 100,
};

const TWO_PI = 2 * Math.PI;
const SPEED_CONVERSION = TWO_PI / 60;
const TORQUE_CONVERSION = 10.197162129779;

export default {
    components: {
        AppSwitch,
        MotorParameter,
    },

    data() {
        return {
            motor: true,
            locked: 'voltage',
            voltage: INITIAL.voltage, // Volts
            current: INITIAL.current, // Micro Amperes
            resistance: INITIAL.voltage / (INITIAL.current / 1000), // Ohms
            rotationalSpeed: INITIAL.rotationalSpeed, // Revolutions per minute
            motorEfficiency: INITIAL.motorEfficiency, // Percentage
            gearbox: false,
            reduction: INITIAL.reduction,
            gearboxEfficiency: INITIAL.gearboxEfficiency,
            wheels: false,
            wheelsCount: INITIAL.wheelsCount,
            wheelsRadius: INITIAL.wheelsRadius, // Milimeters
        };
    },

    computed: {
        TORQUE_CONVERSION: () => TORQUE_CONVERSION,
        inputPower() {
            return this.voltage * (this.current / 1000); // Watts
        },
        outputPower() {
            return this.inputPower * (this.motorEfficiency / 100); // Watts
        },
        angularSpeed() {
            return this.rotationalSpeed * SPEED_CONVERSION; // Radians per second
        },
        torque() {
            return this.outputPower * 1000 / this.angularSpeed; // micro Newton-meters
        },
        reducedRotationalSpeed() {
            return this.rotationalSpeed / this.reduction; // Revolutions per minute
        },
        reducedAngularSpeed() {
            return this.angularSpeed / this.reduction; // Radians per second
        },
        augmentedTorque() {
            return this.torque * this.reduction * (this.gearboxEfficiency / 100); // micro Newton-meters
        },
        wheelsForce() {
            return (this.augmentedTorque / 1000) / (this.wheelsRadius / 1000); // Newtons
        },
        wheelsSpeed() {
            return (this.rotationalSpeed / (this.reduction * 60)) * TWO_PI * (this.wheelsRadius / 1000); // Meters per seconds squared
        },
        mass() {
            const totalForce = this.wheelsForce * this.wheelsCount; // Newtons
            const wheelsAcceleration = this.wheelsSpeed;

            // Newton's second Law
            return totalForce / wheelsAcceleration; // Kilograms
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

        rounded(number, places = 2) {
            const displacement = 10 ** places || 1;
            return Math.round(number * displacement) / displacement;
        },
    },
};
</script>
