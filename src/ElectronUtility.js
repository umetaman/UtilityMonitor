exports.isDevelopmentMode = function isDevelopmentMode() {
    for (let i = 0; i < process.argv.length; i++) {
        if (process.argv[i] === '--dev') {
            return true
        }
    }

    return false
}
