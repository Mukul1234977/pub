# ICMYC-PM-BE-CF


#### run server on local machine
`npm run server`

# Database and collections

### Sample form object
`Formate of the json object which has to be created in order to generate dynamic forms at the frontend`

```
{
    "_id": "1234",
    "title": [{ id:1, lang:"en", label:"English title"},{ id:2, lang:"hi", label:"Hindi title"} ],
    "description":[{ id:1, lang:"en", label:"English description"},{ id:2, lang:"hi", label:"Hindi description"}],
    "role":[{"id":"1","value":"agent"} ,{"id":"2","value":"manager"},{"id":"3","value":"admin"}],
    "type":[{"id":"1","value":"mrc"} ,{"id":"2","value":"mcc"}],
    "state":[{"id":"1", "value": "Maharastra"}],
    "city":[{"id":"1","value":"Mumbai"},{"id":"2","value":"Pune"}],
    "civic_agency":[{"id":"1", "value": "angency1"},{"id":"2", "value": "angency2"}],
    "action":[{"id":"1", "value": "report"},{"id":"2", "value": "survey"}],
    "categories":[{"id":"1", "value": "municipal"}],
    "created_at": Date,
    "fields" : [
        {
            "field_title": [{ id:1, lang:"en", label:"English Title"},{ id:2, lang:"hi", label:"Hindi title"}], //form field title
            "name": "fname"                       //key name for form fields to be created          
            "type": "String",                     //type of the form field
            "required":true,                      //flag to set mendatary field
            "placeholder":"First Name"            //placeholder of the form fields
            
        },
        {
            "title": [{ id:1, lang:"en", label:"English title"},{ id:2, lang:"hi", label:"Hindi title"}],
            "name": "lname",
            "type": "String",
            "required":false,
            "placeholder":"Last Name"
            
        },
        {
            "title": [{ id:1, lang:"en", label:"English title"},{ id:2, lang:"hi", label:"Hindi title"}],
            "name": "about",
            "type": "MultilineString",
            "required":false,
            "placeholder":"Write about yourself"
            
        },
        {
            "title": [{ id:1, lang:"en", label:"English title"},{ id:2, lang:"hi", label:"Hindi title"}],
            "name": "age",
            "type": "Number",
            "required":true,
            "placeholder":"Your age"
            
        },
        {
            "title": [{ id:1, lang:"en", label:"English title"},{ id:2, lang:"hi", label:"Hindi title"}],
            "name": "language",
            "type": "Select",
            "required":true,
            "placeholder":"Select your language",
            "action" : "local"
            "values":[ 
                {"id":1,"label": "English"},
                {"id":1, "label": "Hindi"},
                {"id":1, "label": "Marathi"},
                {"id":1,"label": "Urdu"}
                ]
        },
        {
            "title": [{ id:1, lang:"en", label:"English title"},{ id:2, lang:"hi", label:"Hindi title"}],
            "name": "agency",
            "type": "Select",
            "required":true,
            "placeholder":"Select your agency",
            "action" : "api",                                         //used at server side only to determine action on dropdown values
            "query" : "?facility=MCC&collection_site=commercial",     //uery params for dropdown values
            "end_point": "api_endpoint_to_fetch_dropdown_data",       //api end point for dropdown values
            "values":[]                                               //dropdown values filled at server side when fetching the form
        },
        {
            "title": [{ id:1, lang:"en", label:"English title"},{ id:2, lang:"hi", label:"Hindi title"}],
            "name": "available_at",
            "type": "Date",
            "required":true,
            "placeholder":"You will be available at",
            "default": "Date.now()"
        },
        {
            "title": [{ id:1, lang:"en", label:"English title"},{ id:2, lang:"hi", label:"Hindi title"}],
            "name": "on_leave",
            "type": "Radio",
            "required":true,
            "options": ["Yes", "No"]
        },
         {
            "title": [{ id:1, lang:"en", label:"English title"},{ id:2, lang:"hi", label:"Hindi title"}],
            "name": "facilities",
            "type": "Checkbox",
            "required":true,
            "placeholder":"Chose your facilities"
        },
         {
            "title": [{ id:1, lang:"en", label:"English title"},{ id:2, lang:"hi", label:"Hindi title"}],
            "name": "rating",
            "type": "Rating",
            "required":true,
            "placeholder":"Rate our service"
        }
    ]

}
```
Titles to be shown at frontend will be fetched only of speciefied languages in the query params 
`Note: For the fields of type dowpdowns, values of the dropdown will be decided by the action, if action is "local" we will show local values in the "value field, if action is "api" we get the drop down values by hitting the api specefied in "value" field`


### Form queries

- Get form by id   ( if requested user has role in his authentication token )
- Get forms by city ( check and retrieve all the form of a city matching with user's role)


### Form response objects


```json
{
  "form_id": "5ee0d50db1591220e861c595",
  "response": {
    "primary_worker": "Aamir",
    "about_work": "I work in sanitizing public places and update for any sanitization requirements",
    "weight_comp": 45,
    "facilities": [
      {
        "id": 1
      },
      {
        "id": 3
      }
    ],
    "field_type": [
      {
        "id": 2
      }
    ],
    "vehicle_type": [
      {
        "id": 2
      }
    ]
  },
  "meta": {
    "id": 13,
    "mobile_number": "9985353442",
    "roles": [
      {
        "id": 3,
        "name": "Facility Manager"
      }
    ],
    "full_name": "Facility Manager - Unit 1",
    "designation": "Facility in-charge",
    "employee_generic_id": "SP-EMP-0108-2020",
    "facility": {
      "name": "Facility Center-1",
      "type": "MRF"
    },
    "ulb_code": "1234M",
    "location": {
      "city_name": "Paradeep",
      "city_id": 11,
      "ward_id": 999,
      "ward_name": "Ward Name 123"
    }
  }
}
```

### Form response queries

- Get responses by form_id
- Get response by user_id and form_id
- Get responses by user_id
- Get responses by city and role
- Get users with a specific response
- Get no of response by form_id
- Get no of response by user_id


### Database Collections 


* forms : collection 
    * _id (form_id) : String
    * title  : String
    * description  : String
    * role : array
        * id : item_id
        * value : item_value
    * type : array
        * id : item_id
        * value : item_value
    * state : array
        * id : item_id
        * value : item_value
    * city : array
        * id : item_id
        * value : item_value
    * action : array
        * id : item_id
        * value : item_value
    * categories : array
        * id : item_id
        * value : item_value
    * civic_agency : array
        * id : item_id
        * value : item_value
    * fields : array
         * name : String
         * type : String
         * required: String
         * placeholder: String
         * action: String
         * query: String
         * end_point: String
         * values : array
              * id : item_id
              * value : item_value
         * default : String 
         
 * form_response : collection 
    * _id (response_id) : String
    * form_id  : String
    * submitted_at : String
    * response : object
         * field_name : value
         * field_name : vlalue
         * more fields...
    * meta  : Object
         * phone : value
         * user_id : vlalue
         * more user details...
         
         
         
# Server deployments


#### Installations
`Dependencies to be installed in ubuntu machine`
- Node.js
- MongoDB
- pm2
- git

## Create folder for project
  ```
  mkdir ~/production
  cd ~/production
  ```
## Install git
  ```
 sudo apt-add-repository ppa:git-core/ppa
# [ENTER]
sudo apt update
sudo apt install git
# Check GIT version
git --version

  ```

## Install Node
- Node.js® is a JavaScript runtime built on Chrome’s V8 JavaScript engine.
https://nodejs.org/en/

1. Install node version manager (nvm) by typing the following at the command line.
```
    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.0/install.sh | bash
```

2. Activate nvm by typing the following at the command line.
- We will use nvm to install Node.js because nvm can install multiple versions of Node.js and allow you to switch between them.
```
    ~/.nvm/nvm.sh
 ```
 
3. Use nvm to install the version of Node.js you intend to use by typing the following at the command line.
```
     nvm install 12.14.1
```
4. Test that Node.js is installed and running correctly by typing the following at the command line.

```
    node -e "console.log('Running Node.js '+ process.version)" 
```

## Update npm
- npm is the package manager for JavaScript and the world’s largest software registry. Discover packages of reusable code — and assemble them in powerful new ways.
```
    npm install npm@latest -g
    # Check version.
    npm -v
    # Should be 5.5.1 or higher.
```

## Install PM2 (Process Manager)
- PM2 is a production process manager for Node.js applications with a built-in load balancer. It allows you to keep applications alive forever, to reload them without downtime and to facilitate common system admin tasks.

```
 npm install pm2@latest -g
# Check version.
pm2 -v
# Should be 2.7.2 or higher.
pm2 startup
# Follow Instructions
pm2 monitor
# Free Node Monitoring Service
```

## Clone the production
- Clone the project with following commands into to production directory
```
git clone https://github.com/janaonline/ICMYC-PM-BE-CF.git
# For a specific branch
git clone -b production https://github.com/janaonline/ICMYC-PM-BE-CF.git
```

## Start the server
- Start the server with pm2 commands
```
pm2 start server.js

# restart the server

pm2 restart server.

```


# REST APIs

**Get forms**
----
  Returns list json data of forms.

* **URL**

  `http://3.6.99.164:5000/api/form/forms`

* **Method:**

  `GET`
  
* **Header**

    ```'headers': {
    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6Ijk1OGNiZDdlZmQ4ODhjZDdlZmQ0OTJiZjIyNDhlNGIyYzZhZWVhOGJkMTAzMjMwMjQ4ZGUxZmYyODk3MmZkOWIyYmE2ODYwNDQxM2YwNDQ2In0.eyJhdWQiOiIxMCIsImp0aSI6Ijk1OGNiZDdlZmQ4ODhjZDdlZmQ0OTJiZjIyNDhlNGIyYzZhZWVhOGJkMTAzMjMwMjQ4ZGUxZmYyODk3MmZkOWIyYmE2ODYwNDQxM2YwNDQ2IiwiaWF0IjoxNTkwNjY3MjcyLCJuYmYiOjE1OTA2NjcyNzIsImV4cCI6MTU5MTk2MzI3MSwic3ViIjoiMTMiLCJzY29wZXMiOlsiIl19.vmnBdh-CQlVgA7brO9dukT3lIrRwCWOrcTq3l_pRg_7VvJdIgsCEwVpF_eXe5dYbmJ6u5F8L2vbcXx3ZjdfBCrBYGBEbYAnPfGemFLK5LxDR1kQOZ89Ervhgnqj_4quGdW5axgstsm2rMDcSKGawQ5uGrOeYOHT4w2m4zxl5uruPCNUWA0kjhlto8m7YgkD88umB2sjRXooWuvME9EaeHiQUoHkzAGEuptpXXzmFyGTmdJ0LH07AZDK5HI5dig9AHNSdnHTnGWdAfmEKJX_lqOfiAaphnV-FYEZmS-6DdLdY662qtAS5tIZY2ch0TeWm2KF7nJDWJomhVJMu5KHRl0jjDbyHq8vbMIdxsNr8cenGkq9Ki0WAmiR-sd9Rp3DOdlWTs8Ixj4S8jX82CLmeouHt4wYYu-nJxYlo97GALFzfVXtIbxDQq4rQJQ6oJn7LatUVQ9v9qmPX-QVqY3f92URiq8-_7ngCkt8Ut7AoZKj1QkCgNGYTIfcmPdOqMekccVc8h1nr-BFVF3avbrdn3wpv-4R7PxGounUhgcjJfU64BrqFdCnjrsaSIv0jxwJpADTi6xkkuP7yhY9j_IPAsYNxaoG8rVTqL5kIFfQ38IiMWTznUc2BOCsIsNhe_Y1CBZQZXY8Knv6oO4bhz0cE4NJd0EFWo9xeB-VLF5u2I-8',
    'Accept-Language': 'en'
  }
  ```
  
  
*  **URL Params**
    
    None

   **Required:**
 
   None

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**    
    ```json
        [
            {
    "_id": "5ee0d50db1591220e861c595",
    "title": "Received",
    "description": "Form description ",
    "created_at": "2020-06-10T12:41:49.682Z"
        },
        {
    "_id": "5ee0d58cb1591220e861c5a0",
    "title": "Received 2",
    "description": "Form description ",
    "created_at": "2020-06-10T12:43:56.134Z"
    } 
    ]
```
 
* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ message : "Server Error" }`

* **Sample Call:**

  ```
    var http = require('http');
    var options = {
    'method': 'GET',
    'hostname': '3.6.99.164',
    'path': '/api/form/forms',
    'headers': {
    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6Ijk1OGNiZDdlZmQ4ODhjZDdlZmQ0OTJiZjIyNDhlNGIyYzZhZWVhOGJkMTAzMjMwMjQ4ZGUxZmYyODk3MmZkOWIyYmE2ODYwNDQxM2YwNDQ2In0.eyJhdWQiOiIxMCIsImp0aSI6Ijk1OGNiZDdlZmQ4ODhjZDdlZmQ0OTJiZjIyNDhlNGIyYzZhZWVhOGJkMTAzMjMwMjQ4ZGUxZmYyODk3MmZkOWIyYmE2ODYwNDQxM2YwNDQ2IiwiaWF0IjoxNTkwNjY3MjcyLCJuYmYiOjE1OTA2NjcyNzIsImV4cCI6MTU5MTk2MzI3MSwic3ViIjoiMTMiLCJzY29wZXMiOlsiIl19.vmnBdh-CQlVgA7brO9dukT3lIrRwCWOrcTq3l_pRg_7VvJdIgsCEwVpF_eXe5dYbmJ6u5F8L2vbcXx3ZjdfBCrBYGBEbYAnPfGemFLK5LxDR1kQOZ89Ervhgnqj_4quGdW5axgstsm2rMDcSKGawQ5uGrOeYOHT4w2m4zxl5uruPCNUWA0kjhlto8m7YgkD88umB2sjRXooWuvME9EaeHiQUoHkzAGEuptpXXzmFyGTmdJ0LH07AZDK5HI5dig9AHNSdnHTnGWdAfmEKJX_lqOfiAaphnV-FYEZmS-6DdLdY662qtAS5tIZY2ch0TeWm2KF7nJDWJomhVJMu5KHRl0jjDbyHq8vbMIdxsNr8cenGkq9Ki0WAmiR-sd9Rp3DOdlWTs8Ixj4S8jX82CLmeouHt4wYYu-nJxYlo97GALFzfVXtIbxDQq4rQJQ6oJn7LatUVQ9v9qmPX-QVqY3f92URiq8-_7ngCkt8Ut7AoZKj1QkCgNGYTIfcmPdOqMekccVc8h1nr-BFVF3avbrdn3wpv-4R7PxGounUhgcjJfU64BrqFdCnjrsaSIv0jxwJpADTi6xkkuP7yhY9j_IPAsYNxaoG8rVTqL5kIFfQ38IiMWTznUc2BOCsIsNhe_Y1CBZQZXY8Knv6oO4bhz0cE4NJd0EFWo9xeB-VLF5u2I-8',
    'Accept-Language': 'en'
     }
     };
      var req = http.request(options, function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
    chunks.push(chunk);
    });

    res.on("end", function (chunk) {
     var body = Buffer.concat(chunks);
    console.log(body.toString());
    });

    res.on("error", function (error) {
    console.error(error);
    });
    });
                            ```
  
**Get Form by ID**
----
  Returns json data of a forms.

* **URL**

  `http://3.6.99.164:5000/api/form/form/:form_id`

* **Method:**

  `GET`
  
* **Header**

    ```'headers': {
    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6Ijk1OGNiZDdlZmQ4ODhjZDdlZmQ0OTJiZjIyNDhlNGIyYzZhZWVhOGJkMTAzMjMwMjQ4ZGUxZmYyODk3MmZkOWIyYmE2ODYwNDQxM2YwNDQ2In0.eyJhdWQiOiIxMCIsImp0aSI6Ijk1OGNiZDdlZmQ4ODhjZDdlZmQ0OTJiZjIyNDhlNGIyYzZhZWVhOGJkMTAzMjMwMjQ4ZGUxZmYyODk3MmZkOWIyYmE2ODYwNDQxM2YwNDQ2IiwiaWF0IjoxNTkwNjY3MjcyLCJuYmYiOjE1OTA2NjcyNzIsImV4cCI6MTU5MTk2MzI3MSwic3ViIjoiMTMiLCJzY29wZXMiOlsiIl19.vmnBdh-CQlVgA7brO9dukT3lIrRwCWOrcTq3l_pRg_7VvJdIgsCEwVpF_eXe5dYbmJ6u5F8L2vbcXx3ZjdfBCrBYGBEbYAnPfGemFLK5LxDR1kQOZ89Ervhgnqj_4quGdW5axgstsm2rMDcSKGawQ5uGrOeYOHT4w2m4zxl5uruPCNUWA0kjhlto8m7YgkD88umB2sjRXooWuvME9EaeHiQUoHkzAGEuptpXXzmFyGTmdJ0LH07AZDK5HI5dig9AHNSdnHTnGWdAfmEKJX_lqOfiAaphnV-FYEZmS-6DdLdY662qtAS5tIZY2ch0TeWm2KF7nJDWJomhVJMu5KHRl0jjDbyHq8vbMIdxsNr8cenGkq9Ki0WAmiR-sd9Rp3DOdlWTs8Ixj4S8jX82CLmeouHt4wYYu-nJxYlo97GALFzfVXtIbxDQq4rQJQ6oJn7LatUVQ9v9qmPX-QVqY3f92URiq8-_7ngCkt8Ut7AoZKj1QkCgNGYTIfcmPdOqMekccVc8h1nr-BFVF3avbrdn3wpv-4R7PxGounUhgcjJfU64BrqFdCnjrsaSIv0jxwJpADTi6xkkuP7yhY9j_IPAsYNxaoG8rVTqL5kIFfQ38IiMWTznUc2BOCsIsNhe_Y1CBZQZXY8Knv6oO4bhz0cE4NJd0EFWo9xeB-VLF5u2I-8',
    'Accept-Language': 'en'
  }
  ```
  
  
*  **URL Params**
    
    None

   **Required:**
 
   None

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
    ```json
       {
    "_id": "5ee0d58cb1591220e861c5a0",
    "title": "Received 2",
    "description": "Form description ",
    "fields": [
    {
      "field_title": "Primari sanitization worker",
      "values": [],
      "_id": "5ee0d58cb1591220e861c5aa",
      "name": "primary_worker",
      "type": "String",
      "required": true
    },
    {
      "field_title": "Write about your work so far",
      "values": [],
      "_id": "5ee0d58cb1591220e861c5a9",
      "name": "about_work",
      "type": "MultilineString",
      "required": true
    },
    {
      "field_title": "Composed weight in english",
      "values": [],
      "_id": "5ee0d58cb1591220e861c5a8",
      "name": "weight_comp",
      "type": "Number",
      "required": true
    },
    {
      "field_title": "Choose your facilities",
      "values": [
        {
          "id": 1,
          "label": "MCC",
          "city_id": 1
        },
        {
          "id": 2,
          "label": "MRF",
          "city_id": 1
        },
        {
          "id": 3,
          "label": "OCC",
          "city_id": 1
        },
        {
          "id": 4,
          "label": "MCU",
          "city_id": 1
        },
        {
          "id": 5,
          "label": "Landfill",
          "city_id": 1
        }
      ],
      "_id": "5ee0d58cb1591220e861c5a7",
      "name": "facilities",
      "type": "Checkbox",
      "required": true,
      "action": "api",
      "end_point": "http://qadataapi.icmyc.com/facilitytype",
      "query": ""
    },
    {
      "field_title": "Choose field type",
      "values": [
        {
          "id": 1,
          "label": "Commercial"
        },
        {
          "id": 2,
          "label": "Industrial"
        }
      ],
      "_id": "5ee0d58cb1591220e861c5a6",
      "name": "field_type",
      "type": "Radio",
      "required": true,
      "action": "local"
    },
    {
      "field_title": "Vehicle type in english ",
      "values": [
        {
          "id": 1,
          "label": "Tricycle",
          "city_id": 1
        },
        {
          "id": 2,
          "label": "Pushcart",
          "city_id": 1
        },
        {
          "id": 3,
          "label": "Tractor",
          "city_id": 1
        },
        {
          "id": 4,
          "label": "LCV (TATA ACE)",
          "city_id": 1
        },
        {
          "id": 5,
          "label": "Battery Operated Vehicle (BOV)",
          "city_id": 1
        }
      ],
      "_id": "5ee0d58cb1591220e861c5a5",
      "name": "vehicle_type",
      "type": "Select",
      "required": true,
      "action": "api",
      "end_point": "http://qadataapi.icmyc.com/vehicletype",
      "query": ""
    }
    ],
    "created_at": "2020-06-10T12:43:56.134Z"
    }
    ```
 
* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ message : "Server Error" }`

* **Sample Call:**
  ```
    var http = require('http');

    var options = {
    'method': 'GET',
    'hostname': '3.6.99.164',
    'path': '/api/form/form/5ee0d58cb1591220e861c5a0',
    'headers': {
    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6Ijk1OGNiZDdlZmQ4ODhjZDdlZmQ0OTJiZjIyNDhlNGIyYzZhZWVhOGJkMTAzMjMwMjQ4ZGUxZmYyODk3MmZkOWIyYmE2ODYwNDQxM2YwNDQ2In0.eyJhdWQiOiIxMCIsImp0aSI6Ijk1OGNiZDdlZmQ4ODhjZDdlZmQ0OTJiZjIyNDhlNGIyYzZhZWVhOGJkMTAzMjMwMjQ4ZGUxZmYyODk3MmZkOWIyYmE2ODYwNDQxM2YwNDQ2IiwiaWF0IjoxNTkwNjY3MjcyLCJuYmYiOjE1OTA2NjcyNzIsImV4cCI6MTU5MTk2MzI3MSwic3ViIjoiMTMiLCJzY29wZXMiOlsiIl19.vmnBdh-CQlVgA7brO9dukT3lIrRwCWOrcTq3l_pRg_7VvJdIgsCEwVpF_eXe5dYbmJ6u5F8L2vbcXx3ZjdfBCrBYGBEbYAnPfGemFLK5LxDR1kQOZ89Ervhgnqj_4quGdW5axgstsm2rMDcSKGawQ5uGrOeYOHT4w2m4zxl5uruPCNUWA0kjhlto8m7YgkD88umB2sjRXooWuvME9EaeHiQUoHkzAGEuptpXXzmFyGTmdJ0LH07AZDK5HI5dig9AHNSdnHTnGWdAfmEKJX_lqOfiAaphnV-FYEZmS-6DdLdY662qtAS5tIZY2ch0TeWm2KF7nJDWJomhVJMu5KHRl0jjDbyHq8vbMIdxsNr8cenGkq9Ki0WAmiR-sd9Rp3DOdlWTs8Ixj4S8jX82CLmeouHt4wYYu-nJxYlo97GALFzfVXtIbxDQq4rQJQ6oJn7LatUVQ9v9qmPX-QVqY3f92URiq8-_7ngCkt8Ut7AoZKj1QkCgNGYTIfcmPdOqMekccVc8h1nr-BFVF3avbrdn3wpv-4R7PxGounUhgcjJfU64BrqFdCnjrsaSIv0jxwJpADTi6xkkuP7yhY9j_IPAsYNxaoG8rVTqL5kIFfQ38IiMWTznUc2BOCsIsNhe_Y1CBZQZXY8Knv6oO4bhz0cE4NJd0EFWo9xeB-VLF5u2I-8',
    'Accept-Language': 'en'
    }
        };

    var req = http.request(options, function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
    chunks.push(chunk);
    });

    res.on("end", function (chunk) {
     var body = Buffer.concat(chunks);
    console.log(body.toString());
    });

    res.on("error", function (error) {
    console.error(error);
    });
    });
    ```
  


**Create Form**
----
  Returns json data of a forms.

* **URL**

  `http://3.6.99.164:5000/api/form/create_form`

* **Method:**

  `POST`
  
* **Header**

    ```'headers': {
    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6Ijk1OGNiZDdlZmQ4ODhjZDdlZmQ0OTJiZjIyNDhlNGIyYzZhZWVhOGJkMTAzMjMwMjQ4ZGUxZmYyODk3MmZkOWIyYmE2ODYwNDQxM2YwNDQ2In0.eyJhdWQiOiIxMCIsImp0aSI6Ijk1OGNiZDdlZmQ4ODhjZDdlZmQ0OTJiZjIyNDhlNGIyYzZhZWVhOGJkMTAzMjMwMjQ4ZGUxZmYyODk3MmZkOWIyYmE2ODYwNDQxM2YwNDQ2IiwiaWF0IjoxNTkwNjY3MjcyLCJuYmYiOjE1OTA2NjcyNzIsImV4cCI6MTU5MTk2MzI3MSwic3ViIjoiMTMiLCJzY29wZXMiOlsiIl19.vmnBdh-CQlVgA7brO9dukT3lIrRwCWOrcTq3l_pRg_7VvJdIgsCEwVpF_eXe5dYbmJ6u5F8L2vbcXx3ZjdfBCrBYGBEbYAnPfGemFLK5LxDR1kQOZ89Ervhgnqj_4quGdW5axgstsm2rMDcSKGawQ5uGrOeYOHT4w2m4zxl5uruPCNUWA0kjhlto8m7YgkD88umB2sjRXooWuvME9EaeHiQUoHkzAGEuptpXXzmFyGTmdJ0LH07AZDK5HI5dig9AHNSdnHTnGWdAfmEKJX_lqOfiAaphnV-FYEZmS-6DdLdY662qtAS5tIZY2ch0TeWm2KF7nJDWJomhVJMu5KHRl0jjDbyHq8vbMIdxsNr8cenGkq9Ki0WAmiR-sd9Rp3DOdlWTs8Ixj4S8jX82CLmeouHt4wYYu-nJxYlo97GALFzfVXtIbxDQq4rQJQ6oJn7LatUVQ9v9qmPX-QVqY3f92URiq8-_7ngCkt8Ut7AoZKj1QkCgNGYTIfcmPdOqMekccVc8h1nr-BFVF3avbrdn3wpv-4R7PxGounUhgcjJfU64BrqFdCnjrsaSIv0jxwJpADTi6xkkuP7yhY9j_IPAsYNxaoG8rVTqL5kIFfQ38IiMWTznUc2BOCsIsNhe_Y1CBZQZXY8Knv6oO4bhz0cE4NJd0EFWo9xeB-VLF5u2I-8',
    'Accept-Language': 'en'
  }
  ```
  
  
*  **URL Params**
    
    None

   **Required:**
 
   None

* **Data Params**
    `Pass the json object of the form to be created into the form body`
    ```
    {
    "title": [ {"id":1, "code":"en","label":"Received"},{"id":2, "code":"hi","label":"प्राप्त किया"} ],
    "description":[ {"id":1, "code":"en","label":"Form description "},{"id":2, "code":"hi","label":"Form description in Hindi 2"} ],
    "role":[{"value":"Facility Manager"}],
    "state":[{"value":"Maharastra"}],
    "city":[{"value":"Pune"}],
    "type":[{"value":"MCC"}],
    "fields" : [
        {
            "title": [ {"id":1, "code":"en","label":"Primari sanitization worker"},{"id":2, "code":"hi","label":"Primari sanitization worker(Hindi)"} ],
            "name": "primary_worker",
            "type": "String",
            "required":true,
        	"values": []
            
        },
        {
            "title": [ {"id":1, "code":"en","label":"Write about your work so far"},{"id":2, "code":"hi","label":"Write about your work so far (Hindi)"} ],
            "name": "about_work",
            "type": "MultilineString",
            "required":true,
        	"values": []
            
        },
        {
            "title": [ {"id":1, "code":"en","label":"Composed weight in english"},{"id":2, "code":"hi","label":"Composed weight in Hindi"} ],
            "name": "weight_comp",
            "type": "Number",
            "required":true,
        	"values": []
            
        },
        {
            "title": [ {"id":1, "code":"en","label":"Choose your facilities"},{"id":2, "code":"hi","label":"Chose your facilities:  Hindi"} ],
            "name": "facilities",
            "type": "Checkbox",
            "required":true,
             "action": "api",
            "end_point": "http://qadataapi.icmyc.com/facilitytype",
            "query": "",
        	"values": []
            
        },
        {
            "title": [ {"id":1, "code":"en","label":"Choose field type"},{"id":2, "code":"hi","label":"Chose field type:  Hindi"} ],
            "name": "field_type",
            "type": "Radio",
            "required":true,
        	"action": "local",
        	"values": [ { "id":1, "label":"Commercial"},{ "id":2, "label":"Industrial"} ]
            
        },
        {
            "title": [ {"id":1, "code":"en","label":"Vehicle type in english "},{"id":2, "code":"hi","label":"Vehicle type in Hindi"} ],
            "name": "vehicle_type",
            "type": "Select",
            "required":true,
            "action": "api",
            "end_point": "http://qadataapi.icmyc.com/vehicletype",
            "query": "",
        	"values": []
            
        }
        
    ]

}
    ```

* **Success Response:**
  `Returns created form object`  
  * **Code:** 200 <br />
    **Content:** 
    ```json
    {"_id":"5ee0d58cb1591220e861c5a0","title":"Received 2","description":"Form description ","fields":[{"field_title":"Primari sanitization worker","values":[],"_id":"5ee0d58cb1591220e861c5aa","name":"primary_worker","type":"String","required":true},{"field_title":"Write about your work so far","values":[],"_id":"5ee0d58cb1591220e861c5a9","name":"about_work","type":"MultilineString","required":true},{"field_title":"Composed weight in english","values":[],"_id":"5ee0d58cb1591220e861c5a8","name":"weight_comp","type":"Number","required":true},{"field_title":"Choose your facilities","values":[{"id":1,"label":"MCC","city_id":1},{"id":2,"label":"MRF","city_id":1},{"id":3,"label":"OCC","city_id":1},{"id":4,"label":"MCU","city_id":1},{"id":5,"label":"Landfill","city_id":1}],"_id":"5ee0d58cb1591220e861c5a7","name":"facilities","type":"Checkbox","required":true,"action":"api","end_point":"http://qadataapi.icmyc.com/facilitytype","query":""},{"field_title":"Choose field type","values":[{"id":1,"label":"Commercial"},{"id":2,"label":"Industrial"}],"_id":"5ee0d58cb1591220e861c5a6","name":"field_type","type":"Radio","required":true,"action":"local"},{"field_title":"Vehicle type in english ","values":[{"id":1,"label":"Tricycle","city_id":1},{"id":2,"label":"Pushcart","city_id":1},{"id":3,"label":"Tractor","city_id":1},{"id":4,"label":"LCV (TATA ACE)","city_id":1},{"id":5,"label":"Battery Operated Vehicle (BOV)","city_id":1}],"_id":"5ee0d58cb1591220e861c5a5","name":"vehicle_type","type":"Select","required":true,"action":"api","end_point":"http://qadataapi.icmyc.com/vehicletype","query":""}],"created_at":"2020-06-10T12:43:56.134Z"}
    ```
 
* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ message : "Server Error" }`

* **Sample Call:**
  ```
    var http = require('http');

    var options = {
    'method': 'POST',
    'hostname': '3.6.99.164',
    'path': '/api/form/create_form',
    'headers': {
    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6Ijk1OGNiZDdlZmQ4ODhjZDdlZmQ0OTJiZjIyNDhlNGIyYzZhZWVhOGJkMTAzMjMwMjQ4ZGUxZmYyODk3MmZkOWIyYmE2ODYwNDQxM2YwNDQ2In0.eyJhdWQiOiIxMCIsImp0aSI6Ijk1OGNiZDdlZmQ4ODhjZDdlZmQ0OTJiZjIyNDhlNGIyYzZhZWVhOGJkMTAzMjMwMjQ4ZGUxZmYyODk3MmZkOWIyYmE2ODYwNDQxM2YwNDQ2IiwiaWF0IjoxNTkwNjY3MjcyLCJuYmYiOjE1OTA2NjcyNzIsImV4cCI6MTU5MTk2MzI3MSwic3ViIjoiMTMiLCJzY29wZXMiOlsiIl19.vmnBdh-CQlVgA7brO9dukT3lIrRwCWOrcTq3l_pRg_7VvJdIgsCEwVpF_eXe5dYbmJ6u5F8L2vbcXx3ZjdfBCrBYGBEbYAnPfGemFLK5LxDR1kQOZ89Ervhgnqj_4quGdW5axgstsm2rMDcSKGawQ5uGrOeYOHT4w2m4zxl5uruPCNUWA0kjhlto8m7YgkD88umB2sjRXooWuvME9EaeHiQUoHkzAGEuptpXXzmFyGTmdJ0LH07AZDK5HI5dig9AHNSdnHTnGWdAfmEKJX_lqOfiAaphnV-FYEZmS-6DdLdY662qtAS5tIZY2ch0TeWm2KF7nJDWJomhVJMu5KHRl0jjDbyHq8vbMIdxsNr8cenGkq9Ki0WAmiR-sd9Rp3DOdlWTs8Ixj4S8jX82CLmeouHt4wYYu-nJxYlo97GALFzfVXtIbxDQq4rQJQ6oJn7LatUVQ9v9qmPX-QVqY3f92URiq8-_7ngCkt8Ut7AoZKj1QkCgNGYTIfcmPdOqMekccVc8h1nr-BFVF3avbrdn3wpv-4R7PxGounUhgcjJfU64BrqFdCnjrsaSIv0jxwJpADTi6xkkuP7yhY9j_IPAsYNxaoG8rVTqL5kIFfQ38IiMWTznUc2BOCsIsNhe_Y1CBZQZXY8Knv6oO4bhz0cE4NJd0EFWo9xeB-VLF5u2I-8',
    'Accept-Language': 'en'
    }
        };

    var req = http.request(options, function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
    chunks.push(chunk);
    });

    res.on("end", function (chunk) {
     var body = Buffer.concat(chunks);
    console.log(body.toString());
    });

    res.on("error", function (error) {
    console.error(error);
    });
    });
  ``` 

**Update Form**
----
  Update an existing form object.

* **URL**

  `http://3.6.99.164:5000/api/form/update_form/:form_id`

* **Method:**

  `POST`
  
* **Header**

    ```'headers': {
    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6Ijk1OGNiZDdlZmQ4ODhjZDdlZmQ0OTJiZjIyNDhlNGIyYzZhZWVhOGJkMTAzMjMwMjQ4ZGUxZmYyODk3MmZkOWIyYmE2ODYwNDQxM2YwNDQ2In0.eyJhdWQiOiIxMCIsImp0aSI6Ijk1OGNiZDdlZmQ4ODhjZDdlZmQ0OTJiZjIyNDhlNGIyYzZhZWVhOGJkMTAzMjMwMjQ4ZGUxZmYyODk3MmZkOWIyYmE2ODYwNDQxM2YwNDQ2IiwiaWF0IjoxNTkwNjY3MjcyLCJuYmYiOjE1OTA2NjcyNzIsImV4cCI6MTU5MTk2MzI3MSwic3ViIjoiMTMiLCJzY29wZXMiOlsiIl19.vmnBdh-CQlVgA7brO9dukT3lIrRwCWOrcTq3l_pRg_7VvJdIgsCEwVpF_eXe5dYbmJ6u5F8L2vbcXx3ZjdfBCrBYGBEbYAnPfGemFLK5LxDR1kQOZ89Ervhgnqj_4quGdW5axgstsm2rMDcSKGawQ5uGrOeYOHT4w2m4zxl5uruPCNUWA0kjhlto8m7YgkD88umB2sjRXooWuvME9EaeHiQUoHkzAGEuptpXXzmFyGTmdJ0LH07AZDK5HI5dig9AHNSdnHTnGWdAfmEKJX_lqOfiAaphnV-FYEZmS-6DdLdY662qtAS5tIZY2ch0TeWm2KF7nJDWJomhVJMu5KHRl0jjDbyHq8vbMIdxsNr8cenGkq9Ki0WAmiR-sd9Rp3DOdlWTs8Ixj4S8jX82CLmeouHt4wYYu-nJxYlo97GALFzfVXtIbxDQq4rQJQ6oJn7LatUVQ9v9qmPX-QVqY3f92URiq8-_7ngCkt8Ut7AoZKj1QkCgNGYTIfcmPdOqMekccVc8h1nr-BFVF3avbrdn3wpv-4R7PxGounUhgcjJfU64BrqFdCnjrsaSIv0jxwJpADTi6xkkuP7yhY9j_IPAsYNxaoG8rVTqL5kIFfQ38IiMWTznUc2BOCsIsNhe_Y1CBZQZXY8Knv6oO4bhz0cE4NJd0EFWo9xeB-VLF5u2I-8',
    'Accept-Language': 'en'
  }
  ```
  
  
*  **URL Params**
    
    None

   **Required:**
 
   None

* **Data Params**
    `Pass the json object of the form to be update into the form body`
    ```
    {
    "title": [ {"id":1, "code":"en","label":"Received"},{"id":2, "code":"hi","label":"प्राप्त किया"} ],
    "description":[ {"id":1, "code":"en","label":"Form description "},{"id":2, "code":"hi","label":"Form description in Hindi 2"} ],
    "role":[{"value":"Facility Manager"}],
    "state":[{"value":"Maharastra"}],
    "city":[{"value":"Pune"}],
    "type":[{"value":"MCC"}],
    "fields" : [
        {
            "title": [ {"id":1, "code":"en","label":"Primari sanitization worker"},{"id":2, "code":"hi","label":"Primari sanitization worker(Hindi)"} ],
            "name": "primary_worker",
            "type": "String",
            "required":true,
        	"values": []
            
        },
        {
            "title": [ {"id":1, "code":"en","label":"Write about your work so far"},{"id":2, "code":"hi","label":"Write about your work so far (Hindi)"} ],
            "name": "about_work",
            "type": "MultilineString",
            "required":true,
        	"values": []
            
        },
        {
            "title": [ {"id":1, "code":"en","label":"Composed weight in english"},{"id":2, "code":"hi","label":"Composed weight in Hindi"} ],
            "name": "weight_comp",
            "type": "Number",
            "required":true,
        	"values": []
            
        },
        {
            "title": [ {"id":1, "code":"en","label":"Choose your facilities"},{"id":2, "code":"hi","label":"Chose your facilities:  Hindi"} ],
            "name": "facilities",
            "type": "Checkbox",
            "required":true,
             "action": "api",
            "end_point": "http://qadataapi.icmyc.com/facilitytype",
            "query": "",
        	"values": []
            
        },
        {
            "title": [ {"id":1, "code":"en","label":"Choose field type"},{"id":2, "code":"hi","label":"Chose field type:  Hindi"} ],
            "name": "field_type",
            "type": "Radio",
            "required":true,
        	"action": "local",
        	"values": [ { "id":1, "label":"Commercial"},{ "id":2, "label":"Industrial"} ]
            
        },
        {
            "title": [ {"id":1, "code":"en","label":"Vehicle type in english "},{"id":2, "code":"hi","label":"Vehicle type in Hindi"} ],
            "name": "vehicle_type",
            "type": "Select",
            "required":true,
            "action": "api",
            "end_point": "http://qadataapi.icmyc.com/vehicletype",
            "query": "",
        	"values": []
            
        }
        
    ]

    }
    ```

* **Success Response:**
  `Returns updated form object`  
  * **Code:** 200 <br />
    **Content:** 
    ```json
        {
    "_id": "5ee0d58cb1591220e861c5a0",
    "title": "Received 2",
    "description": "Form description ",
    "fields": [
    {
      "field_title": "Primari sanitization worker",
      "values": [],
      "_id": "5ee0d58cb1591220e861c5aa",
      "name": "primary_worker",
      "type": "String",
      "required": true
    },
    {
      "field_title": "Write about your work so far",
      "values": [],
      "_id": "5ee0d58cb1591220e861c5a9",
      "name": "about_work",
      "type": "MultilineString",
      "required": true
    },
    {
      "field_title": "Composed weight in english",
      "values": [],
      "_id": "5ee0d58cb1591220e861c5a8",
      "name": "weight_comp",
      "type": "Number",
      "required": true
    },
    {
      "field_title": "Choose your facilities",
      "values": [
        {
          "id": 1,
          "label": "MCC",
          "city_id": 1
        },
        {
          "id": 2,
          "label": "MRF",
          "city_id": 1
        },
        {
          "id": 3,
          "label": "OCC",
          "city_id": 1
        },
        {
          "id": 4,
          "label": "MCU",
          "city_id": 1
        },
        {
          "id": 5,
          "label": "Landfill",
          "city_id": 1
        }
      ],
      "_id": "5ee0d58cb1591220e861c5a7",
      "name": "facilities",
      "type": "Checkbox",
      "required": true,
      "action": "api",
      "end_point": "http://qadataapi.icmyc.com/facilitytype",
      "query": ""
    },
    {
      "field_title": "Choose field type",
      "values": [
        {
          "id": 1,
          "label": "Commercial"
        },
        {
          "id": 2,
          "label": "Industrial"
        }
      ],
      "_id": "5ee0d58cb1591220e861c5a6",
      "name": "field_type",
      "type": "Radio",
      "required": true,
      "action": "local"
    },
    {
      "field_title": "Vehicle type in english ",
      "values": [
        {
          "id": 1,
          "label": "Tricycle",
          "city_id": 1
        },
        {
          "id": 2,
          "label": "Pushcart",
          "city_id": 1
        },
        {
          "id": 3,
          "label": "Tractor",
          "city_id": 1
        },
        {
          "id": 4,
          "label": "LCV (TATA ACE)",
          "city_id": 1
        },
        {
          "id": 5,
          "label": "Battery Operated Vehicle (BOV)",
          "city_id": 1
        }
      ],
      "_id": "5ee0d58cb1591220e861c5a5",
      "name": "vehicle_type",
      "type": "Select",
      "required": true,
      "action": "api",
      "end_point": "http://qadataapi.icmyc.com/vehicletype",
      "query": ""
    }
    ],
    "created_at": "2020-06-10T12:43:56.134Z"
    }
    ```
 
* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ message : "Server Error" }`

* **Sample Call:**
  ```
    var http = require('http');

    var options = {
    'method': 'POST',
    'hostname': '3.6.99.164',
    'path': '/api/form/update_form/5ef43ed7c803be31e8e4624e',
    'headers': {
    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6Ijk1OGNiZDdlZmQ4ODhjZDdlZmQ0OTJiZjIyNDhlNGIyYzZhZWVhOGJkMTAzMjMwMjQ4ZGUxZmYyODk3MmZkOWIyYmE2ODYwNDQxM2YwNDQ2In0.eyJhdWQiOiIxMCIsImp0aSI6Ijk1OGNiZDdlZmQ4ODhjZDdlZmQ0OTJiZjIyNDhlNGIyYzZhZWVhOGJkMTAzMjMwMjQ4ZGUxZmYyODk3MmZkOWIyYmE2ODYwNDQxM2YwNDQ2IiwiaWF0IjoxNTkwNjY3MjcyLCJuYmYiOjE1OTA2NjcyNzIsImV4cCI6MTU5MTk2MzI3MSwic3ViIjoiMTMiLCJzY29wZXMiOlsiIl19.vmnBdh-CQlVgA7brO9dukT3lIrRwCWOrcTq3l_pRg_7VvJdIgsCEwVpF_eXe5dYbmJ6u5F8L2vbcXx3ZjdfBCrBYGBEbYAnPfGemFLK5LxDR1kQOZ89Ervhgnqj_4quGdW5axgstsm2rMDcSKGawQ5uGrOeYOHT4w2m4zxl5uruPCNUWA0kjhlto8m7YgkD88umB2sjRXooWuvME9EaeHiQUoHkzAGEuptpXXzmFyGTmdJ0LH07AZDK5HI5dig9AHNSdnHTnGWdAfmEKJX_lqOfiAaphnV-FYEZmS-6DdLdY662qtAS5tIZY2ch0TeWm2KF7nJDWJomhVJMu5KHRl0jjDbyHq8vbMIdxsNr8cenGkq9Ki0WAmiR-sd9Rp3DOdlWTs8Ixj4S8jX82CLmeouHt4wYYu-nJxYlo97GALFzfVXtIbxDQq4rQJQ6oJn7LatUVQ9v9qmPX-QVqY3f92URiq8-_7ngCkt8Ut7AoZKj1QkCgNGYTIfcmPdOqMekccVc8h1nr-BFVF3avbrdn3wpv-4R7PxGounUhgcjJfU64BrqFdCnjrsaSIv0jxwJpADTi6xkkuP7yhY9j_IPAsYNxaoG8rVTqL5kIFfQ38IiMWTznUc2BOCsIsNhe_Y1CBZQZXY8Knv6oO4bhz0cE4NJd0EFWo9xeB-VLF5u2I-8',
    'Accept-Language': 'en'
    }
        };

    var req = http.request(options, function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
    chunks.push(chunk);
    });

    res.on("end", function (chunk) {
     var body = Buffer.concat(chunks);
    console.log(body.toString());
    });

    res.on("error", function (error) {
    console.error(error);
    });
    });
  ``` 


**Delete Form**
----
  Delete an existing form.

* **URL**

  `http://3.6.99.164:5000/api/form/delete_form/:form_id`

* **Method:**

  `POST`
  
* **Header**

    ```'headers': {
    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6Ijk1OGNiZDdlZmQ4ODhjZDdlZmQ0OTJiZjIyNDhlNGIyYzZhZWVhOGJkMTAzMjMwMjQ4ZGUxZmYyODk3MmZkOWIyYmE2ODYwNDQxM2YwNDQ2In0.eyJhdWQiOiIxMCIsImp0aSI6Ijk1OGNiZDdlZmQ4ODhjZDdlZmQ0OTJiZjIyNDhlNGIyYzZhZWVhOGJkMTAzMjMwMjQ4ZGUxZmYyODk3MmZkOWIyYmE2ODYwNDQxM2YwNDQ2IiwiaWF0IjoxNTkwNjY3MjcyLCJuYmYiOjE1OTA2NjcyNzIsImV4cCI6MTU5MTk2MzI3MSwic3ViIjoiMTMiLCJzY29wZXMiOlsiIl19.vmnBdh-CQlVgA7brO9dukT3lIrRwCWOrcTq3l_pRg_7VvJdIgsCEwVpF_eXe5dYbmJ6u5F8L2vbcXx3ZjdfBCrBYGBEbYAnPfGemFLK5LxDR1kQOZ89Ervhgnqj_4quGdW5axgstsm2rMDcSKGawQ5uGrOeYOHT4w2m4zxl5uruPCNUWA0kjhlto8m7YgkD88umB2sjRXooWuvME9EaeHiQUoHkzAGEuptpXXzmFyGTmdJ0LH07AZDK5HI5dig9AHNSdnHTnGWdAfmEKJX_lqOfiAaphnV-FYEZmS-6DdLdY662qtAS5tIZY2ch0TeWm2KF7nJDWJomhVJMu5KHRl0jjDbyHq8vbMIdxsNr8cenGkq9Ki0WAmiR-sd9Rp3DOdlWTs8Ixj4S8jX82CLmeouHt4wYYu-nJxYlo97GALFzfVXtIbxDQq4rQJQ6oJn7LatUVQ9v9qmPX-QVqY3f92URiq8-_7ngCkt8Ut7AoZKj1QkCgNGYTIfcmPdOqMekccVc8h1nr-BFVF3avbrdn3wpv-4R7PxGounUhgcjJfU64BrqFdCnjrsaSIv0jxwJpADTi6xkkuP7yhY9j_IPAsYNxaoG8rVTqL5kIFfQ38IiMWTznUc2BOCsIsNhe_Y1CBZQZXY8Knv6oO4bhz0cE4NJd0EFWo9xeB-VLF5u2I-8',
    'Accept-Language': 'en'
  }
  ```
  
  
*  **URL Params**
    
    None

   **Required:**
 
   None

* **Data Params**
    `None`

* **Success Response:**
  `Returns updated form object`  
  * **Code:** 200 <br />
    **Content:** 
    ```json
        {
            "success": true,
            "message": "Form deleted"
        }
    ```
 
* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ message : "Server Error" }`

* **Sample Call:**
  ```
    var http = require('http');

    var options = {
    'method': 'POST',
    'hostname': '3.6.99.164',
    'path': '/api/form/delete_form/5ef43ed7c803be31e8e4624e',
    'headers': {
    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6Ijk1OGNiZDdlZmQ4ODhjZDdlZmQ0OTJiZjIyNDhlNGIyYzZhZWVhOGJkMTAzMjMwMjQ4ZGUxZmYyODk3MmZkOWIyYmE2ODYwNDQxM2YwNDQ2In0.eyJhdWQiOiIxMCIsImp0aSI6Ijk1OGNiZDdlZmQ4ODhjZDdlZmQ0OTJiZjIyNDhlNGIyYzZhZWVhOGJkMTAzMjMwMjQ4ZGUxZmYyODk3MmZkOWIyYmE2ODYwNDQxM2YwNDQ2IiwiaWF0IjoxNTkwNjY3MjcyLCJuYmYiOjE1OTA2NjcyNzIsImV4cCI6MTU5MTk2MzI3MSwic3ViIjoiMTMiLCJzY29wZXMiOlsiIl19.vmnBdh-CQlVgA7brO9dukT3lIrRwCWOrcTq3l_pRg_7VvJdIgsCEwVpF_eXe5dYbmJ6u5F8L2vbcXx3ZjdfBCrBYGBEbYAnPfGemFLK5LxDR1kQOZ89Ervhgnqj_4quGdW5axgstsm2rMDcSKGawQ5uGrOeYOHT4w2m4zxl5uruPCNUWA0kjhlto8m7YgkD88umB2sjRXooWuvME9EaeHiQUoHkzAGEuptpXXzmFyGTmdJ0LH07AZDK5HI5dig9AHNSdnHTnGWdAfmEKJX_lqOfiAaphnV-FYEZmS-6DdLdY662qtAS5tIZY2ch0TeWm2KF7nJDWJomhVJMu5KHRl0jjDbyHq8vbMIdxsNr8cenGkq9Ki0WAmiR-sd9Rp3DOdlWTs8Ixj4S8jX82CLmeouHt4wYYu-nJxYlo97GALFzfVXtIbxDQq4rQJQ6oJn7LatUVQ9v9qmPX-QVqY3f92URiq8-_7ngCkt8Ut7AoZKj1QkCgNGYTIfcmPdOqMekccVc8h1nr-BFVF3avbrdn3wpv-4R7PxGounUhgcjJfU64BrqFdCnjrsaSIv0jxwJpADTi6xkkuP7yhY9j_IPAsYNxaoG8rVTqL5kIFfQ38IiMWTznUc2BOCsIsNhe_Y1CBZQZXY8Knv6oO4bhz0cE4NJd0EFWo9xeB-VLF5u2I-8',
    'Accept-Language': 'en'
    }
        };

    var req = http.request(options, function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
    chunks.push(chunk);
    });

    res.on("end", function (chunk) {
     var body = Buffer.concat(chunks);
    console.log(body.toString());
    });

    res.on("error", function (error) {
    console.error(error);
    });
    });
  ``` 
  

**Record form response**
----
  Returns json data of recorded response.

* **URL**

  `http://3.6.99.164:5000/api/form/record_response`

* **Method:**

  `POST`
  
* **Header**

    ```'headers': {
    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6Ijk1OGNiZDdlZmQ4ODhjZDdlZmQ0OTJiZjIyNDhlNGIyYzZhZWVhOGJkMTAzMjMwMjQ4ZGUxZmYyODk3MmZkOWIyYmE2ODYwNDQxM2YwNDQ2In0.eyJhdWQiOiIxMCIsImp0aSI6Ijk1OGNiZDdlZmQ4ODhjZDdlZmQ0OTJiZjIyNDhlNGIyYzZhZWVhOGJkMTAzMjMwMjQ4ZGUxZmYyODk3MmZkOWIyYmE2ODYwNDQxM2YwNDQ2IiwiaWF0IjoxNTkwNjY3MjcyLCJuYmYiOjE1OTA2NjcyNzIsImV4cCI6MTU5MTk2MzI3MSwic3ViIjoiMTMiLCJzY29wZXMiOlsiIl19.vmnBdh-CQlVgA7brO9dukT3lIrRwCWOrcTq3l_pRg_7VvJdIgsCEwVpF_eXe5dYbmJ6u5F8L2vbcXx3ZjdfBCrBYGBEbYAnPfGemFLK5LxDR1kQOZ89Ervhgnqj_4quGdW5axgstsm2rMDcSKGawQ5uGrOeYOHT4w2m4zxl5uruPCNUWA0kjhlto8m7YgkD88umB2sjRXooWuvME9EaeHiQUoHkzAGEuptpXXzmFyGTmdJ0LH07AZDK5HI5dig9AHNSdnHTnGWdAfmEKJX_lqOfiAaphnV-FYEZmS-6DdLdY662qtAS5tIZY2ch0TeWm2KF7nJDWJomhVJMu5KHRl0jjDbyHq8vbMIdxsNr8cenGkq9Ki0WAmiR-sd9Rp3DOdlWTs8Ixj4S8jX82CLmeouHt4wYYu-nJxYlo97GALFzfVXtIbxDQq4rQJQ6oJn7LatUVQ9v9qmPX-QVqY3f92URiq8-_7ngCkt8Ut7AoZKj1QkCgNGYTIfcmPdOqMekccVc8h1nr-BFVF3avbrdn3wpv-4R7PxGounUhgcjJfU64BrqFdCnjrsaSIv0jxwJpADTi6xkkuP7yhY9j_IPAsYNxaoG8rVTqL5kIFfQ38IiMWTznUc2BOCsIsNhe_Y1CBZQZXY8Knv6oO4bhz0cE4NJd0EFWo9xeB-VLF5u2I-8',
    'Accept-Language': 'en'
  }
  ```
  
  
*  **URL Params**
    
    None

   **Required:**
 
   None

* **Data Params**
    `Pass the json object of the form response `
    ```
    {
    "_id": "5ee1bd09416f7226cdbc41ef",
    "form_id": "5ee0d50db1591220e861c595",
    "response": {
        "primary_worker": "Aamir",
        "about_work": "I work in sanitizing public places and update for any sanitization requirements",
        "weight_comp": 45,
        "facilities": [
            {
                "id": 1
            },
            {
                "id": 3
            }
        ],
        "field_type": [
            {
                "id": 2
            }
        ],
        "vehicle_type": [
            {
                "id": 2
            }
        ]
    },
    "meta": {
        "id": 13,
        "mobile_number": "9985353442",
        "roles": [
            {
                "id": 3,
                "name": "Facility Manager"
            }
        ],
        "full_name": "Facility Manager - Unit 1",
        "designation": "Facility in-charge",
        "employee_generic_id": "SP-EMP-0108-2020",
        "facility": {
            "name": "Facility Center-1",
            "type": "MRF"
        },
        "ulb_code": "1234M",
        "location": {
            "city_name": "Paradeep",
            "city_id": 11,
            "ward_id": 999,
            "ward_name": "Ward Name 123"
        }
    },
    "submitted_at": "2020-06-11T05:11:37.014Z",
    "__v": 0
    }
    ```

* **Success Response:**
  `Returns created form object`  
  * **Code:** 200 <br />
    **Content:** 
    ```json
    {
    "_id": "5ee1bd09416f7226cdbc41ef",
    "form_id": "5ee0d50db1591220e861c595",
    "response": {
        "primary_worker": "Aamir",
        "about_work": "I work in sanitizing public places and update for any sanitization requirements",
        "weight_comp": 45,
        "facilities": [
            {
                "id": 1
            },
            {
                "id": 3
            }
        ],
        "field_type": [
            {
                "id": 2
            }
        ],
        "vehicle_type": [
            {
                "id": 2
            }
        ]
    },
    "meta": {
        "id": 13,
        "mobile_number": "9985353442",
        "roles": [
            {
                "id": 3,
                "name": "Facility Manager"
            }
        ],
        "full_name": "Facility Manager - Unit 1",
        "designation": "Facility in-charge",
        "employee_generic_id": "SP-EMP-0108-2020",
        "facility": {
            "name": "Facility Center-1",
            "type": "MRF"
        },
        "ulb_code": "1234M",
        "location": {
            "city_name": "Paradeep",
            "city_id": 11,
            "ward_id": 999,
            "ward_name": "Ward Name 123"
        }
    },
    "submitted_at": "2020-06-11T05:11:37.014Z",
    "__v": 0
    }
    ```
 
* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ message : "Server Error" }`

* **Sample Call:**
  ```
    var http = require('http');

    var options = {
    'method': 'POST',
    'hostname': '3.6.99.164',
    'path': '/api/form/create_form',
    'headers': {
    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6Ijk1OGNiZDdlZmQ4ODhjZDdlZmQ0OTJiZjIyNDhlNGIyYzZhZWVhOGJkMTAzMjMwMjQ4ZGUxZmYyODk3MmZkOWIyYmE2ODYwNDQxM2YwNDQ2In0.eyJhdWQiOiIxMCIsImp0aSI6Ijk1OGNiZDdlZmQ4ODhjZDdlZmQ0OTJiZjIyNDhlNGIyYzZhZWVhOGJkMTAzMjMwMjQ4ZGUxZmYyODk3MmZkOWIyYmE2ODYwNDQxM2YwNDQ2IiwiaWF0IjoxNTkwNjY3MjcyLCJuYmYiOjE1OTA2NjcyNzIsImV4cCI6MTU5MTk2MzI3MSwic3ViIjoiMTMiLCJzY29wZXMiOlsiIl19.vmnBdh-CQlVgA7brO9dukT3lIrRwCWOrcTq3l_pRg_7VvJdIgsCEwVpF_eXe5dYbmJ6u5F8L2vbcXx3ZjdfBCrBYGBEbYAnPfGemFLK5LxDR1kQOZ89Ervhgnqj_4quGdW5axgstsm2rMDcSKGawQ5uGrOeYOHT4w2m4zxl5uruPCNUWA0kjhlto8m7YgkD88umB2sjRXooWuvME9EaeHiQUoHkzAGEuptpXXzmFyGTmdJ0LH07AZDK5HI5dig9AHNSdnHTnGWdAfmEKJX_lqOfiAaphnV-FYEZmS-6DdLdY662qtAS5tIZY2ch0TeWm2KF7nJDWJomhVJMu5KHRl0jjDbyHq8vbMIdxsNr8cenGkq9Ki0WAmiR-sd9Rp3DOdlWTs8Ixj4S8jX82CLmeouHt4wYYu-nJxYlo97GALFzfVXtIbxDQq4rQJQ6oJn7LatUVQ9v9qmPX-QVqY3f92URiq8-_7ngCkt8Ut7AoZKj1QkCgNGYTIfcmPdOqMekccVc8h1nr-BFVF3avbrdn3wpv-4R7PxGounUhgcjJfU64BrqFdCnjrsaSIv0jxwJpADTi6xkkuP7yhY9j_IPAsYNxaoG8rVTqL5kIFfQ38IiMWTznUc2BOCsIsNhe_Y1CBZQZXY8Knv6oO4bhz0cE4NJd0EFWo9xeB-VLF5u2I-8',
    'Accept-Language': 'en'
    }
        };

    var req = http.request(options, function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
    chunks.push(chunk);
    });

    res.on("end", function (chunk) {
     var body = Buffer.concat(chunks);
    console.log(body.toString());
    });

    res.on("error", function (error) {
    console.error(error);
    });
    });
  ``` 
