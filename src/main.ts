import { getVersion } from "@tauri-apps/api/app";
import { relaunch } from "@tauri-apps/api/process";
import { checkUpdate, installUpdate, onUpdaterEvent } from "@tauri-apps/api/updater";

window.addEventListener("DOMContentLoaded", async () => {
    const version_span = document.getElementById("version-span");
    setTimeout(async () => {
        version_span!.innerHTML = await getVersion();
    }, 150);

    //--

    await onUpdaterEvent(({ error, status }) => {
        console.log("Updater event", error, status);
    });

    try {
        const { shouldUpdate, manifest } = await checkUpdate();

        if (shouldUpdate) {
            console.log(`Installing update ${manifest?.version}, ${manifest?.date}, ${manifest?.body}`);
            showUpdateAlertModal(async () => {
                await installUpdate();
                await relaunch();
            });
        }
    } catch (error) {
        console.error(error);
        showUpdateErrorAlertModal(error);
    }
});

let displayedModal: "update" | "error" | "none" = "none";

function showUpdateAlertModal(callback: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null) {
    if (displayedModal === "error") { hideUpdateErrorAlertModal(); }
    if (displayedModal === "update") return;

    var modal = document.getElementById("updateAlert");
    if (!modal) throw Error("Modal not found");
    modal.classList.add("slideIn");
    modal.classList.remove("hidden");

    var updateBtn = document.getElementById("updateBtn");
    if (!updateBtn) throw Error("Update btn not found");
    updateBtn.onclick = callback;

    displayedModal = "update";
}

let hideUpdateAlertTimeout: number | undefined = undefined;
function hideUpdateAlertModal() {
    var modal = document.getElementById("updateAlert");
    modal?.classList.remove("slideIn");
    modal?.classList.add("slideOut");

    clearTimeout(hideUpdateAlertTimeout)
    hideUpdateAlertTimeout = setTimeout(() => {
        modal?.classList.remove("slideOut");
        modal?.classList.add("hidden");
    }, 1000);
}

function showUpdateErrorAlertModal(error: unknown) {
    if (displayedModal === "update") { hideUpdateAlertModal(); }
    if (displayedModal === "error") return;

    var modal = document.getElementById("errorAlert");
    modal?.classList.add("slideIn");
    modal?.classList.remove("hidden");

    var errorSpan = document.getElementById("errorSpan");
    if (errorSpan) errorSpan.innerHTML = error as string;

    displayedModal = "error";
}


let hideUpdateErrorAlertTimeout: number | undefined = undefined;
function hideUpdateErrorAlertModal() {
    var modal = document.getElementById("errorAlert");
    modal?.classList.remove("slideIn");
    modal?.classList.add("slideOut");

    clearTimeout(hideUpdateErrorAlertTimeout)
    hideUpdateErrorAlertTimeout = setTimeout(() => {
        modal?.classList.remove("slideOut");
        modal?.classList.add("hidden");
    }, 1000);
}