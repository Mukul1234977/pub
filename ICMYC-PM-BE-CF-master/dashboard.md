# ICMYC Dashboard

## Form response
```
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

## Web Dashboard

* **Wet waste processing:**
  - **Total**
     - Filters: `Date , Distric, ULB, Facility type `
     - fields used for aggregation: ` wet_waste_recieved, compost_generated, compost_sold `
     - aggregation_result:
         ```
        {
          wet_waste_recieved : {
              "label" : "Wet waste recieved",
              "value": 25
          },
          compost_generated : {
              "label" : "Compost generated",
              "value": 32
          },
          compost_sold : {
              "label" : "Compost sold",
              "value": 16
          }
        }
        ```
  - **Filter wise**
     
* **Dry waste processing:**
    - **Total** 
      - Filters: `Date , Distric, ULB, Facility type `
      - fields used for aggregation: ` dry_waste_recieved, recyclable_sold, non_recyclable_disposed, other_disposed `
      - aggregation_result:
          ```
          {
          dry_waste_recieved : {
              "label" : "Dry waste recieved",
              "value": 25
          },
          compost_generated : {
              "label" : "Recyclable sold",
              "value": 25
          },
          compost_sold : {
              "label" : "Compost sold",
              "value": 25
          },
          other_disposed : {
              "label" : "Other disposed",
              "value": 25
          }
        }
        ```
  - **Filter wise**
  
  
* **Operational metrics:**
    - **Total** 
      - Filters: `Date , Distric, ULB, Facility type `
      - fields used for aggregation: ` household_covered, sagregated_waste_collected, facilities_operational, capacity_utilized `
      - aggregation_result:
         ```
        {
          household_covered : {
              "label" : "%Household covered",
              "value": 25
          },
          sagregated_waste_collected : {
              "label" : "%Sagregated waste collected",
              "value": 25
          },
          facilities_operational : {
              "label" : "%Facilities operational",
              "value": 25
          },
          capacity_utilized : {
              "label" : "%Capacity utilized",
              "value": 25
          }
        }
        ```
  - **Filter wise**
  
  
* **Financial metrics:**
    - **Total** 
      - Filters: `Date , Distric, ULB, Facility type `
      - fields used for aggregation: ` revenue_compost, revenue_recyclable `
      - aggregation_result:
         ```
        {
          revenue_compost : {
              "label" : "",
              "value": 25
          },
          revenue_recyclable : {
              "label" : "",
              "value": 25
          }
        }
        ```
  - **Filter wise**
  
## Mobile Dashboard

* **Dashboard Response object:**
  - **ULB admin**
      ```
    [
    {
        "facility_type": "MCC",
        "facility_name": "Facility Center-1",
        "received": {
            "wet_waste_recieved": "2000 Tons"
        },
        "processed": {
            "compost_generated": "800 Tons",
            "compost_packed": "0 Tons"
        },
        "sold": {
            "compost_sold": "400 Tons",
            "revenue_generated": "Rs 400/-"
        }
    },
    {
        "facility_type": "MRF",
        "facility_name": "Facility Center-1",
        "received": {
            "dry_waset_recieved": "0 Tons"
        },
        "processed": {
            "quantity_recy": "105 Tons",
            "quantity_non_recy": "75 Tons",
            "others": "1323 Tons"
        },
        "sold": {
            "recyclable_sold": "0 Tons",
            "revenue_generated": "Rs 0/-"
        },
        "disposed": {
            "non_recyclable_disposed": "0 Tons",
            "others": "0 Tons"
        }
    }
    ]
      ```
 - **Facility manager**    
    ```
        [
    {
        "facility_type": "MRF",
        "facility_name": "Facility Center-1",
        "received": {
            "dry_waset_recieved": "0 Tons"
        },
        "processed": {
            "quantity_recy": "105 Tons",
            "quantity_non_recy": "75 Tons",
            "others": "1323 Tons"
        },
        "sold": {
            "recyclable_sold": "0 Tons",
            "revenue_generated": "Rs 0/-"
        },
        "disposed": {
            "non_recyclable_disposed": "0 Tons",
            "others": "0 Tons"
        }
    }
    ]
      ```

# REST APIs

**Mobile dashboard**
----
  Returns facility wise aggregated data for mobile dashboard.

* **URL**

  `http://3.6.99.164:5000/api/dashboard/mobile`

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
        "facility_type": "MRF",
        "facility_name": "Facility Center-1",
        "received": {
            "dry_waset_recieved": "0 Tons"
        },
        "processed": {
            "quantity_recy": "105 Tons",
            "quantity_non_recy": "75 Tons",
            "others": "1323 Tons"
        },
        "sold": {
            "recyclable_sold": "0 Tons",
            "revenue_generated": "Rs 0/-"
        },
        "disposed": {
            "non_recyclable_disposed": "0 Tons",
            "others": "0 Tons"
        }
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
    'path': '/api/dashboard/mobile',
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
  

