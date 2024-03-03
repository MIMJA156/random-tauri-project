import { getVersion } from "@tauri-apps/api/app";
import { appWindow } from "@tauri-apps/api/window";

window.addEventListener("DOMContentLoaded", () => {
    const version_span = document.getElementById("version-span");
    setTimeout(async () => {
        version_span!.innerHTML = await getVersion();
    }, 150);

    document.getElementById("kill-app-button")!.addEventListener("click", () => appWindow.close());
});
