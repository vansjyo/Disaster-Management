# Idea for codefundo++

## What are we planning to build?
A web application which helps to **manage** natural disasters. Predominantly, it comprises of the following 4 features:
* **Feature 1:** Predicting any imminent natural disaster on the basis of weather forecast
* **Feature 2:** Report and find missing people in the face of a disaster
* **Feature 3:** Request for help
* **Feature 4:** SOS 101: A detailed guide of DOs and DON'Ts in the face of any natural calamity or disaster

## How does it work?
* To **predict an imminent disaster**, we are using [ThingSpeak](https://in.mathworks.com/products/thingspeak.html) which is an IoT analytics platform service that allows to aggregate, visualize, and analyze live data streams in the cloud. It can be used to send alerts using web services like Twitter® and Twilio®.

* To **report a missing person**, user fills a form with the details of the person which get stored in the database. To **find a missing person**, a query containing the name and place of a person is made to the database, incase the database contains information about the concerned person, the details are fetched.

* To **request for help**, the current location of the person is detected using HTML5 Geolocation API and accordingly, an entry is made into the database alongwith the type of help required (food/shelter/monetary). People can then reach out to help people who need it, in their nearby locations.

* **SOS 101** is essentially a primer to get people acquainted with the basic DOs and DON'Ts they should take care of, in the face of any natural disaster. It will guide them to get started with helping themselves before any external help is approached. 

## What dataset(s) are we using?
Dataset will be required for the purpose of making predictions from weather reports. We are using [ThingSpeak](https://in.mathworks.com/products/thingspeak.html) with [MATLAB](https://in.mathworks.com/help/thingspeak/collect-data-in-a-new-channel.html) for the purpose. 

## What technologies are we using?
#### Technologies to be used:
* Node.js
* MongoDB
* HTML5
* CSS
#### APIs to be used:
* HTML5 Geolocation API: For the purpose of tracking current location
* ThingSpeak API: For collecting and storing sensor data in the cloud and making weather predictions




