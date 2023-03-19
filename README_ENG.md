# HR-LINE-BOT
    This document is a README for the [HR-LINE-BOT] project.
    Due to issues with lag and delays when working with Google Forms, as well as UX/UI issues with certain steps in the process, users have had a poor experience. Additionally, the data structure stored in spreadsheets may not be scalable or meet future requirements for system expansion.

*** This project is a volunteer project aimed at addressing issues with time logging to make it more convenient and reducing the amount of human work required. ***



## Purpose
    1. To improve the data structure of the time logging system by moving the main database from Google Sheets to a relational database management system (RDBMS).
    2. To make the most of the existing resources in the company (server and hosting) to benefit the project.
    3. To reduce the workload of employees responsible for time logging, minimize errors, and provide more time to focus on other aspects of job quality.
     
## Benefits
    1. The application is used for logging employee attendance (in the future, a leave confirmation system will be added to notify managers of employee leave requests and allow for immediate approval).
    2. The application is highly responsive, making it easy for users to log their working hours.
    3. The data stored in the RDBMS can be used to gain insights into employee behavior and better understand their work patterns.
    4. The application aims to reduce workload and increase data accuracy.
     

## Getting Started

### Prerequisites

    To start using the [HR-LINE-BOT] project, you will need to have a list of software needed for installation and instructions on how to install them.

### Installation
    The installation guide for the [HR-LINE-BOT] project is as follows:
        1. Install NodeJS via https://nodejs.org/en, the current version being LTS 18.15.0 at the time of development.
        2. Check whether NodeJS has been installed successfully by opening the Command Prompt and typing the command "node --version".
        3. After installation, navigate to the current path of the project and use the command npm i to install the packages listed in the "package.json" file.
    
### Project Structure

        The starting point of the application is in "app.js", which calls the module exported as "routes.js". "routes.js" then calls sub-routes based on the HTTP method used in the request (e.g. GET, POST, PUT, etc.). After an HTTP request is received, the first file that gets called in the sub-route (<service.route.js>) is in the "controller" section. Next, the "controller" calls the "service" layer, which in turn calls the "repositories" layer when database operations are required.

        *** The reason for separating the folders into layers is to meet the requirement for dividing the work components for analysis, problem-solving, and future expansion. ***

    -> Root Directory
        - app.js       <-- entry point application 
        - src                
            - controllers     //   request and response management
                - <service_name>.controller.js           
                ...
            - services        //  business logic management
                - <service_name>.service.js           
                ...
            - repositories      // database query management
                - <service_name>.repository.js      
                ...     
            - db              // database management such as Models and database config
                - config       // config for database connection
                - migration    // migration files
                - models       // model for database
            - routes          //  routing and middleware
                - routes.js            // main routes
                - <service>.route.js           // sub routes   
        - .sequelizerc          // sequelize path configuration
        - package-lock.json
        - package.json
        - README_<language>.md
        - env_template.txt        // configuration for env here
         
### Usage

    How to use the [HR-LINE-BOT] project:
    1. Before starting to use, the first thing to consider is the "environment" because if the values are not specified in this section, the project will not be able to work.
        1.1 Check env_template
        1.2 Create a file with the extension ".env" and put the values from step 1.1 in it.
        1.3 In the case of "env" being "development", you can use "npm i" and "sequelize db:migrate".

    2. In addition to reading and writing data on the RDBMS side, the project also reads and writes data to "googlesheet" to make it easier for users to extract data for reporting purposes.
        2.1 It is necessary to specify the "env" with a variable named "SPREAD_SHEET_ID".
        2.2 It is necessary to place the googlesheet config file that specifies the Key and Credential in the root directory of the project (at the same level as app.js) and put the values in it.
        2.3 The value of credentials.json can be found in the googlesheet developer console.

    3. The project works with an FTP server to reduce the burden of storage costs for both Googledrive and Hosting, so files are moved to the FTP server after the user completes the operation.
        3.1 The working process can be found in "/repositories/ftp-rw.repository.js".

    4. Due to this project works directly with LINE Messaging API, the user needs to specify "ACCESS_TOKEN" and "SECRET_TOKEN" from LINE. These values can be found in LINE Developer Console. More details can be found in the documentation of LINE Messaging API.
    
    5. After setting up the various environment values, you can use the command "node app.js" or if you want to test it with hot reload, use "nodemon app.js".


## Authors
* [Mr.Thossaporn Sukprasomjit] - [kimjonggod@hotmail.com] Thailand GMT+7 
