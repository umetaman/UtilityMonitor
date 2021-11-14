<template>
    <li class="network-interface">
        <p class="interface-name">{{ name }}</p>
        <div class="details">
            <template v-for="detail in details" :key="detail.address">
                <ul class="detail">
                    <li class="address">Address: {{ detail.address }}</li>
                    <li class="netmask">Netmask: {{ detail.netmask }}</li>
                </ul>
            </template>
        </div>
    </li>
</template>

<script>
export default {
    props: {
        name: {
            type: String,
            require: true,
            default: '',
        },
        details: {
            type: Array,
            require: false,
            default: '',
        },
    },
}
</script>

<style lang="scss" scoped>
p.interface-name {
    margin-bottom: 0.5rem;
}

ul.detail {
    list-style: none;
}
</style>
