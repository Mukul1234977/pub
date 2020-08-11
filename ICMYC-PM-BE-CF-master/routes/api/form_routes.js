const express = require("express");
const router = express.Router();
var ObjectId = require('mongodb').ObjectID;
var request = require("request");
const Form = require("../../models/Form");
const FormResponse = require("../../models/Response");

// import middleward
const auth = require("../../middleware/auth");
const fetchDropdown = require("../../middleware/fetchDropdown");

// @route GET api/form/test
// @desc 
// @access PRIVATE

router.get("/", async (req,res) =>{
        res.status(200).send("FORM API WORKING")
})

router.get("/test", auth, async (req,res) =>{

  console.log(req.user);
    try {
        res.status(200).send(req.user)
    } catch (error) {
        res.status(500).send("Server Error");
    }
   
})


// @route GET api/form/forms/?query
// @desc GET Forms
// @access PRIVATE
router.get("/forms/", auth, async (req, res) => {
  try {
    // console.log(req.query);
    let language = req.user.language;
    let expression_array = [];
      // role will be set from token values
    expression_array.push({'role.value': {$in : req.user.roles.map(item => item.name )}});
    let facilities;
    if (req.user.facility.length === undefined) {
      facilities = [req.user.facility.facility_type];
    } else {
      facilities = req.user.facility.map((item) => item.facility_type);
    }
    expression_array.push({'type.value':{$in : facilities}});
    expression_array.push({title: { $elemMatch: {code:language}}});
    expression_array.push({description: {$elemMatch: {code:language}}});
    let queryObject = {$and: expression_array};
    // if(req.query.state !== undefined){
    //   queryObject['state.value'] = {$eq : req.query.state};
    // }
    // if(req.query.city !== undefined){
    //   queryObject['city.value'] = {$eq : req.query.city};
    // }
    // if(req.query.civic_agency !== undefined){
    //   queryObject['civic_agency.value'] = {$eq : req.query.civic_agency};
    // }
    // if(req.query.action !== undefined){
    //   queryObject['action.value'] = {$eq : req.query.action};
    // }
    // if(req.query.categories !== undefined){
    //   queryObject['categories.value'] = {$eq : req.query.categories};
    // }
    
    const all_forms = await Form.find(queryObject)
      .sort({ order: 1 })
      .lean()
    // console.log(all_forms.length)
    if(all_forms.length === 0){
      return res.status(400).send({message:"No forms available",facilities:facilities})
    }
      
    all_forms.map(  (item,i) =>{
      all_forms[i].title = item.title[0].label;
      all_forms[i].description = item.description[0].label;
    })

    res.json(all_forms);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});



router.get("/form/:id", auth, async (req, res) => {
  try {
     console.log("hhh",req.user)
    let queryObject = {};
    let expression_array = [];

    const form_id = req.params.id;
    const language = req.user.language;
    // expression_array.push({'role.value': {$in : req.user.roles.map(item => item.name )}});
    // expression_array.push({title: { $elemMatch: {code:language}}});
    // expression_array.push({description: {$elemMatch: {code:language}}});
    // expression_array.push({'fields.field_title': {$elemMatch:{code:language}}});
    expression_array.push({_id: form_id});
    queryObject = {$and: expression_array};
    let form_doc = await Form.findOne(queryObject).lean();
    console.log("form_doc",form_doc)
    
    if(form_doc === null || form_doc === undefined){
      return res.status(400).send({message:'No form found'})
    }
     let new_form_object =  await setCityId(form_doc,req.user.location.city_id)

    new_form_object.title = new_form_object.title[0].label;
    console.log(form_doc)
    new_form_object.description = new_form_object.description[0].label;
    console.log(form_doc.description)
    
    let fields = new_form_object.fields;
    let field_data = {};
    await Promise.all(fields.map(async (item,i) => {
      if(item.action === "api"){
        // console.log(item.action)
        let language_query = fields[i].query !=="" ? `&language=${language}` :`?language=${language}`;
        const api_end_point = fields[i].end_point + "?"+fields[i].query + language_query;
        field_data[`${item.name}`] = await fetchDropdown(req,res,api_end_point)
      }
    }));

    fields.map( (item, i) => {
      let filtered_field_title = new_form_object.fields[i].field_title.filter(item => {
        return item.code === language
      })
      new_form_object.fields[i].field_title = filtered_field_title.length > 0 ? filtered_field_title[0].label : ""
      if(item.action === "api"){
        new_form_object.fields[i].values = field_data[`${item.name}`];
      }
    })


       res.json(new_form_object);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});
  

async function setCityId(field_objects,city_id){
   for(var i = 0; i < field_objects.fields.length; i++){
           if(field_objects.fields[i].action=='api'){
               let query_str = field_objects.fields[i].query.length;
                 let query_opt = field_objects.fields[i].query.charAt(query_str-1)
                 if(query_opt=='&'){
			 if(query_str==1){
				 field_objects.fields[i].query = "city_id="+city_id;
			 }
			 else{
			     field_objects.fields[i].query = field_objects.fields[i].query+"city_id="+city_id;
			 }
                       
                 }
            }
          }   
   return field_objects;
}

// @route GET api/form/forms/
// @desc GET Forms
// @access PRIVATE
router.post("/create_form/", auth, async (req, res) => {
  try {
    
    // console.log(req.body);
    let form_object = req.body;
   const form = await new Form(form_object).save()
   console.log("form created")
   res.json(form);
    // res.send("Form created");
  } catch (err) {
    console.error(err.message);
    res.status(500).send({message:err.message});
  }
});

// @route GET api/form/forms/
// @desc GET Forms
// @access PRIVATE
router.post("/delete_form/:form_id", auth, async (req, res) => {
  try {
    
    let form_id = req.params.form_id;
    // let form_object = req.body;
   const form = await  Form.findByIdAndDelete(form_id)
  //  await form.delete()
   console.log("form deleted")
   res.json({success:true,message:"Form deleted"});
    // res.send("Form created");
  } catch (err) {
    console.error(err.message);
    res.status(500).send({message:err.message});
  }
});

// @route GET api/form/forms/
// @desc GET Forms
// @access PRIVATE
router.post("/update_form/:form_id", auth, async (req, res) => {
  try {

    
  let form_id = req.params.form_id;
  let form_object = req.body;
  form_object._id = ObjectId(form_id)
  let new_mongo_ob = new Form(form_object);
  await Form.findByIdAndDelete(form_id)
   let form =  await new_mongo_ob.save()
   res.json({success:true,updated_form:form});
    // res.send("Form created");
  } catch (err) {
    console.error(err.message);
    res.status(500).send({message:err.message});
  }
});



// @route POST api/form/record_response/
// @desc POST Record form response
// @access PRIVATE
router.post("/record_response", auth, async (req, res) => {
  try {
    console.log(req.body)
    const form_id = req.body.form_id;
    if(form_id === undefined){
      return res.status(400).send({message:"Invalid form id"})
    }

    let form_object = req.body;
    const form_res = await new FormResponse(form_object).save()
    console.log("Response recorded")
    res.json(form_res);
    // res.send("Form created");
  } catch (err) {
    console.error(err.message);
    res.status(500).send({message:err.message});
  }
});


// @route GET api/form/form_response?queryString
// @desc GET  Reteive form responses
// @access PRIVATE
router.get("/form_responses/:page", auth, async (req, res) => {
  try {
    
    let queryObject = {};
    let page = req.params.page;
    // if(req.query.state !== undefined){
    //   queryObject['state'] = req.query.state;
    // }
    // if(req.query.city !== undefined){
    //   queryObject['city'] = req.query.city;
    // }
    // if(req.query.civic_agency !== undefined){
    //   queryObject['civic_agency'] = req.query.civic_agency;
    // }
    // if(req.query.action !== undefined){
    //   queryObject['action'] = req.query.action
    // }
    // if(req.query.categories !== undefined){
    //   queryObject['categories'] = req.query.categories;
    // }
    
    // console.log(queryObject);

    const all_forms = await FormResponse.find(queryObject)
    .sort({ submitted_at: 1 })
    .skip((page-1)*100)
    .limit(100)
    .lean();

    res.json(all_forms);   

  } catch (err) {
    console.error(err.message);
    res.status(500).send({message:err.message});
  }
});



module.exports = router;
