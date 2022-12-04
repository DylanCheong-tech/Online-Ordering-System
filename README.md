# Online Order System 

### Project Status
> Version 1.0 is currently in development. 

# Descriptions 
The online order system is a web-application to allow the business owner to manage their incoming order online. The web-application will display all the product items and the customer or visitor can browse through and make orders. 

In the order processing features, the web-application will be able to notify the business owner and customer on any important events, such as order is created and order is confirmed, by sending notification thru email and WhatsApp. 

# Installation 
This web-application will be using the MERN technology stack. As for security concerns, I will mask out the database connection string when the source code is being published. You may replace your own connection string for your mongoDB database, if you wish to have a try. 

### Requirements
| Requirements        | References |
|---------------------|------------|
| NodeJS v18.x.x LTS  | https://nodejs.org/en/download/ |
| ExpressJS v4.0      | https://expressjs.com/en/4x/api.html |
| MongoDB Atlas^      | https://www.mongodb.com/docs/atlas/getting-started/ |
| MongoDB Driver v4.5.0| https://www.mongodb.com/docs/atlas/getting-started/ |
| ReactJS v18         | https://reactjs.org/docs/cdn-links.html|

^ You can opt for using a local MongoDB cluster on your machine. 

# Usage
Before starting the server, update the dependecies with npm 

``` npm update ```

Start the server service 

``` npm start ```

Head over your browser and access the web application on ```http://localhost:5500```

# Deployment 
In the deployment process, I am deploying the server source code to the GCP and MongoDB Atlas for cloud databases. 

I am using the AppEngine service provided by the GCP to boot and run the NodeJS runtime and the web server services. 

# Roadmap 
A simple roadmap planning for the software increments as follows.

| Roadmap     | Software Increments|
|-------------|------|
| Version 1.0 | A simple business product catalog.|
| Version 1.1 | Business Owner portal for product item manipulations.|
| Version 2.0 | Increment with orders processing features. |
| Version 2.1 | Increment with product reviews/rating management. |
| Version 2.2 | Increment with product recommendations. |

# Conventions 
For traceability and clarity purposes, all the new increment features will be implemented in the new branch, and merge when the features are tested and ready for delivery. 
