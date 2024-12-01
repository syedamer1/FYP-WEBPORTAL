# MAIN CODE
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import pandas as pd
# from statsmodels.tsa.arima.model import ARIMA
# import glob
# import os
# import pickle
# import math

# app = Flask(__name__)
# CORS(app)  # Enable CORS for all routes

# # Define paths for saving data, model, and predictions
# combined_data_path = 'D:/data/combined_data.pkl'
# arima_model_path = 'D:/models/arima_model.pkl'
# predictions_path = 'D:/predictions/predictions.pkl'

# # Ensure directories exist
# os.makedirs(os.path.dirname(combined_data_path), exist_ok=True)
# os.makedirs(os.path.dirname(arima_model_path), exist_ok=True)
# os.makedirs(os.path.dirname(predictions_path), exist_ok=True)

# # Load existing data, model, and predictions if they exist
# def load_existing_data_model_and_predictions():
#     try:
#         with open(combined_data_path, 'rb') as f:
#             combined_data = pickle.load(f)
#         with open(arima_model_path, 'rb') as f:
#             model_fit = pickle.load(f)
#         with open(predictions_path, 'rb') as f:
#             predictions = pickle.load(f)
#         return combined_data, model_fit, predictions
#     except FileNotFoundError:
#         return pd.DataFrame(), None, pd.DataFrame()

# # Save combined data, model, and predictions
# def save_data_model_and_predictions(combined_data, model_fit, predictions):
#     with open(combined_data_path, 'wb') as f:
#         pickle.dump(combined_data, f)
#     with open(arima_model_path, 'wb') as f:
#         pickle.dump(model_fit, f)
#     with open(predictions_path, 'wb') as f:
#         pickle.dump(predictions, f)

# # Read and combine CSV files from a folder
# def read_and_combine_csv_from_folder(folder_path):
#     all_files = glob.glob(os.path.join(folder_path, "*.csv"))
#     combined_data = pd.DataFrame()
#     for file_path in all_files:
#         data = pd.read_csv(file_path, low_memory=False)
#         # Attempt to parse the 'Admission Date' and handle errors
#         try:
#             data['Admission Date'] = pd.to_datetime(data['Admission Date'], errors='coerce')
#         except Exception as e:
#             return jsonify({"error": f"Date parsing error in file {file_path}: {str(e)}"}), 400
#         combined_data = pd.concat([combined_data, data])
#     return combined_data


# # Predict resources based on patient count and medical conditions
# def predict_resources(patient_data):
#     ventilators = 0.1 * patient_data['Respiratory'].sum() + 0.05 * patient_data['Respiratory_CD'].sum()
#     oxygen_cylinders = 0.5 * patient_data['Respiratory'].sum() + 0.2 * patient_data['Respiratory_CD'].sum()
#     return ventilators, oxygen_cylinders

# @app.route('/update_predictions', methods=['GET'])
# def update_predictions():
#     folder_path = 'D:/patientdata'
#     if not folder_path:
#         return jsonify({"error": "Folder path is required"}), 400

#     # Load existing data, model, and predictions
#     combined_data, model_fit, previous_predictions = load_existing_data_model_and_predictions()

#     # Read new files and combine with existing data
#     new_data = read_and_combine_csv_from_folder(folder_path)
#     combined_data = pd.concat([combined_data, new_data])

#     # Aggregate data by 'Admission Date'
#     daily_admissions = combined_data.groupby('Admission Date').size().reset_index(name='Admissions')

#     # Check if there are enough observations
#     if len(daily_admissions) < 5:
#         return jsonify({"error": "Not enough data to fit the model"}), 400

#     # Fit the ARIMA model
#     try:
#         model = ARIMA(daily_admissions['Admissions'], order=(5, 1, 0))
#         model_fit = model.fit()
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

#     # Forecast the next 30 days
#     n_days = 30
#     forecast = model_fit.forecast(steps=n_days)
#     forecast_dates = pd.date_range(daily_admissions['Admission Date'].iloc[-1] + pd.Timedelta(days=1), periods=n_days)

#     # Predict resources for the forecasted patient counts
#     predictions = []
#     for date, count in zip(forecast_dates, forecast):
#         if count > 0:
#             new_patients = combined_data.tail(int(count))
#         else:
#             new_patients = pd.DataFrame(columns=combined_data.columns)

#         ventilators, oxygen_cylinders = predict_resources(new_patients)
#         predictions.append({
#             'Date': date.strftime('%D-%M-%Y'),
#             'PredictedPatients': math.ceil(count),
#             'VentilatorsRequired': math.ceil(ventilators),
#             'OxygenCylindersRequired': math.ceil(oxygen_cylinders)
#         })
    
#     predictions_df = pd.DataFrame(predictions)

#     # Combine new predictions with previous predictions
#     if previous_predictions.empty:
#         all_predictions = predictions_df
#     else:
#         all_predictions = pd.concat([previous_predictions, predictions_df]).drop_duplicates(subset='Date').reset_index(drop=True)

#     # Save the updated data, model, and predictions
#     save_data_model_and_predictions(combined_data, model_fit, all_predictions)

#     return jsonify(predictions_df.to_dict(orient='records'))

# @app.route('/hello', methods=['GET'])
# def hello():
#     return "Hello, World!"

# @app.route('/upload', methods=['POST'])
# def upload_file():
#     if 'folder' not in request.form or 'file' not in request.files:
#         return jsonify({'error': 'Folder name and file are required'}), 400

#     folder = request.form['folder']
#     file = request.files['file']

#     # Get the directory where the Flask app code is located
#     base_dir = os.path.dirname(os.path.abspath(__file__))
#     folder_path = os.path.join(base_dir, folder)

#     # Create folder if it doesn't exist
#     if not os.path.exists(folder_path):
#         os.makedirs(folder_path)

#     # Save file to the folder
#     file_path = os.path.join(folder_path, file.filename)
#     file.save(file_path)

#     return jsonify({'message': 'File uploaded successfully', 'file_path': file_path}), 200

# if __name__ == '__main__':
#     app.run(debug=True)


from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from statsmodels.tsa.arima.model import ARIMA
import glob
import os
import pickle
import math

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Define paths for saving data, model, and predictions
combined_data_path = 'D:/data/combined_data.pkl'
arima_model_path = 'D:/models/arima_model.pkl'
predictions_path = 'D:/predictions/predictions.pkl'

# Ensure directories exist
os.makedirs(os.path.dirname(combined_data_path), exist_ok=True)
os.makedirs(os.path.dirname(arima_model_path), exist_ok=True)
os.makedirs(os.path.dirname(predictions_path), exist_ok=True)

# Load existing data, model, and predictions if they exist
def load_existing_data_model_and_predictions():
    try:
        with open(combined_data_path, 'rb') as f:
            combined_data = pickle.load(f)
        with open(arima_model_path, 'rb') as f:
            model_fit = pickle.load(f)
        with open(predictions_path, 'rb') as f:
            predictions = pickle.load(f)
        return combined_data, model_fit, predictions
    except FileNotFoundError:
        return pd.DataFrame(), None, pd.DataFrame()

# Save combined data, model, and predictions
def save_data_model_and_predictions(combined_data, model_fit, predictions):
    with open(combined_data_path, 'wb') as f:
        pickle.dump(combined_data, f)
    with open(arima_model_path, 'wb') as f:
        pickle.dump(model_fit, f)
    with open(predictions_path, 'wb') as f:
        pickle.dump(predictions, f)

# Read and combine CSV files from a folder
def read_and_combine_csv_from_folder(folder_path):
    all_files = glob.glob(os.path.join(folder_path, "*.csv"))
    combined_data = pd.DataFrame()
    for file_path in all_files:
        data = pd.read_csv(file_path, low_memory=False)
        # Attempt to parse the 'Admission Date' and handle errors
        try:
            data['Admission Date'] = pd.to_datetime(data['Admission Date'], errors='coerce')
        except Exception as e:
            return jsonify({"error": f"Date parsing error in file {file_path}: {str(e)}"}), 400
        combined_data = pd.concat([combined_data, data])
    return combined_data

# Predict resources based on patient count and medical conditions
def predict_resources(patient_data):
    # Check if the necessary columns exist
    if 'Respiratory' not in patient_data.columns or 'Respiratory_CD' not in patient_data.columns:
        return 0, 0  # Return 0 if the columns are not found

    ventilators = 0.1 * patient_data['Respiratory'].sum() + 0.05 * patient_data['Respiratory_CD'].sum()
    oxygen_cylinders = 0.5 * patient_data['Respiratory'].sum() + 0.2 * patient_data['Respiratory_CD'].sum()
    return ventilators, oxygen_cylinders

@app.route('/update_predictions', methods=['GET'])
def update_predictions():
    folder_path = 'D:/patientdata'
    processed_folder_path = 'D:/processed'

    # Ensure the processed folder exists
    os.makedirs(processed_folder_path, exist_ok=True)

    # Load existing data, model, and predictions
    combined_data, model_fit, previous_predictions = load_existing_data_model_and_predictions()

    # Read new files and combine with existing data
    new_data = read_and_combine_csv_from_folder(folder_path)

    # Check if new_data is empty (no new files)
    if new_data.empty:
        return jsonify(previous_predictions.to_dict(orient='records'))

    # Combine new data with existing data
    combined_data = pd.concat([combined_data, new_data])

    # Check if 'Admission Date' column exists
    if 'Admission Date' not in combined_data.columns:
        return jsonify(previous_predictions.to_dict(orient='records')), 400

    # Aggregate data by 'Admission Date'
    daily_admissions = combined_data.groupby('Admission Date').size().reset_index(name='Admissions')

    # Fit the ARIMA model
    model = ARIMA(daily_admissions['Admissions'], order=(5, 1, 0))
    model_fit = model.fit()

    # Forecast the next 30 days
    n_days = 30
    forecast = model_fit.forecast(steps=n_days)
    forecast_dates = pd.date_range(daily_admissions['Admission Date'].iloc[-1] + pd.Timedelta(days=1), periods=n_days)

    # Predict resources for the forecasted patient counts
    predictions = []
    for date, count in zip(forecast_dates, forecast):
        if count > 0:
            new_patients = combined_data.tail(int(count))
        else:
            new_patients = pd.DataFrame(columns=combined_data.columns)

        ventilators, oxygen_cylinders = predict_resources(new_patients)
        predictions.append({
            'Date': date.strftime('%Y-%m-%d'),
            'PredictedPatients': math.ceil(count),
            'VentilatorsRequired': math.ceil(ventilators),
            'OxygenCylindersRequired': math.ceil(oxygen_cylinders)
        })

    predictions_df = pd.DataFrame(predictions)

    # Combine new predictions with previous predictions
    all_predictions = pd.concat([previous_predictions, predictions_df]).drop_duplicates(subset='Date').reset_index(drop=True)

    # Move processed files to the processed folder
    for file_path in glob.glob(os.path.join(folder_path, "*.csv")):
        os.rename(file_path, os.path.join(processed_folder_path, os.path.basename(file_path)))

    # Save the updated data, model, and predictions
    save_data_model_and_predictions(combined_data, model_fit, all_predictions)

    return jsonify(predictions_df.to_dict(orient='records'))



@app.route('/hello', methods=['GET'])
def hello():
    return "Hello, World!"

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'folder' not in request.form or 'file' not in request.files:
        return jsonify({'error': 'Folder name and file are required'}), 400

    folder = request.form['folder']
    file = request.files['file']

    # Get the directory where the Flask app code is located
    base_dir = os.path.dirname(os.path.abspath(__file__))
    folder_path = os.path.join(base_dir, folder)

    # Create folder if it doesn't exist
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)

    # Save file to the folder
    file_path = os.path.join(folder_path, file.filename)
    file.save(file_path)

    return jsonify({'message': 'File uploaded successfully', 'file_path': file_path}), 200

if __name__ == '__main__':
    app.run(debug=True)
