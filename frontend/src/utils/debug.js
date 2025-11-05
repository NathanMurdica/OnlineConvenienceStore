const DEBUGMODE = true;

export function debug(...data) {
    if (DEBUGMODE) {
        console.log(data);
    } else {
        return;
    }
}