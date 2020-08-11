const express = require("express");
const router = express.Router();
const auth = require("../../../middleware/auth");
const Form = require("../../../models/Form");
const FormResponse = require("../../../models/Response");
const querystring = require('querystring');

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
  return data === undefined || data === null  || data === NaN ? 0 : data;
};

const prepapre_object = (item) => {
  let obj = {}
      obj = {
        wet_waste:{
          wastereceived: converKgToTons(get_valid_data(item.wetwaste_received)).toFixed(2), 
          compostgenerated: converKgToTons(get_valid_data(item.comp_generated)).toFixed(2),
          compostsold: converKgToTons(get_valid_data(item.comp_sold)).toFixed(2),
          comppacked: converKgToTons(get_valid_data(item.comp_packed)).toFixed(2),
       },
      dry_waste: {
          drywaste_received: converKgToTons(get_valid_data(item.drywaste_received)).toFixed(2),
          //sanitorywaste:     converKgToTons(get_valid_data(item.sanitary_waste)),
          //domesichazardous: converKgToTons(get_valid_data(item.domes_hazard_waste)), 
          landfilled:converKgToTons(get_valid_data(item.quan_sent_landfill)).toFixed(2),
          recyc_sold:converKgToTons(get_valid_data(item.recyc_sold)).toFixed(2),
          non_recyc_waste_disposed:converKgToTons(get_valid_data(item.non_recyc_waste_disposed)).toFixed(2),
          others:
            converKgToTons(get_valid_data(item.quan_incinerated)).toFixed(2) +
            converKgToTons(get_valid_data(item.dom_hazard_quan_disposed)).toFixed(2) +
            converKgToTons(get_valid_data(item.ewaste_quan_disposed)).toFixed(2) 
        
        },

       financial_metric:{
         revenuegeneratedcompost: (get_valid_data(parseInt(item.revenue_generated))).toFixed(2),
         revenueGeneratedrecyclable: get_valid_data(item.amt_received).toFixed(2),
         fee_collected:get_valid_data(item.fee_collected).toFixed(2),
         fine_collected:get_valid_data(item.fine_collected).toFixed(2)
        },

        operational_metric:{
         segregratedwaste : converKgToTons(get_valid_data(segregatedWatseCal(item))).toFixed(2),
         facilitiesoperational: 0 ,
         capacityutilized: 0 ,
         householdcovered: converKgToTons(get_valid_data(benchMarkdWatseCal(item))).toFixed(2) 

        }

      }
  
      return obj;
};


const prepapre_object_dry = (item) => {
  let obj = {}
      obj = {
          drywaste_received: converKgToTons(get_valid_data(item.drywaste_received)).toFixed(2),
          recyc_sold:converKgToTons(get_valid_data(item.recyc_sold)).toFixed(2),
          processing:0,
          landfilled:converKgToTons(get_valid_data(item.quan_sent_landfill)).toFixed(2),
           non_recyc_waste_disposed:converKgToTons(get_valid_data(item.non_recyc_waste_disposed)).toFixed(2)

        
      }
  
      return obj;
};

const prepapre_object_dry_empty = () => {
  let obj = {};
      obj = {
          drywaste_received: 0 ,
          landfilled:0 ,
          recyc_sold:0,
          landfilled:0,
          non_recyc_waste_disposed:0
      }
  
      return obj;
};

const prepapre_object_leaderboard_facility_empty = () => {
  let obj = {};
      obj = {
          wetwaste_received: 0 ,
          compostgenerated:0,
          compostsold:0,
          drywaste_received: 0 ,
          landfilled:0 ,
          recyc_sold:0,
          revenuegeneratedcompost:0,
          revenueGeneratedrecyclable:0,
          disposedprocessing:0,
          districtname: 0,
          ulb : 0,
          facilityname: 0,
          facilitytype: 0
      }
  
      return obj;
};

const prepapre_object_leaderboard_ulb_empty = () => {
  let obj = {};
      obj = {
          wetwaste_received: 0 ,
          compostgenerated:0,
          compostsold:0,
          drywaste_received: 0 ,
          landfilled:0 ,
          recyc_sold:0,
          revenuegeneratedcompost:0,
          revenueGeneratedrecyclable:0,
          fee_collected:0,
          total:0,
          disposedprocessing:0,
          nonrecycwaste:0,
          householdcovered:0,
          segregratedwaste:0,
          districtname: 0,
          ulb : 0,
      }
  
      return obj;
};

const prepapre_object_leaderboard_ulb = (item) => {
  let obj = {}
      obj = {
          wetwaste_received:converKgToTons(get_valid_data(item.wetwaste_received)).toFixed(2),
          compostgenerated:  converKgToTons(get_valid_data(item.comp_generated)).toFixed(2),
          compostsold: converKgToTons(get_valid_data(item.comp_sold)).toFixed(2), 
          revenuegeneratedcompost: (get_valid_data(parseInt(item.revenue_generated))).toFixed(2),
          revenueGeneratedrecyclable: get_valid_data(item.amt_received).toFixed(2),
          fee_collected:get_valid_data(item.fee_collected).toFixed(2),
          total:(get_valid_data(parseInt(item.revenue_generated)))+get_valid_data(item.amt_received)+get_valid_data(item.fee_collected).toFixed(2),
          nonrecycwaste:converKgToTons(get_valid_data(item.non_recyc_waste)).toFixed(2), 
          drywaste_received: converKgToTons(get_valid_data(item.drywaste_received)).toFixed(2),
          householdcovered: converKgToTons(get_valid_data(benchMarkdWatseCal(item))).toFixed(2),
          segregratedwaste : converKgToTons(get_valid_data(segregatedWatseCal(item))).toFixed(2),
          recyc_sold:converKgToTons(get_valid_data(item.recyc_sold)).toFixed(2),
          disposedprocessing:0,
          landfilled:converKgToTons(get_valid_data(item.quan_sent_landfill)).toFixed(2),
          districtname: item._id.district_name,
          ulb : item._id.ulb,
        
      }
  
      return obj;
};

const prepapre_object_leaderboard_facility = (item) => {
  let obj = {}
      obj = {
          wetwaste_received:converKgToTons(get_valid_data(item.wetwaste_received)).toFixed(2),
          compostgenerated:  converKgToTons(get_valid_data(item.comp_generated)).toFixed(2),
          compostsold: converKgToTons(get_valid_data(item.comp_sold)).toFixed(2), 
          revenuegeneratedcompost: (get_valid_data(parseInt(item.revenue_generated))).toFixed(2),
          revenueGeneratedrecyclable: get_valid_data(item.amt_received).toFixed(2),
          drywaste_received: converKgToTons(get_valid_data(item.drywaste_received)).toFixed(2),
          recyc_sold:converKgToTons(get_valid_data(item.recyc_sold)).toFixed(2),
          disposedprocessing:0,
          landfilled:converKgToTons(get_valid_data(item.quan_sent_landfill)).toFixed(2),
          districtname: item._id.district_name,
          ulb : item._id.ulb,
          facilityname: item._id.facility_name,
          facilitytype: item._id.facility_type
        
      }
  
      return obj;
};




const prepapre_object_empty = () => {
  let obj = {};
      obj = {
        wet_waste:{
          wastereceived: 0 ,
          compostgenerated: 0 ,
          compostsold: 0,
          comppacked:0, 
       },
      dry_waste: {
          drywaste_received: 0 ,
          recyc_sold:0,
          non_recyc_waste_disposed:0 ,
          others:0,
          landfilled:0 
        },

       financial_metric:{
         revenuegeneratedcompost:  0 ,
         revenueGeneratedrecyclable:  0,
         fee_collected:0,
         fine_collected:0 
        },

        operational_metric:{
         segregratedwaste : 0 ,
         facilitiesoperational: 0 ,
         capacityutilized: 0 ,
         householdcovered: 0 


        }

      }
  
      return obj;
};



const prepapre_object_wet = (item) => {
  let obj = {}
      obj = {
          wastereceived: converKgToTons(get_valid_data(item.wetwaste_received)).toFixed(2),
          compostgenerated: converKgToTons(get_valid_data(item.comp_generated)).toFixed(2),
          compostsold: converKgToTons(get_valid_data(item.comp_sold)).toFixed(2),
          comppacked:  converKgToTons(get_valid_data(item.comp_packed)).toFixed(2),
      }
  
      return obj;
};

const prepapre_object_wet_details = (item) => {
  let obj = {}
      obj = {
          wastereceived: converKgToTons(get_valid_data(item.wetwaste_received)).toFixed(2),
          compostgenerated: converKgToTons(get_valid_data(item.comp_generated)).toFixed(2),
          compostsold: converKgToTons(get_valid_data(item.comp_sold)).toFixed(2),
          comppacked:converKgToTons(get_valid_data(item.comp_packed)).toFixed(2),
          districtname: item._id.district_name,
          districtId: item._id.district_id,
          facilityId: item._id.facilityId,
          ulb : item._id.ulb
      }
  
      return obj;
};

const prepapre_object_financial_empty = (item)=>{
    let obj = {};
      obj = {
       
          revenuegeneratedcompost: 0,
          revenueGeneratedrecyclable: 0,
          fee_collected:0,
          fine_collected:0,
          compostsold: 0,
          recycsold:0,
          districtname: 0,
          districtId: 0,
          facilityId: 0,
          ulb : 0
      }
  
      return obj;
};


const prepapre_object_financial = (item) => {
  let obj = {};
  obj = {
          revenuegeneratedcompost: (get_valid_data(parseInt(item.revenue_generated))).toFixed(2),
          revenueGeneratedrecyclable: get_valid_data(item.amt_received).toFixed(2),
          fee_collected:get_valid_data(item.fee_collected).toFixed(2),
          fine_collected:get_valid_data(item.fine_collected).toFixed(2),
          compostsold: converKgToTons(get_valid_data(item.comp_sold)).toFixed(2),
          recyc_sold:converKgToTons(get_valid_data(item.recyc_sold)).toFixed(2)
      }
  
      return obj;
}


const prepapre_object_financial_details = (item)=>{
  let obj = {};
  obj = {
          revenuegeneratedcompost: (get_valid_data(parseInt(item.revenue_generated))).toFixed(2),
          revenueGeneratedrecyclable: get_valid_data(item.amt_received).toFixed(2),
          fee_collected:get_valid_data(item.fee_collected).toFixed(2),
          fine_collected:get_valid_data(item.fine_collected).toFixed(2),
          compostsold: converKgToTons(get_valid_data(item.comp_sold)).toFixed(2),
          recyc_sold:converKgToTons(get_valid_data(item.recyc_sold)).toFixed(2),
          total_revenue:get_valid_data(parseInt(item.revenue_generated)).toFixed(2)+get_valid_data(item.amt_received).toFixed(2),
          districtname: item._id.district_name,
          ulb : item._id.ulb,
          districtId: item._id.district_id,
          facilityId: item._id.facilityId,
          facilitytype: item._id.facility_type
      }
  
      return obj;
}

const prepapre_object_financial_details_empty = (item)=>{
  let obj = {};

  obj = {
          revenuegeneratedcompost: 0,
          revenueGeneratedrecyclable: 0,
          fee_collected:0,
          fine_collected:0,
          compostsold: 0,
          recyc_sold:0,
          total_revenue:0,
          districtname: 0,
          ulb : 0,
          districtId: 0,
          facilityId: 0,
          facilitytype:0
      }
  
      return obj;
}

const prepapre_object_dry_details = (item) => {
  let obj = {}
      obj = {
          drywastereceived: converKgToTons(get_valid_data(item.drywaste_received)).toFixed(2),
          recycwaste: converKgToTons(get_valid_data(item.recyc_waste)).toFixed(2),
          nonrecycwaste: converKgToTons(get_valid_data(item.non_recyc_waste)).toFixed(2),
          ewaste:converKgToTons(get_valid_data(item.quan_ewaste)).toFixed(2),
          sanitorywaste:converKgToTons(get_valid_data(item.sanitary_waste)).toFixed(2),
          domesichazardous:converKgToTons(get_valid_data(item.domes_hazard_waste)).toFixed(2),
          landfilled:converKgToTons(get_valid_data(item.quan_sent_landfill)).toFixed(2),
          recycsold:converKgToTons(get_valid_data(item.recyc_sold)).toFixed(2),
          nonrecycsold:0,
          districtname: item._id.district_name,
          districtId: item._id.district_id,
          facilityId: item._id.facilityId,
          ulb : item._id.ulb
      }
  
      return obj;
};


const prepapre_object_dry_details_empty = () => {
  let obj = {};
      
      obj = {
       
          drywastereceived: 0,
          recycwaste: 0,
          nonrecycwaste: 0,
          ewaste:0,
          sanitorywaste:0,
          domesichazardous:0,
          landfilled:0,
          recycsold:0,
          nonrecycsold:0,
          districtname: 0,
          districtId: 0,
          facilityId: 0,
          ulb : 0
       
      }
  
      return obj;
};
const prepapre_object_wet_empty = () => {
  let obj = {};
      obj = {
       
          wastereceived: 0,
          compostgenerated: 0,
          compostsold: 0,
          comppacked:0
    
      }
  
      return obj;
};

const prepapre_object_wet_details_empty = () => {
  let obj = {};
      obj = {
       
          wastereceived: 0 ,
          compostgenerated: 0,
          compostsold: 0 ,
          districtname: 0,
          districtId: 0,
          facilityId: 0,
          ulb : 0
       
      }
  
      return obj;
};




 const prepapre_object_operational =(item) =>{
   let obj = {};
      obj = {
        capacityutilized:0
      }
  
      return obj;
}

 const prepapre_object_operational_empty =(item) =>{
   let obj = {};
      obj = {
        capacityutilized:0
      }
  
      return obj;
}

const prepapre_object_operational_ward =(item) =>{
   let obj = {};
      obj = {
         segregratedwaste : converKgToTons(get_valid_data(segregatedWatseCal(item))).toFixed(2),
         householdcovered: converKgToTons(get_valid_data(benchMarkdWatseCal(item))).toFixed(2) 
       
      }
  
      return obj;
}

const prepapre_object_operational_ward_empty =(item) =>{
   let obj = {};
      obj = {
       
         segregratedwaste : 0,
         householdcovered: 0
       
      }
  
      return obj;
}

const prepapre_object_operational_details = (item) =>{
     let obj={};
     let total_waste = parseInt(item.drywaste_received) + parseInt(item.wetwaste_received) + parseInt(item.mixedwaste_received);  
     obj={
        totalWaste:total_waste,
        operationalCapacity:0,
        utilzation:0,
        districtname: item._id.district_name,
        districtId: item._id.district_id,
        facilityId: item._id.facilityId,
        ulb : item._id.ulb,
        facilitytype: item._id.facility_type
     }

     return obj;
}

const prepapre_object_operational_details_empty = (item) =>{
     let obj={};
      
     obj={
      totalWaste:0,
       operationalCapacity:0,
       utilzation:0,
       districtname: 0,
       districtId: 0,
       facilityId: 0,
       ulb : 0,
       facilitytype: 0

     }

     return obj;
}

const prepapre_object_operational_ward_details = (item) =>{
  console.log(item);
     let obj={};
          let total_waste = parseInt(item.drywaste_received) + parseInt(item.wetwaste_received) + parseInt(item.mixedwaste_received);
     obj={
       totalWaste:total_waste,
       benchMark:0,
       segregratedwaste : converKgToTons(get_valid_data(segregatedWatseCal(item))).toFixed(2),
       householdcovered: converKgToTons(get_valid_data(benchMarkdWatseCal(item))).toFixed(2) ,
       wetwaste:converKgToTons(get_valid_data(item.wetwaste_received)).toFixed(2),
       drywaste:converKgToTons(get_valid_data(item.drywaste_received)).toFixed(2),
       districtname: item._id.district_name,
       districtId: item._id.district_id,
       facilityId: item._id.facilityId,
       ulb : item._id.ulb,
       facilitytype: item._id.facility_type,
       ward:item._id.ward
     }

     return obj;
}

const prepapre_object_operational_ward_details_empty = (item) =>{
     let obj={};
     obj={
       totalWaste:0,
       benchMark:0,
       householdcovered:0,
       wetwaste:0,
       drywaste:0,
       segregratedwaste:0,
       districtname: 0,
       districtId: 0,
       facilityId:0,
       ulb : 0,
       facilitytype: 0,
       ward:0
     }


     return obj;
}

function segregatedWatseCal(waste_data){
   let total_waste = parseInt(waste_data.drywaste_received) + parseInt(waste_data.wetwaste_received) + parseInt(waste_data.mixedwaste_received);
        let temp = get_valid_data(waste_data.drywaste_received) + get_valid_data(waste_data.wetwaste_received )/get_valid_data(total_waste)*100;;
         if(temp.toString()=='NaN'){
            temp=0;
         }
   return temp;
 }

function converKgToTons(kg_data){
  return kg_data/1000;
}

function benchMarkdWatseCal(waste_data){
   let collected_waste = parseInt(waste_data.drywaste_received) + parseInt(waste_data.wetwaste_received) + parseInt(waste_data.mixedwaste_received);
   let bench_mark_target=1000;
   return parseInt((collected_waste/bench_mark_target)*100)
}


function addDays(dateObj, numDays) {
   dateObj.setDate(dateObj.getDate() + numDays);
   return dateObj;
}



function setTimeFilter(type_obj){
 
      if(type_obj.timeStatus==="'today'"){
         return addDays(new Date(), -1);
      }else if(type_obj.timeStatus==='weekly'){
         return addDays(new Date(), -7);
      }else if(type_obj.timeStatus==='monthly'){
         return addDays(new Date(), -30);
      }else{
          console.log("elseee")
         return addDays(new Date(), -365);
      }
    // switch(type){
    //   case 'today' :
    //    return addDays(new Date(), -1);
    //   case 'weekly':
    //      return addDays(new Date(), -7);
    //   case 'monthly':
    //       return addDays(new Date(), -30);
    //   case 'yearly':
    //     return addDays(new Date(), -365);
    // } 
}


function checkQueryParams(query_params_object){
  var obj = {}
    if(query_params_object.ulb_code==undefined || query_params_object.ulb_code==null || query_params_object.ulb_code=='all'){
        delete query_params_object.ulb_code;

      }else{
        obj['meta.ulb_code']=query_params_object.ulb_code;
      }
    
    if(query_params_object.district_id==undefined || query_params_object.district_id==null || query_params_object.district_id.toString()==='all'){
       delete query_params_object.district_id;
     }else{
        obj['meta.location.district_id'] = query_params_object.district_id;
     }

     if(query_params_object.facility_type==undefined || query_params_object.facility_type==null || query_params_object.facility_type.toString()==='all'){
        delete query_params_object.facility_type;
     }else{
        console.log("facility_type")
        obj['meta.facility.facility_type'] = query_params_object.facility_type;
     }

    if(query_params_object.facility_id==undefined || query_params_object.facility_id==null || query_params_object.facility_id.toString()==='all'){
       delete query_params_object.facility_id;
      }
      else{
          console.log('query_params_object.facility_id',query_params_object.facility_id)
          obj['meta.facility.facility_generic_id']=query_params_object.facility_id;
      }

      if(query_params_object.district_name==undefined || query_params_object.district_name==null || query_params_object.district_name.toString()==='all'){
        delete query_params_object.district_name;
      }
      else{
          console.log('query_params_object.facility_id',query_params_object.facility_id)
          obj['meta.location.district_name'] = query_params_object.district_name;
      }
      if(query_params_object.ward==undefined || query_params_object.ward==null || query_params_object.ward.toString()==='all'){
       delete query_params_object.ward;
      }
      else{
          console.log('query_params_object.facility_id',query_params_object.facility_id)
          obj['meta.location.ward']=query_params_object.ward;
      }

    return obj;
}




router.get("/summary", auth, async (req, res) => {
  try {     
     var now = new Date();
     var timeStatusVal = req.query.timeStatus;
     var time_filter =  setTimeFilter(req.query)
     let filter_obj = checkQueryParams(req.query)
         filter_obj['submitted_at'] = {$gte:time_filter,$lte:now};
   //   var obj={'meta.ulb_code':'', 'meta.location.district_id':'',submitted_at: {$gte:time_filter,$lte:now}}
   //   if(req.query.ulb_code =='all' || (req.query.ulb_code=='all' && req.query.district_id=='all')){
   //       delete obj['meta.ulb_code'];
   //       delete  obj['meta.location.district_id'];
   //   }else if(req.query.district_id=='all'){
   //       obj['meta.ulb_code']=req.query.ulb_code
   //       delete  obj['meta.location.district_id'];
   //    }
   //   else{
   //     obj['meta.ulb_code']=req.query.ulb_code,
   //     obj['meta.location.district_id']=req.query.district_id
   //   }
   // console.log("obj",obj)
      
     let data = await FormResponse.aggregate([
       { $match: {$or:[filter_obj]} },
           // { $match: {$and:[
           //             {"meta.location.district_id": '328'},
           //                {"$expr": 
           //                     { "$eq":
           //                         [{ "$dayOfWeek": "$submitted_at" },7] }
           //                  }]
           //             }
           //         },

    // {
    //    $project : {
    //         year : {
    //             $year : "$submitted_at"
    //         },
    //         month : {
    //             $month : "$submitted_at"
    //         },
    //         week : {
    //             $week : "$submitted_at"
    //         },
    //         day : {
    //             $dayOfWeek : "$submitted_at"
    //         },

    //         "meta.ulb_code":1,
    //         "response.drywaste_received":1,
    //         "response.sanitary_waste":1,
    //         "response.sanitary_waste":1,
    //         "response.quan_sent_landfill":1,
    //         "response.comp_sold":1,
    //         "response.comp_generated":1,
    //         "response.recyc_sold":1,
    //         "response.quan_ewaste":1,
    //         "response.mixedwaste_received":1,
    //         "response.revenue_generated":1,
    //         "response.wetwaste_received":1 
    //     }
    //   },
                
      {
        $group: {
          // _id: {
          //   $month: '$submitted_at'
          // },
          _id: {
                id: "$meta.ulb_code",
          },
          drywaste_received: {
            $sum: {
              $convert: { input: "$response.drywaste_received", to: "double" },
            },
          },
          sanitary_waste: {
            $sum: {
              $convert: { input: "$response.sanitary_waste", to: "double" },
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
          quan_sent_landfill: {
            $sum: {
              $convert: { input: "$response.quan_sent_landfill", to: "double" },
            },
          },
          mixedwaste_received: {
            $sum: {
              $convert: { input: "$response.mixedwaste_received", to: "double" },
            },
          },
          quan_incinerated: {
            $sum: {
              $convert: { input: "$response.quan_incinerated", to: "double" },
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
          dom_hazard_quan_disposed: {
            $sum: {
              $convert: { input: "$response.dom_hazard_quan_disposed", to: "double" },
            },
          },
          ewaste_quan_disposed: {
            $sum: {
              $convert: { input: "$response.ewaste_quan_disposed", to: "double" },
            },
          },
          fine_collected:{
              $sum:{$convert:{input:'$response.fine_collected',to:"double"}}
          },
          fee_collected:{
              $sum:{$convert:{input:'$response.fee_collected',to:"double"}}
          },
          recyc_sold: {
            $sum: { $convert: { input: "$response.recyc_sold", to: "double" } },
          },
          amt_received: {
            $sum: {
              $convert: { input: "$response.amt_received", to: "double" },
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
        }
      }
     

    ]);

    let final_dashboad_data ={'data':[]};
        if(data.length==0){
          let prep_obj = prepapre_object_empty();
           if (prep_obj !== null) {
             final_dashboad_data['data'].push(prep_obj);
          }
          res.status(200).send(final_dashboad_data);
        }else if(data.length>1){
            for(var i =0;i<data.length;i++){
                 delete data[i]._id 
             }
             let result = data.reduce(
                  (a, c) => (Object.keys(c).forEach(k => (a[k] = (a[k] || 0) + c[k])), a), {});
             let prep_obj = prepapre_object(result);
             if (prep_obj !== null) {
              final_dashboad_data['data'].push(prep_obj);

            }
            res.status(200).send(final_dashboad_data);
        }
        else{
           data.forEach((item, i) => {
             let prep_obj = prepapre_object(item);
               if (prep_obj !== null) {
                 final_dashboad_data['data'].push(prep_obj);
          }
    
    });

    res.status(200).send(final_dashboad_data);
  }
}
 catch (error) {
    console.log(error);
    res.status(400).send("server error");
  }
});


// function concateObject(data){
//     console.log("test>>>",data);
//    var result = [data.reduce((acc, n) => {
//               console.log("ss",acc);
//               console.log("n",n)
//        for (var prop in n) {
//          if (acc.hasOwnProperty(prop)) acc[prop] += n[prop];
//            else acc[prop] = n[prop];
//          }
//       return acc;
//    }, {})]
// }


router.get("/wet_waste", auth, async (req, res) => {
  try {     
     var now = new Date();

     var timeStatusVal = req.query.timeStatus;
     
     var time_filter =  setTimeFilter(req.query)

    let filter_object = checkQueryParams(req.query)
        filter_object['submitted_at'] = {$gte:time_filter,$lte:now};
        console.log("filter_object",filter_object);
       

     let data = await FormResponse.aggregate([
       { $match: {$and:[filter_object]} },
          
                
      {
        $group: {
          _id: {
                district_id:"$meta.location.district_id",
                id: "$meta.ulb_code"
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
          
          comp_sold: {
            $sum: { $convert: { input: "$response.comp_sold", to: "double" } },
          },
           comp_packed: {
            $sum: {
              $convert: { input: "$response.comp_packed", to: "double" },
            },
          }
        }
      }
     

    ]);
     let final_dashboad_data ={summary_view:[],details_view:[]};
     let details_object = await wetWasteDetails(filter_object);
        if(data.length==0){
          let prep_obj = prepapre_object_wet_empty();
           if (prep_obj !== null) {
             final_dashboad_data['summary_view'].push(prep_obj);
             final_dashboad_data['details_view']=details_object;
          }
          res.status(200).send(final_dashboad_data);
        }else if(data.length>1){
             for(var i =0;i<data.length;i++){
                 delete data[i]._id 
             }
             let result = data.reduce(
                  (a, c) => (Object.keys(c).forEach(k => (a[k] = (a[k] || 0) + c[k])), a), {});
             let prep_obj = prepapre_object_wet(result);
             if (prep_obj !== null) {
              final_dashboad_data['summary_view'].push(prep_obj);
              final_dashboad_data['details_view']=details_object;

            }
            res.status(200).send(final_dashboad_data);
        }
        else{
          data.forEach((item, i) => {
          let prep_obj = prepapre_object_wet(item);
           if (prep_obj !== null) {
             final_dashboad_data['summary_view'].push(prep_obj);
             final_dashboad_data['details_view']=details_object;
          }
    
    });

    res.status(200).send(final_dashboad_data);
  }
}
 catch (error) {
    console.log(error);
    res.status(400).send("server error");
  }
});


router.get("/financial_metric", auth, async (req, res) => {
  try {     
     var now = new Date();

     var timeStatusVal = req.query.timeStatus;
     
     var time_filter =  setTimeFilter(req.query)

    let filter_object = checkQueryParams(req.query)
        filter_object['submitted_at'] = {$gte:time_filter,$lte:now};
        console.log("filter_object",filter_object);
       

     let data = await FormResponse.aggregate([
       { $match: {$or:[filter_object]} },
          
                
      {
        $group: {
          _id: {
                district_id:"$meta.location.district_id",
                id: "$meta.ulb_code"
           },
           fine_collected:{
              $sum:{$convert:{input:'$response.fine_collected',to:"double"}}
          },
          fee_collected:{
              $sum:{$convert:{input:'$response.fee_collected',to:"double"}}
          },
          recyc_sold: {
            $sum: { $convert: { input: "$response.recyc_sold", to: "double" } },
          },

           amt_received: {
            $sum: {
              $convert: { input: "$response.amt_received", to: "double" },
            },
          },
          revenue_generated: {
            $sum: {
              $convert: { input: "$response.revenue_generated", to: "double" },
            },
          },
          
          comp_sold: {
            $sum: { $convert: { input: "$response.comp_sold", to: "double" } },
          },
        }
      }
     

    ]);
     let final_dashboad_data ={summary_view:[],details_view:[]};
     let details_object = await financialMetricDetails(filter_object);
        if(data.length==0){
          let prep_obj = prepapre_object_financial_empty();
           if (prep_obj !== null) {
             final_dashboad_data['summary_view'].push(prep_obj);
             final_dashboad_data['details_view']=details_object;
          }
          res.status(200).send(final_dashboad_data);
        }else if(data.length>1){
             for(var i =0;i<data.length;i++){
                 delete data[i]._id 
             }
             let result = data.reduce(
                  (a, c) => (Object.keys(c).forEach(k => (a[k] = (a[k] || 0) + c[k])), a), {});
             let prep_obj = prepapre_object_financial(result);
             if (prep_obj !== null) {
              final_dashboad_data['summary_view'].push(prep_obj);
              final_dashboad_data['details_view']=details_object;

            }
            res.status(200).send(final_dashboad_data);
        }
        else{
          data.forEach((item, i) => {
          let prep_obj = prepapre_object_financial(item);
           if (prep_obj !== null) {
             final_dashboad_data['summary_view'].push(prep_obj);
             final_dashboad_data['details_view']=details_object;
          }
    
    });

    res.status(200).send(final_dashboad_data);
  }
}
 catch (error) {
    console.log(error);
    res.status(400).send("server error");
  }
});


router.get("/operational_metric_ward", auth, async (req, res) => {
  try {     
     var now = new Date();

     var timeStatusVal = req.query.timeStatus;
     
     var time_filter =  setTimeFilter(req.query)

    let filter_object = checkQueryParams(req.query)
        filter_object['submitted_at'] = {$gte:time_filter,$lte:now};
        console.log("filter_object",filter_object);
       

     let data = await FormResponse.aggregate([
       { $match: {$or:[filter_object]} },
          
                
      {
        $group: {
          _id: {
                district_id:"$meta.location.district_id",
                id: "$meta.ulb_code"
           },
           mixedwaste_received: {
            $sum: {
              $convert: { input: "$response.mixedwaste_received", to: "double" },
            },
          },
           wetwaste_received: {
            $sum: {
              $convert: { input: "$response.wetwaste_received", to: "double" },
            },
          },
          drywaste_received: {
            $sum: {
              $convert: { input: "$response.drywaste_received", to: "double" },
            },
          },    
         
        }
      }
     

    ]);
     let final_dashboad_data ={summary_view:[],details_view:[]};
     let details_object = await operationalMetricWardDetails(filter_object);
        if(data.length==0){
          let prep_obj = prepapre_object_operational_ward_empty();
           if (prep_obj !== null) {
             final_dashboad_data['summary_view'].push(prep_obj);
             final_dashboad_data['details_view']=details_object;
          }
          res.status(200).send(final_dashboad_data);
        }else if(data.length>1){
             for(var i =0;i<data.length;i++){
                 delete data[i]._id 
             }
             let result = data.reduce(
                  (a, c) => (Object.keys(c).forEach(k => (a[k] = (a[k] || 0) + c[k])), a), {});
             let prep_obj = prepapre_object_operational_ward(result);
             if (prep_obj !== null) {
              final_dashboad_data['summary_view'].push(prep_obj);
              final_dashboad_data['details_view']=details_object;

            }
            res.status(200).send(final_dashboad_data);
        }
        else{
          data.forEach((item, i) => {
          let prep_obj = prepapre_object_operational_ward(item);
           if (prep_obj !== null) {
             final_dashboad_data['summary_view'].push(prep_obj);
             final_dashboad_data['details_view']=details_object;
          }
    
    });

    res.status(200).send(final_dashboad_data);
  }
}
 catch (error) {
    console.log(error);
    res.status(400).send("server error");
  }
});


router.get("/operational_metric", auth, async (req, res) => {
  try {     
     var now = new Date();

     var timeStatusVal = req.query.timeStatus;
     
     var time_filter =  setTimeFilter(req.query)

    let filter_object = checkQueryParams(req.query)
        filter_object['submitted_at'] = {$gte:time_filter,$lte:now};
        console.log("filter_object",filter_object);
       
    let data = await FormResponse.aggregate([
       { $match: {$or:[filter_object]} },
          
                
      {
        $group: {
          _id: {
                district_id:"$meta.location.district_id",
                id: "$meta.ulb_code"
           },
           utilisation_mode:{
              $sum:{$convert:{input:'$response.recyc_sold',to:"double"}}
          },
          
          }
      }
     

    ]);
     let final_dashboad_data ={summary_view:[],details_view:[]};
     let details_object = await operationalMetricDetails(filter_object);
        if(data.length==0){
          let prep_obj = prepapre_object_operational_empty();
           if (prep_obj !== null) {
             final_dashboad_data['summary_view'].push(prep_obj);
             final_dashboad_data['details_view']=details_object;
          }
          res.status(200).send(final_dashboad_data);
        }else if(data.length>1){
             for(var i =0;i<data.length;i++){
                 delete data[i]._id 
             }
             let result = data.reduce(
                  (a, c) => (Object.keys(c).forEach(k => (a[k] = (a[k] || 0) + c[k])), a), {});
             let prep_obj = prepapre_object_operational(result);
             if (prep_obj !== null) {
              final_dashboad_data['summary_view'].push(prep_obj);
              final_dashboad_data['details_view']=details_object;

            }
            res.status(200).send(final_dashboad_data);
        }
        else{
          data.forEach((item, i) => {
          let prep_obj = prepapre_object_operational(item);
           if (prep_obj !== null) {
             final_dashboad_data['summary_view'].push(prep_obj);
             final_dashboad_data['details_view']=details_object;
          }
    
    });

    res.status(200).send(final_dashboad_data);
  }
}
 catch (error) {
    console.log(error);
    res.status(400).send("server error");
  }
});



router.get("/dry_waste", auth, async (req, res) => {
  try {     
     var now = new Date();

     var timeStatusVal = req.query.timeStatus;
     
     var time_filter =  setTimeFilter(req.query)

    let filter_object = checkQueryParams(req.query)
        filter_object['submitted_at'] = {$gte:time_filter,$lte:now};
        console.log("filter_object",filter_object);
       

     let data = await FormResponse.aggregate([
       { $match: {$or:[filter_object]} },
          
                
      {
        $group: {
          // _id: {
          //   $month: '$submitted_at'
          // },
          _id: {
                district_id:"$meta.location.district_id",
                id: "$meta.ulb_code"
           },

          drywaste_received: {
            $sum: {
              $convert: { input: "$response.drywaste_received", to: "double" },
            },
          },
          
          quan_sent_landfill: {
            $sum: {
              $convert: { input: "$response.quan_sent_landfill", to: "double" },
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
        
          recyc_sold: {
            $sum: { $convert: { input: "$response.recyc_sold", to: "double" } },
          },
          
        }
      }
     

    ]);
     let final_dashboad_data ={summary_view:[],details_view:[]};
     let details_object = await dryWasteDetails(filter_object);
        if(data.length==0){
          let prep_obj = prepapre_object_dry_empty();
           if (prep_obj !== null) {
             final_dashboad_data['summary_view'].push(prep_obj);
             final_dashboad_data['details_view']=details_object;
          }
          res.status(200).send(final_dashboad_data);
        }else if(data.length>1){
             for(var i =0;i<data.length;i++){
                 delete data[i]._id 
             }
             let result = data.reduce(
                  (a, c) => (Object.keys(c).forEach(k => (a[k] = (a[k] || 0) + c[k])), a), {});
             let prep_obj = prepapre_object_dry(result);
             if (prep_obj !== null) {
              final_dashboad_data['summary_view'].push(prep_obj);
              final_dashboad_data['details_view']=details_object;

            }
            res.status(200).send(final_dashboad_data);
        }
        else{
          data.forEach((item, i) => {
          let prep_obj = prepapre_object_dry(item);
           if (prep_obj !== null) {
             final_dashboad_data['summary_view'].push(prep_obj);
             final_dashboad_data['details_view']=details_object;
          }
    
    });

    res.status(200).send(final_dashboad_data);
  }
}
 catch (error) {
    console.log(error);
    res.status(400).send("server error");
  }
});


router.get("/leaderboard/facility", auth, async (req, res) => {
  try {     
     var now = new Date();

     var timeStatusVal = req.query.timeStatus;
     
     var time_filter =  setTimeFilter(req.query)

    let filter_object = checkQueryParams(req.query)
        //filter_object['submitted_at'] = {$gte:time_filter,$lte:now};
        console.log("filter_object",filter_object);
       

     let data = await FormResponse.aggregate([
       { $match: {$or:[filter_object]} },
          
                
      {
        $group: {
          // _id: {
          //   $month: '$submitted_at'
          // },
          _id: {
                //district_id:"$meta.location.district_id",,
                ulb:'$meta.ulb_code',
                district_name:'$meta.location.district_name',
                facility_name:'$meta.facility.name',
                facility_type:'$meta.facility.facility_type'
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
          quan_sent_landfill: {
            $sum: {
              $convert: { input: "$response.quan_sent_landfill", to: "double" },
            },
          },
          amt_received: {
            $sum: {
              $convert: { input: "$response.amt_received", to: "double" },
            },
          },
          recyc_sold: {
            $sum: { $convert: { input: "$response.recyc_sold", to: "double" } },
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
          revenue_generated: {
            $sum: {
              $convert: { input: "$response.revenue_generated", to: "double" },
            },
          },
          comp_sold: {
            $sum: { $convert: { input: "$response.comp_sold", to: "double" } },
          },
          
        }
      }
     

    ]);
     let final_dashboad_data ={details_view:[]};
     //let details_object = await dryWasteDetails(filter_object);
        if(data.length==0){
          let prep_obj = prepapre_object_leaderboard_facility_empty();
           if (prep_obj !== null) {
             final_dashboad_data['details_view'].push(prep_obj);
          }
          res.status(200).send(final_dashboad_data);
        }
          
        // }else if(data.length>1){
        //      for(var i =0;i<data.length;i++){
        //          delete data[i]._id 
        //      }
        //      let result = data.reduce(
        //           (a, c) => (Object.keys(c).forEach(k => (a[k] = (a[k] || 0) + c[k])), a), {});
        //      let prep_obj = prepapre_object_dry(result);
        //      if (prep_obj !== null) {
        //       final_dashboad_data['summary_view'].push(prep_obj);
        //       final_dashboad_data['details_view']=details_object;

        //     }
        //     res.status(200).send(final_dashboad_data);
        // }
        else{
          data.forEach((item, i) => {
          let prep_obj = prepapre_object_leaderboard_facility(item);
           if (prep_obj !== null) {
             final_dashboad_data['details_view'].push(prep_obj);
             
          }
    
    });

    res.status(200).send(final_dashboad_data);
  }
}
 catch (error) {
    console.log(error);
    res.status(400).send("server error");
  
  }
});


router.get("/leaderboard/ulb", auth, async (req, res) => {
  try {     
     var now = new Date();

     var timeStatusVal = req.query.timeStatus;
     
     var time_filter =  setTimeFilter(req.query)

    let filter_object = checkQueryParams(req.query)
        filter_object['submitted_at'] = {$gte:time_filter,$lte:now};
        console.log("filter_object",filter_object);
       

     let data = await FormResponse.aggregate([
       { $match: {$or:[filter_object]} },
          
                
      {
        $group: {
          // _id: {
          //   $month: '$submitted_at'
          // },
          _id: {
                //district_id:"$meta.location.district_id",,
                ulb:'$meta.ulb_code',
                district_name:'$meta.location.district_name',
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
          fee_collected:{
              $sum:{$convert:{input:'$response.fee_collected',to:"double"}}
          },
          quan_ewaste: {
            $sum: {
              $convert: { input: "$response.quan_ewaste", to: "double" },
            },
          },
          mixedwaste_received: {
            $sum: {
              $convert: { input: "$response.mixedwaste_received", to: "double" },
            },
          },
          quan_sent_landfill: {
            $sum: {
              $convert: { input: "$response.quan_sent_landfill", to: "double" },
            },
          },
          amt_received: {
            $sum: {
              $convert: { input: "$response.amt_received", to: "double" },
            },
          },
          recyc_sold: {
            $sum: { $convert: { input: "$response.recyc_sold", to: "double" } },
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
          revenue_generated: {
            $sum: {
              $convert: { input: "$response.revenue_generated", to: "double" },
            },
          },
          comp_sold: {
            $sum: { $convert: { input: "$response.comp_sold", to: "double" } },
          },
          
        }
      }
     

    ]);
     let final_dashboad_data ={details_view:[]};
     //let details_object = await dryWasteDetails(filter_object);
        if(data.length==0){
          let prep_obj = prepapre_object_leaderboard_ulb_empty();
           if (prep_obj !== null) {
             final_dashboad_data['details_view'].push(prep_obj);
          }
          res.status(200).send(final_dashboad_data);
        }
          
        // }else if(data.length>1){
        //      for(var i =0;i<data.length;i++){
        //          delete data[i]._id 
        //      }
        //      let result = data.reduce(
        //           (a, c) => (Object.keys(c).forEach(k => (a[k] = (a[k] || 0) + c[k])), a), {});
        //      let prep_obj = prepapre_object_dry(result);
        //      if (prep_obj !== null) {
        //       final_dashboad_data['summary_view'].push(prep_obj);
        //       final_dashboad_data['details_view']=details_object;

        //     }
        //     res.status(200).send(final_dashboad_data);
        // }
        else{
          data.forEach((item, i) => {
          let prep_obj = prepapre_object_leaderboard_ulb(item);
           if (prep_obj !== null) {
             final_dashboad_data['details_view'].push(prep_obj);
             
          }
    
    });

    res.status(200).send(final_dashboad_data);
  }
}
 catch (error) {
    console.log(error);
    res.status(400).send("server error");
  
  }
});


async function dryWasteDetails(query_object){
    let data =  await FormResponse.aggregate([
       { $match: {$or:[query_object]} },
      {
        $group: {
          _id: {
                facilityId:'$meta.facility.facility_type_id',
                 ulb:'$meta.ulb_code',
                district_name:'$meta.location.district_name',
                district_id:'$meta.location.district_id'
           },
          sanitary_waste: {
            $sum: {
              $convert: { input: "$response.sanitary_waste", to: "double" },
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
          quan_sent_landfill: {
            $sum: {
              $convert: { input: "$response.quan_sent_landfill", to: "double" },
            },
          },
           recyc_sold: {
            $sum: { $convert: { input: "$response.recyc_sold", to: "double" } },
          },
      }
    }  
    ]);
      let final_dashboad_data = [];
        if(data.length==0){
          let prep_obj = prepapre_object_dry_details_empty();
           if (prep_obj !== null) {
             final_dashboad_data.push(prep_obj);
          }
         return final_dashboad_data;
        }else{
          data.forEach((item, i) => {
          let prep_obj = prepapre_object_dry_details(item);
           if (prep_obj !== null) {
             final_dashboad_data.push(prep_obj);
          }
    
    });
    return final_dashboad_data
  }
}
 


 async function operationalMetricDetails(query_object){
    let data =  await FormResponse.aggregate([
       { $match: {$or:[query_object]} },
      {
        $group: {
          _id: {
                facilityId:'$meta.facility.facility_type_id',
                ulb:'$meta.ulb_code',
                district_name:'$meta.location.district_name',
                district_id:'$meta.location.district_id',
                facility_type:'$meta.facility.facility_type'
           },
         mixedwaste_received: {
            $sum: {
              $convert: { input: "$response.mixedwaste_received", to: "double" },
            },
          },
           wetwaste_received: {
            $sum: {
              $convert: { input: "$response.wetwaste_received", to: "double" },
            },
          },
          drywaste_received: {
            $sum: {
              $convert: { input: "$response.drywaste_received", to: "double" },
            },
          },    
      }
    }  
    ]);
      let final_dashboad_data = [];
        if(data.length==0){
          let prep_obj = prepapre_object_operational_details_empty();
           if (prep_obj !== null) {
             final_dashboad_data.push(prep_obj);
          }
         return final_dashboad_data;
        }else{
          data.forEach((item, i) => {
          let prep_obj = prepapre_object_operational_details(item);
           if (prep_obj !== null) {
             final_dashboad_data.push(prep_obj);
          }
    
    });
    return final_dashboad_data
  }
}

 async function operationalMetricWardDetails(query_object){
    let data =  await FormResponse.aggregate([
       { $match: {$or:[query_object]} },
      {
        $group: {
          _id: {
                facilityId:'$meta.facility.facility_type_id',
                ulb:'$meta.ulb_code',
                district_name:'$meta.location.district_name',
                district_id:'$meta.location.district_id',
                facility_type:'$meta.facility.facility_type',
                ward:'$meta.location.ward'
           },
         mixedwaste_received: {
            $sum: {
              $convert: { input: "$response.mixedwaste_received", to: "double" },
            },
          },
           wetwaste_received: {
            $sum: {
              $convert: { input: "$response.wetwaste_received", to: "double" },
            },
          },
          drywaste_received: {
            $sum: {
              $convert: { input: "$response.drywaste_received", to: "double" },
            },
          },    
      }
    }  
    ]);
      let final_dashboad_data = [];
        if(data.length==0){
          let prep_obj = prepapre_object_operational_ward_details_empty();
           if (prep_obj !== null) {
             final_dashboad_data.push(prep_obj);
          }
         return final_dashboad_data;
        }else{
          data.forEach((item, i) => {
          let prep_obj = prepapre_object_operational_ward_details(item);
           if (prep_obj !== null) {
             final_dashboad_data.push(prep_obj);
          }
    
    });
    return final_dashboad_data
  }
}
 



// router.get("/wet_waste/details", auth, async (req, res) => {
//   try {     
//      var now = new Date();

//      var timeStatusVal = req.query.timeStatus;
     
//      var time_filter =  setTimeFilter(req.query.timeStatus)

//     let filter_object = checkQueryParams(req.query)
//         filter_object['submitted_at'] = {$gte:time_filter,$lte:now};
//      let data = await FormResponse.aggregate([
//        { $match: {$or:[filter_object]} },
//       {
//         $group: {
//           _id: {
//                 facilityId:'$meta.facility.facility_type_id',
//                 ulb:'$meta.ulb_code',
//                 district_name:'$meta.location.district_name',
//                 district_id:'$meta.location.district_id'
//            },
//           wetwaste_received: {
//             $sum: {
//               $convert: { input: "$response.wetwaste_received", to: "double" },
//             },
//           },
//           comp_generated: {
//             $sum: {
//               $convert: { input: "$response.comp_generated", to: "double" },
//             },
//           },
//           comp_generated: {
//             $sum: {
//               $convert: { input: "$response.comp_generated", to: "double" },
//             },
//           },
//           comp_sold: {
//             $sum: { $convert: { input: "$response.comp_sold", to: "double" } },
//           },
//         }
//       }
     

//     ]);
//     console.log(data)
//     let final_dashboad_data ={data:[]};
//     console.log(final_dashboad_data);
//         if(data.length==0){
//           let prep_obj = prepapre_object_wet_details_empty();
//            if (prep_obj !== null) {
//              final_dashboad_data['data'].push(prep_obj);
//           }
//           res.status(200).send(final_dashboad_data);
//         }else{
//           data.forEach((item, i) => {
//           let prep_obj = prepapre_object_wet_details(item);
//            if (prep_obj !== null) {
//              final_dashboad_data['data'].push(prep_obj);
//           }
    
//     });

//     res.status(200).send(final_dashboad_data);
//   }
// }
//  catch (error) {
//     console.log(error);
//     res.status(400).send("server error");
//   }
// });

 async function financialMetricDetails(query_object){
    let data =  await FormResponse.aggregate([
       { $match: {$or:[query_object]} },
      {
        $group: {
          _id: {
                facilityId:'$meta.facility.facility_generic_id',
                ulb:'$meta.ulb_code',
                district_name:'$meta.location.district_name',
                district_id:'$meta.location.district_id',
                facility_type:'$meta.facility.facility_type'
           },
          fine_collected:{
              $sum:{$convert:{input:'$response.fine_collected',to:"double"}}
          },
          fee_collected:{
              $sum:{$convert:{input:'$response.fee_collected',to:"double"}}
          },
          recyc_sold: {
            $sum: { $convert: { input: "$response.recyc_sold", to: "double" } },
          },

           amt_received: {
            $sum: {
              $convert: { input: "$response.amt_received", to: "double" },
            },
          },
          revenue_generated: {
            $sum: {
              $convert: { input: "$response.revenue_generated", to: "double" },
            },
          },
          
          comp_sold: {
            $sum: { $convert: { input: "$response.comp_sold", to: "double" } },
          },
        
        }
      }  
    ]);
    let final_dashboad_data = [];
        if(data.length==0){
          let prep_obj = prepapre_object_financial_details_empty();
           if (prep_obj !== null) {
             final_dashboad_data.push(prep_obj);
          }
         return final_dashboad_data;
        }else{
          data.forEach((item, i) => {
          let prep_obj = prepapre_object_financial_details(item);
           if (prep_obj !== null) {
             final_dashboad_data.push(prep_obj);
          }
    
    });
    return final_dashboad_data
  }
}


 async function wetWasteDetails(query_object){
    let data =  await FormResponse.aggregate([
       { $match: {$or:[query_object]} },
      {
        $group: {
          _id: {
                facilityId:'$meta.facility.facility_type_id',
                ulb:'$meta.ulb_code',
                district_name:'$meta.location.district_name',
                district_id:'$meta.location.district_id'
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
          comp_generated: {
            $sum: {
              $convert: { input: "$response.comp_generated", to: "double" },
            },
          },
          comp_sold: {
            $sum: { $convert: { input: "$response.comp_sold", to: "double" } },
          },
        }
      }  
    ]);
    let final_dashboad_data = [];
        if(data.length==0){
          let prep_obj = prepapre_object_wet_details_empty();
           if (prep_obj !== null) {
             final_dashboad_data.push(prep_obj);
          }
         return final_dashboad_data;
        }else{
          data.forEach((item, i) => {
          let prep_obj = prepapre_object_wet_details(item);
           if (prep_obj !== null) {
             final_dashboad_data.push(prep_obj);
          }
    
    });
    return final_dashboad_data
  }
}
 




module.exports = router;
