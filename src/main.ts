import { getVersion } from "@tauri-apps/api/app";
import { appWindow } from "@tauri-apps/api/window";

import { checkUpdate, installUpdate, onUpdaterEvent } from "@tauri-apps/api/updater";
import { relaunch } from "@tauri-apps/api/process";

window.addEventListener("DOMContentLoaded", async () => {
    const version_span = document.getElementById("version-span");
    setTimeout(async () => {
        version_span!.innerHTML = await getVersion();
    }, 150);

    document.getElementById("kill-app-button")!.addEventListener("click", () => appWindow.close());

    //--

    await onUpdaterEvent(({ error, status }) => {
        console.log("Updater event", error, status);
    });

    try {
        const { shouldUpdate, manifest } = await checkUpdate();

        if (shouldUpdate) {
            console.log(`Installing update ${manifest?.version}, ${manifest?.date}, ${manifest?.body}`);
            showAlert(async () => {
                await installUpdate();
                await relaunch();
            });
        }
    } catch (error) {
        console.error(error);
    }
});

function showAlert(callback: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null) {
    var modal = document.getElementById("updateAlert");
    modal!.style.display = "block";

    var updateBtn = document.getElementById("updateBtn");
    updateBtn!.onclick = callback;
}
