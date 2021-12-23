const redis = require("redis");
let redisClient = redis.createClient({
    host: process.env.REDIS_HOSTNAME,
    port: parseInt(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD
});

redisClient.on('error', function(err) {
    console.log('*Redis Client Error: ' + err.message);
});
redisClient.on('connect', function(){
   console.log('Connected to redis instance');
});

(async () => {
    await redisClient.connect()
        .catch(err => {console.log('Redis connect error: ' + err.message)});
    await redisClient.auth(process.env.REDIS_PASSWORD)
        .catch(err => {console.log('Redis auth error: ' + err.message)});
})();

module.exports = redisClient;