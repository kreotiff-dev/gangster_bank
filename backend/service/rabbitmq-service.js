const amqp = require('amqplib');
const logger = require('../utils/logger');
const config = require('../config/config');
const { CardRequest } = require('../models');

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

            // Объявляем очередь для верификации кодов
            await channel.assertQueue('verification_code_responses');
            channel.consume('verification_code_responses', (msg) => {
                if (msg !== null) {
                    logger.info(`Received verification message: ${msg.content.toString()}`);
                    channel.ack(msg);
                }
            }, { noAck: false });

            // Объявляем очередь для статусов заявок
            await channel.assertQueue('card_application_statuses');
            channel.consume('card_application_statuses', async (msg) => {
                if (msg !== null) {
                    const messageContent = JSON.parse(msg.content.toString());
                    logger.info(`Received status message: ${JSON.stringify(messageContent)}`);

                    // Обновляем статус заявки по cardRequestId
                    await this.updateCardRequestStatus(messageContent.cardRequestId, messageContent.status);

                    channel.ack(msg);
                }
            }, { noAck: false });
        } catch (error) {
            logger.error(`Error connecting to RabbitMQ: ${error.message}`);
        }
    }

    async updateCardRequestStatus(cardRequestId, status) {
        try {
            const [updatedRows] = await CardRequest.update({ status }, { where: { id: cardRequestId } });
            if (updatedRows > 0) {
                logger.info(`Updated CardRequest status for cardRequestId ${cardRequestId} to ${status}`);
            } else {
                logger.warn(`No CardRequest found for cardRequestId ${cardRequestId} to update`);
            }
        } catch (err) {
            logger.error(`Error updating CardRequest for cardRequestId ${cardRequestId}: ${err.message}`);
        }
    }
}

module.exports = new RabbitMQService();
