# Importing Libraries
import os
import json
import boto3
from dotenv import load_dotenv
from botocore.exceptions import ClientError

# Load the environment variables from the .env file.
load_dotenv()
AWS_REGION = os.getenv("AWS_REGION")
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")

# Verify that the credentials are loaded
if not AWS_ACCESS_KEY_ID or not AWS_SECRET_ACCESS_KEY or not AWS_REGION:
    raise Exception("AWS credentials are not properly set.")

# Create a Bedrock Runtime client in the AWS Region of your choice.
client = boto3.client(
    'bedrock-runtime',
    region_name=AWS_REGION,
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY
)

# Set the model ID
model_id = "amazon.nova-pro-v1:0"

def generate_quiz_questions(input_topic, max_tokens=4096, temperature=0.5, top_p=0.9):
    prompt = f""" Generate multiple-choice quiz questions in the specified JSON format on following topic - {input_topic}:

                Create a JSON array containing 20 multiple-choice quiz questions on topics as given by user. Follow the **exact JSON structure** below for each question:

                Each question should:
                1. Be clearly worded, avoiding ambiguity.
                2. Offer four options, of which only **one is correct**.
                3. Represent the correct answer with a number from 0 to 3 in the correctAnswer field, denoting the index position in the options array.

                ### Example Format
                [
                  {{
                    "text": "What is the capital of France?",
                    "options": ["Madrid", "Rome", "Paris", "Berlin"],
                    "correctAnswer": 2
                  }},
                  {{
                    "text": "Which planet is known as the Red Planet?",
                    "options": ["Earth", "Mars", "Jupiter", "Venus"],
                    "correctAnswer": 1
                  }}
                ]

                Strictly return only the JSON array of questions, without additional commentary, explanations, or formatting outside the JSON.
                Make sure all entries are syntactically correct JSON. Don't Include any additional text or comments in the JSON.
                The JSON should be an array of objects, each object representing a single question in the specified format. 
                Don't include any newline in the response . """

    conversation = [
        {
            "role": "user",
            "content": [{"text": prompt}],
        }
    ]
    try:
        # Send the message to the model using the provided inference configuration.
        response = client.converse(
            modelId=model_id,
            messages=conversation,
            inferenceConfig={
                "maxTokens": max_tokens,
                "temperature": temperature,
                "topP": top_p,
            },
        )

        # Extract and return the response text.
        response_text = response["output"]["message"]["content"][0]["text"]
        return response_text

    except (ClientError, Exception) as e:
        print(f"ERROR: Can't invoke '{model_id}'. Reason: {e}")
        return None

# Example usage:
#prompt = "Hello, how are you today?"
#response = generate_response(prompt, max_tokens=512, temperature=0.5, top_p=0.9)
#if response:
#    print(response)