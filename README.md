#AI-Powered Early Outbreak Detection System
#Overview

This project implements an AI-based early outbreak detection system using anomaly detection techniques. The system analyzes real-world COVID-19 case data to identify abnormal spikes in daily infections and generate an outbreak risk score.

Traditional disease surveillance systems are often reactive and depend on confirmed clinical reports. This project demonstrates how machine learning models can detect unusual patterns earlier by identifying deviations from normal case trends.

#Objective

The objective of this project is to simulate an early warning system capable of:

Detecting abnormal increases in daily case counts

Learning baseline disease patterns

Generating a dynamic outbreak risk score

Providing results through a web-based dashboard

System Architecture

Data ingestion from a COVID-19 dataset (CSV format)

Data preprocessing and filtering by country

Training an Isolation Forest anomaly detection model

Saving the trained model using Pickle

Serving predictions through a Flask API

Displaying results on a frontend dashboard using Chart.js

Technologies Used

Python

Flask

Scikit-learn

Pandas

Pickle

HTML/CSS

Chart.js
