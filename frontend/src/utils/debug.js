const DEBUGMODE = true;

export function debug(...data) {
    if (DEBUGMODE) {
        console.debug(...data);
    } else {
        return;
    }
}