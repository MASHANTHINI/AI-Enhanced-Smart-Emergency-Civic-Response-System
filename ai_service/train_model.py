import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

# Sample training data (you can expand later)
texts = [
    "accident severe injury",
    "fire in building",
    "major road accident",
    "gas leak dangerous",
    "small water leakage",
    "street light not working",
    "garbage not collected",
    "pothole on road"
]

labels = [2,2,2,2,0,0,0,1]  
# 0 = Low, 1 = Medium, 2 = High urgency

vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(texts)

model = LogisticRegression()
model.fit(X, labels)

joblib.dump(model, "urgency_model.pkl")
joblib.dump(vectorizer, "vectorizer.pkl")

print("Model trained and saved")
