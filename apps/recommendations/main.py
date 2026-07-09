import pika, sys, os, json
from recognition.utils.eval import single_test
import os
from dotenv import load_dotenv

load_dotenv()

def main():
    credentials = pika.PlainCredentials('user', 'password')
    connection = pika.BlockingConnection(
        pika.ConnectionParameters(host='localhost', port=5672, credentials=credentials)
    )
    channel = connection.channel()

    # 1. Declare the exchange (ensures it exists if Python starts first)
    channel.exchange_declare(exchange='cnn-exchange', exchange_type='topic')

    # 2. Declare your Quorum queue
    channel.queue_declare(
        queue='cnn-queue', 
        durable=True, 
        arguments={'x-queue-type': 'quorum'}
    )

    # 3. FIX: Bind the queue to the exchange using the routing key sent by TS
    channel.queue_bind(
        exchange='cnn-exchange', 
        queue='cnn-queue', 
        routing_key='cnn-queue'
    )

    def callback(ch, method, properties, body):                
        try:
            # 4. FIX: Decode the raw binary bytes and parse them as JSON
            data = json.loads(body.decode('utf-8'))
            
            # Since TS sent: { message: images }, extract the 'message' property
            images = data.get('message', [])
            
            # 5. FIX: Loop through the parsed array of dictionaries
            for item in images:
                # Use standard dictionary lookups instead of dot notation
                image_path = os.getenv('UPLOAD_FOLDER')+item.get('path') 
                
                if image_path:
                    result = single_test(image_path)
                    print(result['predicted_label_name'])
                else:
                    print("Warning: Received an item missing a 'path' property.")
                    
        except Exception as e:
            print(f"Error parsing or processing message payload: {e}", file=sys.stderr)

    channel.basic_consume(queue='cnn-queue', on_message_callback=callback, auto_ack=True)

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