import pika, sys, os, json
from recognition.utils.eval import single_test
from dotenv import load_dotenv

load_dotenv()

def main():
    credentials = pika.PlainCredentials('user', 'password')
    connection = pika.BlockingConnection(
        pika.ConnectionParameters(host='localhost', port=5672, credentials=credentials)
    )
    channel = connection.channel()

    # 1. Declare exchange
    channel.exchange_declare(exchange='cnn-exchange', exchange_type='topic')

    # 2. Declare Quorum queue
    channel.queue_declare(
        queue='cnn-queue', 
        durable=True, 
        arguments={'x-queue-type': 'quorum'}
    )

    # 3. Bind queue
    channel.queue_bind(
        exchange='cnn-exchange', 
        queue='cnn-queue', 
        routing_key='cnn-queue'
    )

    def callback(ch, method, properties, body):                
        try:
            data = json.loads(body.decode('utf-8'))
            images = data.get('message', [])
            results = []
            
            upload_folder = os.getenv('UPLOAD_FOLDER', '')
            
            for item in images:
                # Get image path safely
                raw_path = item.get('path') or item.get('name') or ''
                image_path = os.path.join(upload_folder, raw_path.lstrip('/\\'))
                
                if raw_path:
                    result = single_test(image_path)
                    
                    # Assuming single_test returns a dict like {'predicted_label_name': 'Cat'}
                    # or string. Extract the label string for the array:
                    label_name = result.get('predicted_label_name') if isinstance(result, dict) else result
                    results.append(label_name)
                    
                    print(f"Processed label: {label_name}")
                else:
                    print("Warning: Received an item missing a 'path' property.")
            
            # FIX 1: Ensure response_payload is ALWAYS created after the loop
            response_payload = json.dumps(results)

        except Exception as e:
            print(f"Error parsing or processing message payload: {e}", file=sys.stderr)
            response_payload = json.dumps({"error": str(e)})

        # Send response back to TypeScript RPC Client
        if properties.reply_to:
            ch.basic_publish(
                exchange='',
                routing_key=properties.reply_to,
                properties=pika.BasicProperties(
                    correlation_id=properties.correlation_id,
                    content_type='application/json'
                ),
                body=response_payload
            )
            print("Response published back to TypeScript.")

        # FIX 2: Manual ACK is used here, so auto_ack MUST be False in basic_consume!
        ch.basic_ack(delivery_tag=method.delivery_tag)

    # FIX 2: Changed auto_ack to False so basic_ack doesn't throw a channel exception
    channel.basic_consume(queue='cnn-queue', on_message_callback=callback, auto_ack=False)

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