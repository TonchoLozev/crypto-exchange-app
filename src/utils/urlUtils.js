export function matchUrl(pathname) {
    const cryptoPairRegex = /([A-Za-z0-9]+)(\W|\D|\S)([A-Za-z0-9]+)/g;
    const [cryptoPair] = pathname.match(cryptoPairRegex);
    const [firstValue, secondValue] = cryptoPair.split(/\W/);

    return {
        firstValue,
        secondValue,
    };
}
