import json
import aio_pika
import aiosmtplib
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadTimeSignature
from email.mime.text import MIMEText
from django.conf import settings

RABBITMQ_URL = "amqp://guest:guest@localhost/"

async def publish_email(payload: dict):
    connection = await aio_pika.connect_robust(RABBITMQ_URL)
    channel = await connection.channel()

    await channel.declare_queue(
        "email_queue",
        durable=True
    )
    
    message = aio_pika.Message(
        body=json.dumps(payload).encode(),
        delivery_mode=aio_pika.DeliveryMode.PERSISTENT,
    )

    await channel.default_exchange.publish(
        message,
        routing_key="email_queue"
    )

    await connection.close()

def generate_verification_token(email):
    serializer = URLSafeTimedSerializer(secret_key=settings.SECRET_KEY)
    return serializer.dumps(email, salt=settings.SECURITY_PASSWORD_SALT)

def confirm_verification_token(token, expiration=600):
    serializer = URLSafeTimedSerializer(secret_key=settings.SECRET_KEY)
    try:
        email = serializer.loads(token, salt=settings.SECURITY_PASSWORD_SALT, max_age=expiration)
        return email
    except SignatureExpired:
        print('Verification link expired')
        return None
    except BadTimeSignature:
        print('Invalid verification link')
        return None
