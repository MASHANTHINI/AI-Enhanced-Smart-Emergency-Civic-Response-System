import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

texts = [
    # HIGH
    "accident severe injury",
    "fire in building",
    "major road accident",
    "gas leak dangerous",
    "explosion happened",
    "person unconscious",
    "bridge collapsed",

    # MEDIUM
    "pothole on road",
    "water leakage in pipe",
    "electricity problem",
    "broken traffic signal",
    "road damaged",

    # LOW
    "garbage not collected",
    "street light not working",
    "noise complaint",
    "cleanliness issue",
    "dust problem"
]

labels = [
    2,2,2,2,2,2,2,
    1,1,1,1,1,
    0,0,0,0,0
]

vectorizer = TfidfVectorizer(stop_words="english")
X = vectorizer.fit_transform(texts)

model = LogisticRegression(max_iter=1000)
model.fit(X, labels)

joblib.dump(model, "urgency_model.pkl")
joblib.dump(vectorizer, "vectorizer.pkl")

print("✅ Model trained and saved")
