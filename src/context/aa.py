import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error

# Load the data
data = pd.read_csv('Book1.csv')

# Convert Admission Date to timestamp
data['Admission Date'] = pd.to_datetime(data['Admission Date'], format='%d/%m/%Y').astype(int) // 10**9

# Drop non-numeric columns that cannot be directly used in regression
excluded_columns = ['First Name', 'Last Name', 'CNIC', 'Admission Date']
features = [col for col in data.columns if col not in excluded_columns]

# Ensure all remaining columns are numeric
data[features] = data[features].apply(pd.to_numeric, errors='coerce')

# Drop rows with any NaN values
data.dropna(inplace=True)

# Select features and target variable
target = 'Death Binary'

X = data[features]
y = data[target]

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Initialize and train a Random Forest Regression model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Predict on the testing set
predictions = model.predict(X_test)

# Evaluate the model
mse = mean_squared_error(y_test, predictions)
print(f'Mean Squared Error: {mse}')

# Example: predict upcoming patient outcomes for new data
new_data = pd.DataFrame({
    'Age': [45],
    'ChronicDiseaseQ': [1],
    'Gender Binary': [0],
    'Respiratory': [1],
    'Weakness/Pain': [0],
    'Fever': [1],
    'Gastrointestinal': [0],
    'Nausea': [0],
    'Cardiac': [1],
    'High Fever': [0],
    'Kidney': [1],
    'Asymptomatic': [0],
    'Diabetes': [1],
    'Neuro': [0],
    'Hypertension': [1],
    'Cancer': [0],
    'Ortho': [0],
    'Respiratory_CD': [1],
    'Cardiacs_CD': [0],
    'Kidney_CD': [1],
    'Blood': [0],
    'Prostate': [0],
    'Thyroid': [1]
})

predicted_outcome = model.predict(new_data)
print(f'Predicted upcoming patient outcome: {predicted_outcome}')
