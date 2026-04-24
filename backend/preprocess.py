"""NLP preprocessing for sentiment analysis."""
import re
import string
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

# Download required NLTK resources (runs once)
for pkg in ["stopwords", "punkt", "punkt_tab"]:
    try:
        nltk.data.find(f"corpora/{pkg}" if pkg == "stopwords" else f"tokenizers/{pkg}")
    except LookupError:
        try:
            nltk.download(pkg, quiet=True)
        except Exception:
            pass

try:
    STOPWORDS = set(stopwords.words("english"))
except Exception:
    STOPWORDS = set()


def preprocess_text(text: str) -> str:
    """Lowercase, strip URLs/mentions/punctuation, tokenize, remove stopwords."""
    if not isinstance(text, str):
        return ""
    text = text.lower()
    text = re.sub(r"http\S+|www\.\S+", " ", text)         # URLs
    text = re.sub(r"@\w+", " ", text)                     # mentions
    text = re.sub(r"#", " ", text)                        # hashtag symbol
    text = re.sub(r"\d+", " ", text)                      # numbers
    text = text.translate(str.maketrans("", "", string.punctuation))
    try:
        tokens = word_tokenize(text)
    except Exception:
        tokens = text.split()
    tokens = [t for t in tokens if t.isalpha() and t not in STOPWORDS and len(t) > 1]
    return " ".join(tokens)
