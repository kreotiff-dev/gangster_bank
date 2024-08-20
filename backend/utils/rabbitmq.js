const amqp = require('amqplib');
const config = require('../config/config');

let connection;
let channel;

const connect = async () => {
    try {
        connection = await amqp.connect({
            hostname: config.RABBITMQ_HOST,
            port: config.RABBITMQ_PORT,
            username: config.RABBITMQ_USER,
            password: config.RABBITMQ_PASSWORD,
            vhost: 'gbank'
        });
        channel = await connection.createChannel();
        await channel.assertQueue('card_application_requests');
        await channel.assertQueue('verification_code_requests'); 
        console.log('Connected to RabbitMQ');
    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error);
        throw error;
    }
};

const sendToQueue = async (queueName, data) => {
    if (!channel) {
        throw new Error('Channel is not initialized');
    }
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
};

const closeConnection = async () => {
    if (channel) {
        await channel.close();
    }
    if (connection) {
        await connection.close();
    }
};

module.exports = {
    connect,
    sendToQueue,
    closeConnection
};
