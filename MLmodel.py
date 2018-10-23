import sys

from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np
import pandas as pd

np.set_printoptions(threshold=np.inf)

class TFIDFPredictor:
    
    def __init__(self):
        self.vectorizer = TfidfVectorizer()
 
    def train(self, x,y):
      
        self.vectorizer.fit(x,y)
 
    def predict(self, context, utterances):
        # Convert context and utterances into tfidf vector
        vector_context = self.vectorizer.transform([context])
        vector_doc = self.vectorizer.transform(utterances)
        # The dot product measures the similarity of the resulting vectors
        result = np.dot(vector_doc, vector_context.T).todense()
        result = np.asarray(result).flatten()
        # Sort by top results and return the indices in descending order
        return result
    
# Evaluate TFIDF predictor
pred = TFIDFPredictor()
data=pd.read_csv('datasets/datafile.csv')
pred.train(data['QueryText'],data['KCCAns'])
a=sys.argv[1]
b=pred.predict(a,data['QueryText'])
c=0
for w in b:
    if w==np.amax(b):
        break
    c+=1
print(data['KCCAns'][c])

# print("It's from python file MLmodel for debugging it'll always show as it is.")