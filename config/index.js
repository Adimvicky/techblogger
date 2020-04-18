module.exports = {
    api: {
        port: process.env.PORT || 3000
    },
    db: {
        url: process.env.MONGODB_URI || 'mongodb://localhost/techblogger'
    },
    JWT_SECRET : process.env.JWT_SECRET || 'yenyenyen'
}