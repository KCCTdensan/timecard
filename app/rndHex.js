module.exports = digits => {
    let r = '123456789abcdef'[Math.floor(Math.random() * 15)]
    for (let i = 1; i < digits; i++) {
        r += '0123456789abcdef'[Math.floor(Math.random() * 16)]
    }
    return r
}
