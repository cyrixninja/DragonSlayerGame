import boto3
import json
import time
from botocore.exceptions import ClientError

# Initialize the Bedrock client
bedrock = boto3.client(
    service_name='bedrock-runtime',   
    region_name='us-east-1' # Region where the Bedrock model is deployed
)

def generate_quiz_questions(input_topic):
    prompt = f""" Generate multiple-choice quiz questions in the specified JSON format on following topic - {input_topic}:

                Create a JSON array containing 10 multiple-choice quiz questions on topics as given by user. Follow the **exact JSON structure** below for each question:

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

    body = json.dumps({
        "prompt": prompt,
        "temperature": 1
    })

    modelId = 'ai21.j2-mid-v1' # Model ID for the Bedrock model
    accept = 'application/json' # Accept header for the response
    contentType = 'application/json'    # Content-Type header for the request

    max_retries = 5    # maximum number of retries
    retry_delay = 1  # initial delay in seconds

    for attempt in range(max_retries):
        try:
            response = bedrock.invoke_model(body=body, modelId=modelId, accept=accept, contentType=contentType)
            response_body = json.loads(response['body'])
            questions = response_body['generations'][0]['text']

            # Strip any additional text before the JSON array
            start_index = questions.find('[')
            end_index = questions.rfind(']') + 1
            questions = questions[start_index:end_index].strip()

            # Check if questions string is not empty before parsing
            if questions.strip():
                try:
                    questions_json = json.loads(questions)
                    formatted_questions_json = json.dumps(questions_json, indent=2)
                    return formatted_questions_json
                except json.JSONDecodeError as e:
                    return f"Error decoding JSON: {e}"
            else:
                return "No questions generated."
        except ClientError as e:
            if e.response['Error']['Code'] == 'ThrottlingException':
                print(f"ThrottlingException: Retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
                retry_delay *= 2 
            else:
                return f"An error occurred: {e}"