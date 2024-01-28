from google.cloud import language_v1

def analyze_sentiment(text_content):
    client = language_v1.LanguageServiceClient()

    document = language_v1.Document(content=text_content, type_=language_v1.Document.Type.PLAIN_TEXT)

    # Perform sentiment analysis
    response = client.analyze_sentiment(document=document)

    # Get sentiment score
    sentiment_score = response.document_sentiment.score

    return sentiment_score

def read_file_to_string(file_path):
    try:
        with open(file_path, 'r') as file:
            file_content = file.read()
        return file_content
    except FileNotFoundError:
        return f"Error: File not found at {file_path}"
    except Exception as e:
        return f"Error: {str(e)}"
    
def convert_to_emotion_label(x):
    if x > 0.2:
        return "Very Positive"
    elif x > 0.1:
        return "Positive"
    elif x > 0.5:
        return "Slightly Positive"
    elif x > -0.5:
        return "Neutral"
    elif x > -0.1:
        return "SlightlyNeutral"
    elif x > -0.2:
        return "Negative"
    else:
        return "Very Negative"

chat_input = """on the way eta 6:57
apex at like 7:00
kai nishida — 01/25/2024 6:54 PM
jit
ok
kai nishida — 01/25/2024 7:07 PM
ok jit
u r fat
chubbymoss11
 started a call that lasted 3 minutes.
 — 01/25/2024 7:08 PM
kai nishida — 01/25/2024 7:10 PM
Image
chubbymoss11 — Yesterday at 6:57 PM
jitttt
jiiit
jiiiiiit
time to get carried jit
ape sex
@kai nishida
jiiiit
kai nishida — Yesterday at 7:02 PM
jit i’m literally at hackathon
chubbymoss11 — Yesterday at 7:10 PM
same
wait where ru
i’m in the back near the door in the right corner
kai nishida — Yesterday at 7:38 PM
thats literally cap"""


file_path = 'test.txt'
file_content = read_file_to_string(file_path)

result = analyze_sentiment(file_content)

sentiment_score = result
emotion_label = convert_to_emotion_label(sentiment_score)

print(f"Emotion label: {emotion_label}")
