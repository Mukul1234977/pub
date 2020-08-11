const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Form = require("../../models/Form");
const FormResponse = require("../../models/Response");

// const computeTotalResult = (match_query_object) => {
//   return new Promise(async (resolve) => {
//     let wet_waste_processing = [];
//     let dry_waste_processing;
//     let operational_metric;
//     let financial_metrics;
//     try {
//       await Promise.all([
//         (wet_waste_processing = FormResponse.aggregate([
//           { $match: match_query_object },
//           {
//             $group: {
//               _id: "Wet waste processing",
//               wet_waste_recieved: { $sum: "$response.wet_waste_recieved" },
//               compost_generated: { $sum: "$response.compost_generated" },
//             },
//           },
//         ])),
//         (dry_waste_processing = FormResponse.aggregate([
//           { $match: match_query_object },
//           {
//             $group: {
//               _id: "Dry waste processing",
//               // "quantity_landfill":{ $sum: "$response.quantity_landfill" },
//               quantity_c_d: { $sum: "$response.quantity_c_d" },
//               quantity_recy: { $sum: "$response.quantity_recy" },
//             },
//           },
//         ])),
//       ]);
//       let final_result = [];
//       console.log(wet_waste_processing);
//       final_result.push(wet_waste_processing);
//       console.log(final_result);
//       // final_result.push(dry_waste_processing);
//       // final_result.push(operational_metric);
//       // final_result.push(financial_metrics);
//       // = [wet_waste_processing, dry_waste_processing,operational_metric, final_result ]
//       resolve(final_result);
//     } catch (error) {
//       console.log(error);
//       resolve("Error");
//     }
//   });
// };

// router.get("/total/wet_waste", async (req, res) => {
//   // filters
//   // let facility_type = req.query.facility_type !== undefined ? req.query.facility_type

//   let match_query_object = {};
//   if (req.query.facility_type !== undefined) {
//     match_query_object[`meta.facility.type`] = {
//       $in: [req.query.facility_type],
//     };
//   }
//   console.log(match_query_object);

//   try {
//     var result = await computeTotalResult(match_query_object);
//     res.status(200).send(result);
//   } catch (error) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

const get_valid_data = (data) => {
  return data === undefined || data === null ? 0 : data;
};

const prepapre_object_empty = (facility_type, facility_name,facility_generic_id) => {
  let obj = {};
  switch (facility_type) {
    case "MCC":
      obj = {
        facility_type: facility_type,
        facility_name: facility_name,
         facility_generic_id:facility_generic_id,
        received: {
          wetwaste_received: 0 + " Tons",
        },
        processed: {
          comp_generated: 0 + " Tons",
          comp_packed: 0 + " Tons",
        },
        sold: {
          comp_sold: 0 + " Tons",
          revenue_generated:
            "Rs " + 0.00 + "/-",
        },
      };
      return obj;
    case "OCC":
      obj = {
        facility_type: facility_type,
        facility_name: facility_name,
         facility_generic_id:facility_generic_id,
        received: {
          wetwaste_received: 0 + " Tons",
        },
        processed: {
          comp_generated: 0 + " Tons"
        },
        sold: {
          comp_sold: 0 + " Tons",
          revenue_generated:
            "Rs " + 0.00 + "/-",
        },
      };
      return obj;
    case "BCU":
      obj = {
        facility_type: facility_type,
        facility_name: facility_name,
        facility_generic_id:facility_generic_id,
        received: {
          wetwaste_received: 0 + " Tons",
        },
        processed: {
          comp_generated: 0 + " Tons"
        },
        sold: {
          comp_sold: 0 + " Tons",
          revenue_generated:
            "Rs " + 0.00 + "/-",
        },
      };
      return obj;
    case "MRF":
      obj = {
        facility_type: facility_type,
        facility_name: facility_name,
        facility_generic_id:facility_generic_id,
        
        received: {
          drywaste_received: 0 + " Tons",
        },
        processed: {
          recyc_waste: 0 + " Tons",
          non_recyc_waste: 0 + " Tons",
          others:
            0 +
            0 +
            0 +
            " Tons",
        },
        sold: {
          recyc_sold: 0 + " Tons",
          amt_received: "Rs " + 0.00 + "/-",
        },
        disposed: {
          non_recyc_waste_disposed:
            0+ " Tons",
          others: 0 + " Tons",
        },
      };
      return obj;
    default:
      return null;

  }
};


function converKgToTons(kg_data){
  return kg_data/1000;
}

const prepapre_object = (facility_type, facility_name, item,facility_generic_id) => {
  let obj = {};
  switch (facility_type) {
    case "MCC":
      obj = {
        facility_type: facility_type,
        facility_name: facility_name,
         facility_generic_id:facility_generic_id,
        received: {
          wetwaste_received: converKgToTons(get_valid_data(item.wetwaste_received)).toFixed(2) + " Tons",
        },
        processed: {
          comp_generated: converKgToTons(get_valid_data(item.comp_generated)).toFixed(2) + " Tons",
          comp_packed: converKgToTons(get_valid_data(item.comp_packed)).toFixed(2) + " Tons",
        },
        sold: {
          comp_sold: converKgToTons(get_valid_data(item.comp_sold)).toFixed(2) + " Tons",
          revenue_generated:
            "Rs " + get_valid_data(item.revenue_generated).toFixed(2) + "/-",
        },
      };
      return obj;
    case "OCC":
      obj = {
        facility_type: facility_type,
        facility_name: facility_name,
         facility_generic_id:facility_generic_id,
        received: {
          wetwaste_received: converKgToTons(get_valid_data(item.wetwaste_added)).toFixed(2) + " Tons",
        },
        processed: {
          comp_generated: converKgToTons(get_valid_data(item.comp_generated)).toFixed(2) + " Tons"
        },
        sold: {
          comp_sold: converKgToTons(get_valid_data(item.comp_sold)).toFixed(2) + " Tons",
          revenue_generated:
            "Rs " + get_valid_data(item.revenue_generated).toFixed(2) + "/-",
        },
      };
      return obj;
    case "BCU":
      obj = {
        facility_type: facility_type,
        facility_name: facility_name,
        received: {
          wetwaste_received: converKgToTons(get_valid_data(item.wetwaste_added)).toFixed(2) + " Tons",
        },
        processed: {
          comp_generated: converKgToTons(get_valid_data(item.comp_generated)).toFixed(2) + " Tons"
        },
        sold: {
          comp_sold: converKgToTons(get_valid_data(item.comp_sold)).toFixed(2) + " Tons",
          revenue_generated:
            "Rs " + get_valid_data(item.revenue_generated).toFixed(2) + "/-",
        },
      };
      return obj;
    case "MRF":
      obj = {
        facility_type: facility_type,
        facility_name: facility_name,
        facility_generic_id:facility_generic_id,
        
        received: {
          drywaste_received: converKgToTons(get_valid_data(item.drywaste_received)).toFixed(2) + " Tons",
        },
        processed: {
          recyc_waste: converKgToTons(get_valid_data(item.recyc_waste)).toFixed(2) + " Tons",
          non_recyc_waste: converKgToTons(get_valid_data(item.non_recyc_waste)).toFixed(2) + " Tons",
          others:
            converKgToTons(get_valid_data(item.sanitary_waste)).toFixed(2) +
            converKgToTons(get_valid_data(item.domes_hazard_waste)).toFixed(2) +
            converKgToTons(get_valid_data(item.quan_ewaste)).toFixed(2) +
            " Tons",
        },
        sold: {
          recyc_sold: converKgToTons(get_valid_data(item.recyc_sold)).toFixed(2) + " Tons",
          amt_received: "Rs " + get_valid_data(item.amt_received).toFixed(2) + "/-",
        },
        disposed: {
          non_recyc_waste_disposed:
            converKgToTons(get_valid_data(item.non_recyc_waste_disposed)).toFixed(2)+ " Tons",
           others: converKgToTons(get_valid_data(item.quan_incinerated)).toFixed(2) +
            converKgToTons(get_valid_data(item.dom_hazard_Quan_disposed)).toFixed(2) +
            converKgToTons(get_valid_data(item.ewaste_quan_disposed)).toFixed(2) +
            " Tons",
        },
      };
      return obj;
    default:
      return null;

  }
};
router.get("/mobile", auth, async (req, res) => {
  try {
	  console.log(req.user);
    let facilities,from_date,to_date,facility_data; 
    if(req.query.created_from_date){
       from_date = new Date(req.query.created_from_date)
     }else{
        from_date = new Date()
     }
    if(req.query.created_to_date){
        to_date = new Date(req.query.created_to_date)
    } else{ 
        to_date = new Date()
    }
     to_date.setDate(to_date.getDate() + 1)
    if (req.user.facility.length === undefined) {
        facilities = [req.user.facility.facility_generic_id];
        facility_data=[req.user.facility]

    } else {
      facilities = req.user.facility.map((item) => item.facility_generic_id);
      facility_data = req.user.facility.map((item) => item);
    }


	     console.log(facilities);
         let data = await FormResponse.aggregate([
      { $match:{"meta.facility.facility_generic_id": {$in:facilities},submitted_at:{"$gte":from_date, '$lte':to_date} }},
       {
        $group: {
          _id: {
            facility_type: "$meta.facility.facility_type",
            facility_name: "$meta.facility.name",
            facility_generic_id:"$meta.facility.facility_generic_id",
          },
          drywaste_received: {
            $sum: {
              $convert: { input: "$response.drywaste_received", to: "double" },
            },
          },
          recyc_waste: {
            $sum: {
              $convert: { input: "$response.recyc_waste", to: "double" },
            },
          },
          non_recyc_waste: {
            $sum: {
              $convert: { input: "$response.non_recyc_waste", to: "double" },
            },
          },
          sanitary_waste: {
            $sum: {
              $convert: { input: "$response.sag_sanitary_waste", to: "double" },
            },
          },
          domes_hazard_waste: {
            $sum: {
              $convert: { input: "$response.domes_hazard_waste", to: "double" },
            },
          },
          quan_ewaste: {
            $sum: {
              $convert: { input: "$response.quan_ewaste", to: "double" },
            },
          },
          quan_recyc_sold: {
            $sum: {
              $convert: { input: "$response.quan_recyc_sold", to: "double" },
            },
          },
          quan_disposed: {
            $sum: {
              $convert: { input: "$response.quan_disposed", to: "double" },
            },
          },
          quan_incinerated: {
            $sum: {
              $convert: { input: "$response.quant_incinerated", to: "double" },
            },
          },
          dom_hazard_Quan_disposed: {
            $sum: {
              $convert: { input: "$response.dom_hazard_Quan_disposed", to: "double" },
            },
          },
          ewaste_quan_disposed: {
            $sum: {
              $convert: { input: "$response.ewaste_quan_disposed", to: "double" },
            },
          },
          recyc_sold: {
            $sum: { $convert: { input: "$response.recyc_sold", to: "double" } },
          },
          amt_received: {
            $sum: {
              $convert: { input: "$response.amt_received", to: "double" },
            },
          },
          non_recyc_waste_disposed: {
            $sum: {
              $convert: {
                input: "$response.non_recyc_waste_disposed",
                to: "double",
              },
            },
          }, 
          wetwaste_received: {
            $sum: {
              $convert: { input: "$response.wetwaste_received", to: "double" },
            },
          },
          comp_generated: {
            $sum: {
              $convert: { input: "$response.comp_generated", to: "double" },
            },
          },
          comp_packed: {
            $sum: {
              $convert: { input: "$response.comp_packed", to: "double" },
            },
          },
          comp_sold: {
            $sum: { $convert: { input: "$response.comp_sold", to: "double" } },
          },
          revenue_generated: {
            $sum: {
              $convert: { input: "$response.revenue_generated", to: "double" },
            },
          },
          wetwaste_added: {
            $sum: {
              $convert: { input: "$response.wetwaste_added", to: "double" },
            },
          },
        },
      },
    ]);
         console.log(data.length,data)
    // preparing data for mobile dashboard
    let final_dashboad_data = [];
      if(data.length<=0){
          facility_data.forEach((item,i)=>{
          let prep_obj = prepapre_object_empty(item.facility_type,item.name,item.facility_generic_id);
       if (prep_obj !== null) {
          final_dashboad_data.push(prep_obj);
         }
       })
       res.status(200).send(final_dashboad_data);
     } else{
      let concate_object = await concateObject(data,facilities);
       concate_object.forEach((item, i) => {
        for(var j=0;j<facility_data.length;j++){
           if(item._id.facility_generic_id.indexOf(facility_data[j].facility_generic_id)>-1){
            let prep_obj = prepapre_object(facility_data[j].facility_type,facility_data[j].name,item,facility_data[j].facility_generic_id);
           if (prep_obj !== null) {
                 final_dashboad_data.push(prep_obj);
               }
           }else{
              let prep_obj = prepapre_object_empty(facility_data[j].facility_type,facility_data[j].name,facility_data[j].facility_generic_id);
              if (prep_obj !== null) {
               final_dashboad_data.push(prep_obj);
                }
            }
        }
      
    });
	     console.log(final_dashboad_data);
      res.status(200).send(final_dashboad_data);
  }
}
 catch (error) {
    console.log(error);
    res.status(400).send("server error");
  }
});



async function concateObject(object_data,facilities_list){
  let new_obj =[];
    for(var i=0;i<facilities_list.length;i++){
      new_obj[i]={};
     for(var j=0;j<object_data.length;j++){
        if(object_data[j]._id.facility_generic_id.indexOf(facilities_list[i])>-1){
              
              new_obj[i]._id=object_data[i]._id  
              new_obj[i].drywaste_received = new_obj[i].drywaste_received===undefined ? object_data[j].drywaste_received : parseInt(new_obj[i].drywaste_received) + parseInt(object_data[j].drywaste_received);
              new_obj[i].recyc_waste = new_obj[i].recyc_waste===undefined ? object_data[j].recyc_waste : new_obj[i].recyc_waste + object_data[j].recyc_waste;
              new_obj[i].non_recyc_waste = new_obj[i].non_recyc_waste===undefined ? object_data[j].non_recyc_waste : new_obj[i].non_recyc_waste + object_data[j].non_recyc_waste;
              new_obj[i].sanitary_waste = new_obj[i].sanitary_waste===undefined ? object_data[j].sanitary_waste : new_obj[i].sanitary_waste + object_data[j].sanitary_waste;
              new_obj[i].quan_ewaste = new_obj[i].quan_ewaste===undefined ? object_data[j].quan_ewaste : new_obj[i].quan_ewaste + object_data[j].quan_ewaste;
              new_obj[i].domes_hazard_waste = new_obj[i].domes_hazard_waste===undefined ? object_data[j].domes_hazard_waste : new_obj[i].domes_hazard_waste + object_data[j].domes_hazard_waste;
              new_obj[i].quan_recyc_sold = new_obj[i].quan_recyc_sold===undefined ? object_data[j].quan_recyc_sold : new_obj[i].quan_recyc_sold + object_data[j].quan_recyc_sold;
              new_obj[i].quan_disposed = new_obj[i].quan_disposed===undefined ? object_data[j].quan_disposed : new_obj[i].quan_disposed + object_data[j].quan_disposed;
              new_obj[i].quan_incinerated = new_obj[i].quan_incinerated===undefined ? object_data[j].quan_incinerated : new_obj[i].quan_incinerated + object_data[j].quan_incinerated;
              new_obj[i].dom_hazard_Quan_disposed = new_obj[i].dom_hazard_Quan_disposed===undefined ? object_data[j].dom_hazard_Quan_disposed : new_obj[i].dom_hazard_Quan_disposed + object_data[j].dom_hazard_Quan_disposed;
              new_obj[i].ewaste_quan_disposed = new_obj[i].ewaste_quan_disposed===undefined ? object_data[j].ewaste_quan_disposed : new_obj[i].ewaste_quan_disposed + object_data[j].ewaste_quan_disposed;
              new_obj[i].recyc_sold = new_obj[i].recyc_sold===undefined ? object_data[j].recyc_sold : new_obj[i].recyc_sold + object_data[j].recyc_sold;
              new_obj[i].amt_received = new_obj[i].amt_received===undefined ? object_data[j].amt_received : new_obj[i].amt_received + object_data[j].amt_received;
              new_obj[i].non_recyc_waste_disposed = new_obj[i].non_recyc_waste_disposed==undefined ? object_data[j].non_recyc_waste_disposed : new_obj[i].non_recyc_waste_disposed + object_data[j].non_recyc_waste_disposed;
              new_obj[i].wetwaste_received = new_obj[i].wetwaste_received===undefined ? object_data[j].wetwaste_received : new_obj[i].wetwaste_received + object_data[j].wetwaste_received;
              new_obj[i].comp_generated = new_obj[i].comp_generated===undefined ? object_data[j].comp_generated : new_obj[i].comp_generated + object_data[j].comp_generated;
              new_obj[i].comp_packed = new_obj[i].comp_packed===undefined ? object_data[j].comp_packed : new_obj[i].comp_packed + object_data[j].comp_packed;
              new_obj[i].comp_sold = new_obj[i].comp_sold===undefined ? object_data[j].comp_sold : new_obj[i].comp_sold + object_data[j].comp_sold;
              new_obj[i].revenue_generated = new_obj[i].revenue_generated===undefined ? object_data[j].revenue_generated : new_obj[i].revenue_generated + object_data[j].revenue_generated;
              new_obj[i].wetwaste_added = new_obj[i].wetwaste_added===undefined ? object_data[j].wetwaste_added : new_obj[i].wetwaste_added + object_data[j].wetwaste_added;

        }
      
       }
       
     
   }

     return new_obj;
}

module.exports = router;
