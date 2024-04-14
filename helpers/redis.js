const redis = require("redis")

const client = redis.createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    },
})

if(!client.isOpen){
    client.connect()
}

client.on('connect', () => {
    console.log("Client connected to redis.")
})

client.on('ready', () => {
    console.log("Client connected to redis and ready to use.")
})

client.on('error', (err) => {
    console.log(err)
})

client.on('end', () => {
    console.log("Client disconnected from redis")
})

process.on('SIGINT', () => {
    client.quit()
})

module.exports = client