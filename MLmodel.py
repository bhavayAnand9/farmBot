import sys

from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np
import pandas as pd

np.set_printoptions(threshold=np.inf)

class TFIDFPredictor:
    
    def __init__(self):
        self.vectorizer = TfidfVectorizer()
 
    def train(self, x, y):
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

data=pd.read_csv('datasets/states.csv')

# CSV/DATA PREPROCESSING

#cleaning redundant rows in csv
#df = pd.read_csv('datasets/awesome.csv')
#df.drop_duplicates(subset=None, inplace=True)
#df.to_csv('awesome2.csv')

#concatinating multiple csv files
#data2 = pd.read_csv('datasets/datafile2.csv')
#data3 = pd.read_csv('datasets/datafile3.csv')
#data4 = pd.read_csv('datasets/datafile4.csv')
#df = pd.concat([data1, data2, data3, data4], axis=0, join='inner')


pred.train(data['QueryText'],data['KCCAns'])
a=sys.argv[1]
b=pred.predict(a,data['QueryText'])
c=0
for w in b:
    if w==np.amax(b):
        break
    c+=1
print(data['KCCAns'][c])

#print("It's from python file MLmodel for debugging it'll always show as it is.")
# print(sys.argv[1])