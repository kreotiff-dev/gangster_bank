const amqp = require('amqplib');
const logger = require('../utils/logger');
const config = require('../config/config') 

class RabbitMQService {
    constructor() {
        this.connectToRabbitMQ();
    }

    async connectToRabbitMQ() {
        try {
            const connection = await amqp.connect(config.RABBITMQ_HOST);
            const channel = await connection.createChannel();
            logger.info('Connected to RabbitMQ');

            channel.consume('code_response', (msg) => {
                logger.info(`Received message: ${msg.content.toString()}`);
            }, { noAck: true });
        } catch (error) {
            logger.error(`Error connecting to RabbitMQ: ${error.message}`);
        }
    }

}

module.exports = new RabbitMQService();
