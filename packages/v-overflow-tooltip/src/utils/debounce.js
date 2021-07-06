export function debounce(delay, fn) {
    let timeoutId = 0;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}
