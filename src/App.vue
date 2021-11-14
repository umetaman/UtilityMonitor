<template>
    <div class="app-container">
        <section class="os-info-section os-info-hostname">
            <h1 class="os-host-name">{{ hostName }}</h1>
        </section>
        <section class="os-info-section os-info-basic">
            <h1 class="section-title">OS</h1>
            <ul class="section-content">
                <li>Arch: {{ arch }}</li>
                <li>CPU: {{ cpu }}</li>
                <li>Memory: {{ memory }}</li>
            </ul>
        </section>
        <section class="os-info-section os-info-network">
            <h1 class="section-title">Network</h1>
            <ul class="section-content network-interfaces-list">
                <template v-for="i in networkInterfaces" :key="i.name">
                    <network-interface
                        :name="i.name"
                        :details="i.details"
                    ></network-interface>
                </template>
            </ul>
        </section>
    </div>
</template>

<script>
import NetworkInterface from './components/NetworkInterface.vue'
export default {
    components: { NetworkInterface },
    data: () => {
        return {
            hostName: '',
            arch: '',
            cpu: '',
            memory: '',
            networkInterfaces: [],
        }
    },

    mounted() {
        this.addEvents()
        this.requestUpdate()
    },

    methods: {
        addEvents() {
            window.api.on('networkInterfaces', (event, data) =>
                this.onReceivedNetworkInterfaces(data)
            )
            window.api.on('osInfo', (event, data) =>
                this.onReceivedOsInfo(data)
            )
            window.api.on('hostName', (event, data) => {
                this.hostName = data
            })
            window.api.on('update', () => {
                this.requestUpdate()
            })
        },

        requestUpdate() {
            window.api.request('requestNetworkInterfaces')
            window.api.request('requestOsInfo')
            window.api.request('requestHostName')
        },

        onReceivedOsInfo(data) {
            this.arch = data.arch
            this.cpu = data.cpu
            this.memory = data.memory
        },

        onReceivedNetworkInterfaces(interfaces) {
            this.networkInterfaces = []

            for (const device in interfaces) {
                let filteredDetails = interfaces[device].filter(
                    (e) => e.family === 'IPv4'
                )

                if (filteredDetails.length < 1) {
                    continue
                }

                this.networkInterfaces.push({
                    name: device,
                    details: filteredDetails,
                })
            }
        },
    },
}
</script>

<style lang="scss">
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;

    user-select: none;
}

html,
body {
    font-size: 12px;
    pointer-events: none;
}

ul,
ol {
    list-style: none;
}
</style>

<style lang="scss" scoped>
div.app-container {
    color: #00dd00;
    background-color: rgba(#000000, 0.4);
    border-radius: 1rem;

    position: absolute;
    bottom: 1rem;
    right: 1rem;
}

section.os-info-section {
    width: fit-content;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    justify-content: end;
    align-items: flex-end;

    h1,
    h2,
    h3,
    h4,
    h5 {
        font-size: 1.25rem;
        &.section-title {
            width: 100%;
            margin-bottom: 1rem;
        }
    }

    .section-content {
        width: 100%;
    }

    // Network
    ul.network-interfaces-list {
        li.network-interface {
            margin-bottom: 0.5rem;
        }
    }
}
</style>
