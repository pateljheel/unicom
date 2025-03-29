import os
import boto3

# Initialize AWS services
rekognition_client = boto3.client('rekognition')
comprehend_client = boto3.client('comprehend')
s3_client = boto3.client('s3')

# Replace with your actual S3 bucket name
S3_BUCKET_NAME = os.getenv('S3_BUCKET_NAME')

def process_image(image_data):
    """
    Uses AWS Rekognition to analyze the image for moderation.
    Returns a boolean indicating if the image is safe or not.
    """
    try:
        # Call Rekognition to detect inappropriate content in the image
        response = rekognition_client.detect_moderation_labels(
            Image={'Bytes': image_data}
        )
        labels = response['ModerationLabels']
        
        # If any inappropriate content is found, return False
        if labels:
            return False
        return True
    except Exception as e:
        print(f"Error in image moderation: {e}")
        return False
    

def process_text(text):
    """
    Uses AWS Comprehend to analyze the text for sentiment and detect dangerous content (e.g., weapons, drugs).
    Returns a boolean indicating if the text is safe or not.
    """
    try:
        # 1. Sentiment analysis
        sentiment_response = comprehend_client.batch_detect_sentiment(
            TextList=[text],
            LanguageCode='en'
        )
        sentiment = sentiment_response['ResultList'][0]['Sentiment']
        if sentiment == 'NEGATIVE':
            print("Text flagged: negative sentiment")
            return False

        # 2. Entity detection for dangerous keywords
        entity_response = comprehend_client.detect_entities(
            Text=text,
            LanguageCode='en'
        )
        entities = [entity['Text'].lower() for entity in entity_response['Entities']]

        danger_keywords = {
            "gun", "weapon", "knife", "bomb", "explosive",
            "cocaine", "heroin", "meth", "weed", "marijuana", "drugs"
        }

        for word in entities:
            for danger in danger_keywords:
                if danger in word:
                    print(f"Text flagged: detected dangerous term '{word}'")
                    return False

        # If all checks pass
        return True

    except Exception as e:
        print(f"Error in text moderation: {e}")
        return False


def store_image_in_s3(image_data, image_name):
    """
    Store the image in S3 and return the URL.
    """
    try:
        # Store the image in S3
        s3_client.put_object(Bucket=S3_BUCKET_NAME, Key=image_name, Body=image_data)
        s3_url = f"https://{S3_BUCKET_NAME}.s3.amazonaws.com/{image_name}"
        return s3_url
    except Exception as e:
        print(f"Error storing image in S3: {e}")
        return None

