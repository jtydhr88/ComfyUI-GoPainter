import { createApp, type App as VueApp } from 'vue'
import { createPinia } from 'pinia'
import { app } from "../../../scripts/app.js"
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import Root from "@/Root.vue"
import { i18n } from "@/i18n"
import './style.css'

const { ComfyButton } = window.comfyAPI.button

let vueApp: VueApp | null = null
let mountContainer: HTMLElement | null = null
let rootInstance: InstanceType<typeof Root> | null = null

function ensureGoPainterInstance(): InstanceType<typeof Root> {
    if (mountContainer && rootInstance) {
        return rootInstance
    }

    mountContainer = document.createElement('div')
    mountContainer.id = 'gopainter-root'
    document.body.appendChild(mountContainer)

    vueApp = createApp(Root)
    vueApp.use(createPinia())
    vueApp.use(i18n)
    vueApp.use(PrimeVue, {
        theme: {
            preset: Aura,
            options: {
                cssLayer: {
                    name: 'gopainter',
                    order: 'gopainter'
                }
            }
        }
    })
    rootInstance = vueApp.mount(mountContainer) as InstanceType<typeof Root>

    return rootInstance
}

function openGoPainter() {
    const instance = ensureGoPainterInstance()
    instance.open()
}

app.registerExtension({
    name: 'ComfyUI.GoPainter.TopMenu',
    setup() {
        console.log('[ComfyUI.GoPainter.TopMenu]');

        app.menu?.settingsGroup.append(
            new ComfyButton({
                icon: 'folder-search',
                tooltip: 'comfyui-gopainter',
                content: 'GoPainter',
                action: openGoPainter,
            }),
        )
    },
})