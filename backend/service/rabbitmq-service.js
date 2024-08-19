const amqp = require('amqplib');
const logger = require('../utils/logger');
const config = require('../config/config');

class RabbitMQService {
    constructor() {
        this.connectToRabbitMQ();
    }

    async connectToRabbitMQ() {
        try {
            const amqpUrl = `amqp://${config.RABBITMQ_USER}:${config.RABBITMQ_PASSWORD}@${config.RABBITMQ_HOST}:${config.RABBITMQ_PORT}/gbank`;
            const connection = await amqp.connect(amqpUrl);
            const channel = await connection.createChannel();
            logger.info('Connected to RabbitMQ');

            await channel.assertQueue('verification_code_responses');
            channel.consume('verification_code_responses', (msg) => {
                if (msg !== null) {
                    logger.info(`Received message: ${msg.content.toString()}`);
                    channel.ack(msg);
                }
            }, { noAck: false });
        } catch (error) {
            logger.error(`Error connecting to RabbitMQ: ${error.message}`);
        }
    }
}

module.exports = new RabbitMQService();
