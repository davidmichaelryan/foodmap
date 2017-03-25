var asyncScripts = {}

function confirmArrival(asset) {
    if (asset != null) {
        asyncScripts[asset] = true
    }
    return asyncScripts;
}
