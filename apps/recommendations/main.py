import pika, sys, os
from .recognition.utils.eval import single_test
def main():
    credentials = pika.PlainCredentials('user', 'password')
    connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost', port=5672,credentials=credentials))
    channel = connection.channel()

    channel.queue_declare(queue='cnn-queue', durable=True, arguments={'x-queue-type': 'quorum'})

    def callback(ch, method, properties, body):        

        print(f" [x] Received {body}")

        for item in body:
            print(single_test(item.path))
            

    channel.basic_consume(queue='hello', on_message_callback=callback, auto_ack=True)

    print(' [*] Waiting for messages. To exit press CTRL+C')
    channel.start_consuming()


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print('Interrupted')
        try:
            sys.exit(0)
        except SystemExit:
            os._exit(0)