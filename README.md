# infoware-task-mrsajid
The task of backend creation with node JS and DB as MySQL given by infoware

# Node.js MySQL App

This is a simple web application built with Node.js and MySQL, which allows you to perform CRUD (Create, Read, Update, Delete) operations on a database.

## Prerequisites

Before running this application, ensure that you have the following software installed on your system:

- Node.js (version 10 or above)
- MySQL Server

## Installation

1. Clone this repository to your local machine using the following command:

   ```shell
   git clone https://github.com/SAAD2129/infoware-task-mrsajid.git
   ```

2. Navigate to the project directory:

   ```shell
   cd infoware-task-mrsajid
   ```

3. Install the dependencies by running the following command:

   ```shell
   npm install
   ```

4. Create a `.env` file in the project root and provide the required configuration variables. Here is an example:

   ```plaintext
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=your_database_name
   ```

## Usage

To start the application, run the following command:

```shell
npm run dev
```

This will start the server at `http://localhost:5000`.

## Features

This application provides the following features:

- Reading a list of items from the database with pagination.
- Adding a new item to the database.
- Reading a 
- Updating an existing item.
- Deleting an item from the database.
