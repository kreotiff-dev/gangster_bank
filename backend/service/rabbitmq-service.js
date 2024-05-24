const amqp = require('amqplib');
const logger = require('../utils/logger');

class RabbitMQService {
    constructor() {
        this.connectToRabbitMQ();
    }

    async connectToRabbitMQ() {
        try {
            const connection = await amqp.connect('amqp://37.46.129.245:5672');
            const channel = await connection.createChannel();
            logger.info('Connected to RabbitMQ');

            channel.consume('code_response', (msg) => {
                logger.info(`Received message: ${msg.content.toString()}`);
            }, { noAck: true });
        } catch (error) {
            logger.error(`Error connecting to RabbitMQ: ${error.message}`);
        }
    }

    // Методы для отправки сообщений через RabbitMQ
}

module.exports = new RabbitMQService();
