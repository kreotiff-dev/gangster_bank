const amqp = require('amqplib');

class RabbitMQService {
    constructor() {
        this.connectToRabbitMQ();
    }

    async connectToRabbitMQ() {
        const connection = await amqp.connect('37.46.129.245:15672');
        const channel = await connection.createChannel();

        // Обработка сообщений из RabbitMQ
        channel.consume('code_response', (msg) => {
            // Обработка полученного сообщения
            console.log('Received message:', msg.content.toString());
        }, { noAck: true });
    }

    // Методы для отправки сообщений через RabbitMQ
}

module.exports = new RabbitMQService();