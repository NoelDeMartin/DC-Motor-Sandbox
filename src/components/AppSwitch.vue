<template>
    <label
        class="switch no-highlight"
        @click="$emit('input', !value)"
    >
        <input
            :checked="value"
            type="checkbox"
            @input="e => $emit('input', e.target.checked)"
        >
        <span class="slider" />
    </label>
</template>

<script>
export default {
    props: {
        value: {
            type: Boolean,
            required: true,
        },
    },
};
</script>

<style lang="scss">

    $switch-height: config('height.6');
    $switch-padding: config('padding.05');
    $switch-active-color: config('colors.grey');
    $switch-unactive-color: config('colors.grey-light');
    $switch-active-slider-color: config('colors.grey-darker');
    $switch-unactive-slider-color: config('colors.grey-dark');

    .switch {
        position: relative;
        display: inline-block;
        width: calc(#{$switch-height} * 2 - #{$switch-padding} * 2);
        height: $switch-height;

        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: $switch-unactive-color;
            border-radius: $switch-height;
            transition: .4s;

            &:before {
                content: "";
                position: absolute;
                height: calc(#{$switch-height} - #{$switch-padding} * 2);
                width: calc(#{$switch-height} - #{$switch-padding} * 2);
                left: $switch-padding;
                bottom: $switch-padding;
                border-radius: 50%;
                background-color: $switch-unactive-slider-color;
                transition: .4s;
            }

        }

        input {
            display: none;

            &:checked + .slider {
                background-color: $switch-active-color;

                &:before {
                    transform: translateX(calc(#{$switch-height} - #{$switch-padding} * 2));
                    background-color: $switch-active-slider-color;
                }

            }

        }

    }

</style>
