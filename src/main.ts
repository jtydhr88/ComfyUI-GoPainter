import {app} from "../../../scripts/app.js";
import App from "@/App.vue";

const {ComfyButton} = window.comfyAPI.button


app.registerExtension({
    name: 'ComfyUI.GoPainter.TopMenu',
    setup() {
        console.log('[ComfyUI.GoPainter.TopMenu]');

        function openGoPainter() {
            app.extensionManager?.dialog.showExtensionDialog({
                key: "global-gopainter",
                title: "comfyui-gopainter",
                component: App,
                dialogComponentProps: {
                    style: "width: 80vw; height: 80vh;",
                    maximizable: !0
                }
            });
        }

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