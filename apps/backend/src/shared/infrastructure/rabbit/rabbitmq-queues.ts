import { Connection } from 'rabbitmq-client';
import type { Publisher, Consumer } from 'rabbitmq-client';

export class RabbitMQService {
  private static instance: RabbitMQService | null = null;
  private connection: Connection;

  private constructor(url: string) {
    this.connection = new Connection(url);

    this.connection.on('error', (err) => {
      console.error('RabbitMQ connection error:', err);
    });

    this.connection.on('connection', () => {
      console.log('RabbitMQ connected successfully');
    });
  }

  public static getInstance(url?: string): RabbitMQService {
    if (!RabbitMQService.instance) {
      if (!url) {
        throw new Error(
          'RabbitMQService instance does not exist. You must provide a URL to initialize it.'
        );
      }
      RabbitMQService.instance = new RabbitMQService(url);
    }
    return RabbitMQService.instance;
  }

  /**
   * Create a publisher for a specific exchange
   */
  public createPublisher(exchange: string): Publisher {
    return this.connection.createPublisher({
      confirm: true,
      maxAttempts: 5,
      exchanges: [{ exchange, type: 'topic' }],
    });
  }

  /**
   * Create a consumer for a specific queue
   */
  public createConsumer(
    queueName: string,
    handler: (msg: any) => Promise<void>
  ): Consumer {
    return this.connection.createConsumer(
      {
        queue: queueName,
        queueOptions: { autoDelete: false, durable: true },
      },
      async (payload) => {
        await handler(payload);
      }
    );
  }

  /**
   * Graceful shutdown
   */
  public async close(): Promise<void> {
    await this.connection.close();
  }
}
