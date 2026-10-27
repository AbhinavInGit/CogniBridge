"""Train a demo classifier on deliberately synthetic quiz-history data.

This is only a vertical-slice model. Real learner data, validation, fairness review,
and clinical/educational oversight are required before any production use.
"""
import joblib
import numpy as np
import pandas as pd
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split
from xgboost import XGBClassifier

FEATURES = ['avg_score', 'score_trend', 'avg_time_per_question', 'retry_count', 'score_variance', 'completion_rate']
LABELS = ['standard', 'needs_pacing_support', 'needs_simplified_content']

def build_synthetic_data(rows_per_label=180):
    rng = np.random.default_rng(42)
    records = []
    for label, mean in enumerate([[82, 6, 30, 1, 8, 94], [66, -4, 55, 3, 18, 77], [50, -8, 75, 4, 25, 63]]):
        values = rng.normal(mean, [8, 4, 12, 1.2, 6, 9], size=(rows_per_label, 6))
        for row in values:
            records.append([*row, label])
    frame = pd.DataFrame(records, columns=[*FEATURES, 'label'])
    frame['avg_score'] = frame['avg_score'].clip(0, 100)
    frame['completion_rate'] = frame['completion_rate'].clip(0, 100)
    frame['retry_count'] = frame['retry_count'].clip(0).round()
    return frame

if __name__ == '__main__':
    data = build_synthetic_data()
    x_train, x_test, y_train, y_test = train_test_split(data[FEATURES], data['label'], test_size=.25, random_state=42, stratify=data['label'])
    model = XGBClassifier(n_estimators=80, max_depth=3, learning_rate=.08, objective='multi:softprob', eval_metric='mlogloss', random_state=42)
    model.fit(x_train, y_train)
    prediction = model.predict(x_test)
    print(f'Accuracy: {accuracy_score(y_test, prediction):.3f}')
    print(classification_report(y_test, prediction, target_names=LABELS))
    joblib.dump({'model': model, 'features': FEATURES, 'labels': LABELS}, 'model.joblib')
    print('Saved synthetic-demo model to model.joblib')
