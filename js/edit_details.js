const ContactDetails_API_URL = "https://defaultad358c3362364cda92e747b5c2b8c1.3e.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/b24e853747874880bdf04493df9ed795/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=7lybcuZ-KGEelJDTz0U2L3FPRgp9_M-09lgHKsKGi3Q";

const BRANDS_API_URL = "https://defaultad358c3362364cda92e747b5c2b8c1.3e.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/b5f43aedd6e74052af9b1e60d9edee12/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=flFE8l3SrhfMjM4lzdF7I8TsEO8E6gr-_9bqhY7QkQw";

const HEAR_ABOUT_API_URL = "https://defaultad358c3362364cda92e747b5c2b8c1.3e.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/6ed010834ac6422ca2679db0d3bf1a67/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=PTWDxa9a_dIVUAXG9xcJFjWaR_VFUa0NBT4yj4kjsk4";

const BUSINESS_EXPERIENCE_API_URL = "https://defaultad358c3362364cda92e747b5c2b8c1.3e.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/1b0ba77a781b4e15a7f047598443a854/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=DIfGi4Vm20b_MXv0VgD7rSZbL9mST7ifzwICuvRNr9c";

const PersonalDetails_API_URL ="https://defaultad358c3362364cda92e747b5c2b8c1.3e.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/d4ba83ff4e96415da1544f419719a9d6/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=WlXAxUPX754-e8HR5gNEfLFEPA9og8B3ABhK4icn1Hg";

const EmploymentDetails_API_URL="https://defaultad358c3362364cda92e747b5c2b8c1.3e.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/4a55e3a2b08d4fd594a67253fe89fbdf/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=raMSIbILhWZ500yB5rjvO3xoWnxDuaZXRv-RmMfx1lA";

const CO_APPLICANT_GET_FLOW_URL="https://defaultad358c3362364cda92e747b5c2b8c1.3e.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/0e96ab320960498284831e1a6b0c0573/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=707zv2aVdFrEhaBUk_nafDMRX_4nGa-th24nY7DJ2EY";

const CO_APPLICANT_POST_FLOW_URL="https://defaultad358c3362364cda92e747b5c2b8c1.3e.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/488910c988d84422b1935f966b1d42bd/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=_kOOYAng0UDg8Al7mF6y6phtcK8JpgU9WRYad7sfB6M";

var loginUserEmail = localStorage.getItem("loginEmail") || "";

let coApplicantIdMap = {
  1: 0,
  2: 0,
  3: 0
};


document.addEventListener("DOMContentLoaded", function () {
   document.getElementById("UserLoginname").innerText =
    `${localStorage.getItem("loginUserFullName")}`;
  
    if (localStorage.getItem("loginUserProfileImage")) {
    document.getElementById("UserProfileImage").src =
      "data:image/png;base64," + localStorage.getItem("loginUserProfileImage");
       

       
  } else {
   
    document.getElementById("UserProfileImage").src = "img/user-circle.png";
 
  }
    $("#ContactEmail").val(loginUserEmail);
const today = new Date().toLocaleDateString("en-CA"); // yyyy-MM-dd
$("#ContactEnquiryDate").val(today);
   
     
  loadBrands();
  loadHearAboutBrand();
  loadBusinessExperience();
  getEnquiryByEmail();
  loadPersonalDetails();
  loadEmploymentDetails();
getCoApplicantsByEmail(loginUserEmail)



    // Hide by default
  $("#PersonalSocialSecurityDiv").hide();
  $("#SpouseNameDiv, #SpouseUSCitizenDiv").hide();

  // US Citizen change
  $("#PersonalUSCitizen").on("change", function () {
    if ($(this).val() === "Yes") {
      $("#PersonalSocialSecurityDiv").slideDown();
    } else {
      $("#PersonalSocialSecurityDiv").slideUp();
      $("#PersonalSocialSecurity").val("");
    }
  });

  // Marital Status change
  $("#PersonalMaritalStatus").on("change", function () {
    if ($(this).val() === "Married") {
      $("#SpouseNameDiv, #SpouseUSCitizenDiv").slideDown();
    } else {
      $("#SpouseNameDiv, #SpouseUSCitizenDiv").slideUp();
      $("#PersonalSpouseName, #PersonalSpouseUSCitizen").val("");
    }
  });
});

function formatDateForInput(dateStr) {
  if (!dateStr) return "";
  return dateStr.split("T")[0];
}
function validatePositiveInteger(input) {
  // Remove anything except digits
  input.value = input.value.replace(/[^0-9]/g, "");

  // Remove leading zeros
  if (input.value.startsWith("0")) {
    input.value = input.value.replace(/^0+/, "");
  }
}
async function loadBrands() {
  try {
    const response = await fetch(BRANDS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    });

    if (!response.ok) throw new Error("API failed");

    let data = await response.json();
    console.log("Brands RAW:", data);

    if (!data.Brands) throw new Error("Brands not found");

    let brands = data.Brands;

    // If string → parse JSON
    if (typeof brands === "string") {
      brands = JSON.parse(brands);
    }

    if (!Array.isArray(brands)) {
      throw new Error("Brands is not an array");
    }

    bindBrands(brands);

  } catch (err) {
    console.error("Brand Load Error:", err);
    alert("Failed to load brands");
  }
}
function bindBrands(brands) {
  const ddl = document.getElementById("ContactbrandsSelect");
  ddl.innerHTML = `<option value="">--Select Brand--</option>`;

  brands.forEach(b => {
    // Support object OR string
    const value = b.ID || b.Id || b;
    const text = b.Title || b.Name || b;

    const opt = document.createElement("option");
    opt.value = value;
    opt.text = text;

    ddl.appendChild(opt);
  });
}



async function loadHearAboutBrand() {
  try {
    const response = await fetch(HEAR_ABOUT_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    });

    if (!response.ok) throw new Error("API call failed");

    let data = await response.json();
    console.log("HearAbout RAW:", data);

    if (!data.HearAboutBrand) {
      throw new Error("HearAboutBrand not found");
    }

    let items = data.HearAboutBrand;

    // If string → parse
    if (typeof items === "string") {
      items = JSON.parse(items);
    }

    if (!Array.isArray(items)) {
      throw new Error("HearAboutBrand is not an array");
    }

    bindHearAboutBrand(items);

  } catch (err) {
    console.error("HearAbout Load Error:", err);
    alert("Failed to load options");
  }
}


function bindHearAboutBrand(items) {
  const ddl = document.getElementById("ContactHearAboutbrand");
  ddl.innerHTML = `<option value="">--Select--</option>`;

  items.forEach(i => {
    const value = i.ID || i.Id || i;
    const text = i.Title || i.Name || i;

    const opt = document.createElement("option");
    opt.value = value;
    opt.text = text;

    ddl.appendChild(opt);
  });
}


async function loadBusinessExperience() {
  try {
    const response = await fetch(BUSINESS_EXPERIENCE_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    });

    if (!response.ok) throw new Error("API call failed");

    let data = await response.json();
    console.log("BusinessExperience RAW:", data);

    if (!data.BusinessExperience) {
      throw new Error("BusinessExperience not found");
    }

    let items = data.BusinessExperience;

    // If response is string JSON → parse
    if (typeof items === "string") {
      items = JSON.parse(items);
    }

    if (!Array.isArray(items)) {
      throw new Error("BusinessExperience is not an array");
    }

    bindBusinessExperience(items);

  } catch (err) {
    console.error("BusinessExperience Load Error:", err);
    alert("Failed to load Business Experience");
  }
}


function bindBusinessExperience(items) {
  const ddl = document.getElementById("ContactBusinessExperience");
  ddl.innerHTML = `<option value="">--Select--</option>`;

  items.forEach(i => {
    const value = i.ID || i.Id || i;
    const text = i.Title || i.Name || i;

    const opt = document.createElement("option");
    opt.value = value;
    opt.text = text;

    ddl.appendChild(opt);
  });
}



/* =========================
   Contact Details
========================= */
async function ContactDetailsData(method,payload) {
  try {
    // build body dynamically
    let requestBody = {};

    if (method === "GET") {
      requestBody = {
        Email: payload.Email,
        Method: "GET"
      };
    } else if (method === "POST") {
      requestBody = {
        ...payload,   // send all fields
        Method: "POST"
      };
    }

    const response = await fetch(ContactDetails_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error("API failed");
    }

    const data = await response.json();
    handleEnquiryResponse(method, data);

    return data;

  } catch (err) {
    console.error("Enquiry Error:", err);
    throw err;
  }
}


/* =========================
   RESPONSE HANDLER
========================= */
function handleEnquiryResponse(method, data) {

  if (!data || !data.Status) return;

  if (data.Status === "No record found") {
    alert("No record found");
    return;
  }

  if (data.Status === "Successfully Submitted") {
    alert("Data submitted successfully");
  
    return;
  }

  if (data.Status === "Success") {
    if (method === "GET") {
      bindEnquiryData(data);
    }
  //  alert("Success");
    return;
  }

  alert("Something went wrong. Please try again.");
}

/* =========================
   BIND GET DATA
========================= */
function bindEnquiryData(data) {
  $("#ContactTopic").val(data.Topic || "");

  $("#ContactEnquiryDate").val(formatDateForInput(data.EnquiryDate || ""));
  $("#ContactFirstName").val(data.FirstName || "");
  $("#ContactMiddleName").val(data.MiddleName || "");
  $("#ContactLastName").val(data.LastName || "");
  $("#ContactMobilePhone").val(data.MobilePhone || "");
  $("#ContactHomePhone").val(data.HomePhone || "");
  $("#ContactBestTimeToContact").val(data.BestTimeToContact || "");
  $("#ContactbrandsSelect").val(data.BrandsApplyingFor || "");
  $("#ContactBusinessExperience").val(data.BusinessExperience || "");
  $("#ContactLocationRequested").val(data.LocationRequested || "");
  $("#ContactHearAboutbrand").val(data.HearAboutBrand || "");
  $("#ContactEmail").val(loginUserEmail);
}

/* =========================
   CALL GET
========================= */
function getEnquiryByEmail() {
  ContactDetailsData("GET", {
    Email: loginUserEmail,
  });
}

/* =========================
   CALL POST
========================= */
function submitEnquiry() {
    const firstName = $("#ContactFirstName").val().trim();
  const lastName = $("#ContactLastName").val().trim();
  const mobile = $("#ContactMobilePhone").val().trim();

  // ---- First Name Validation ----
  if (!firstName) {
    alert("First Name is required");
    $("#ContactFirstName").focus();
    return;
  }
 
  // ---- Last Name Validation ----
  if (!lastName) {
    alert("Last Name is required");
    $("#ContactLastName").focus();
    return;
  }

  

  // ---- Mobile Validation ----
  if (!mobile) {
    alert("Mobile number is required");
    $("#ContactMobilePhone").focus();
    return;
  }

   
 
  const rawPayload = {
    Email: loginUserEmail,
    EmailAddress: $("#ContactEmail").val(),
    Topic: $("#ContactTopic").val(),
    EnquiryDate:  new Date($("#ContactEnquiryDate").val()), // keep as yyyy-MM-dd
    FirstName: $("#ContactFirstName").val(),
    MiddleName: $("#ContactMiddleName").val(),
    LastName: $("#ContactLastName").val(),
    MobilePhone: $("#ContactMobilePhone").val(),
    HomePhone: $("#ContactHomePhone").val(),
    BestTimeToContact: $("#ContactBestTimeToContact").val(),
    BrandsApplyingFor: $("#ContactbrandsSelect").val(),
    BusinessExperience: $("#ContactBusinessExperience").val(),
    LocationRequested: $("#ContactLocationRequested").val(),
    HearAboutBrand: $("#ContactHearAboutbrand").val()
  };

  
  const payload = Object.fromEntries(
    Object.entries(rawPayload).filter(([_, value]) =>
      value !== null &&
      value !== undefined &&
      value !== "" &&
      !(typeof value === "number" && isNaN(value))
    )
  );

  // Convert number AFTER filtering
  if (payload.LocationRequested) {
    payload.LocationRequested = parseInt(payload.LocationRequested, 10);
  }

  ContactDetailsData("POST", payload);
 

}







/////////////PERSONAL DETAIL SECTION



async function PersonalDetailsAPI(payload, method) {
  try {
    const body = method === "GET"
      ? {
          Email: payload.Email,
          Method: "GET"
        }
      : {
          ...payload,
          Method: "POST"
        };

    const response = await fetch(PersonalDetails_API_URL, {
      method: "POST", // Always POST for Power Automate
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error("API failed");
    }

    return await response.json();

  } catch (err) {
    console.error("Personal Details Error:", err);
    throw err;
  }
}


function submitPersonalDetails() {

  const rawPayload = {
    Email: loginUserEmail,
    Gender: $("#PersonalGender").val(),
    DateOfBirth: new Date($("#PersonalDateOfBirth").val()), // yyyy-MM-dd
    HomeOwnership: $("#PersonalHomeOwnership").val(),
    USCitizen: $("#PersonalUSCitizen").val(), // Yes / No
    SocialSecurity: $("#PersonalSocialSecurity").val(),
    MaritalStatus: $("#PersonalMaritalStatus").val(),
    SpouseName: $("#PersonalSpouseName").val(),
    SpouseBirthDate: new Date($("#PersonalSpouseBirthDate").val()), // yyyy-MM-dd
    SpouseUSCitizen: $("#PersonalSpouseUSCitizen").val(), // Yes / No
    SpouseSocilSecurity: $("#PersonalSpouseSocialSecurity").val(),
    FulltimeBusiness: $("#PersonalFulltimeBusiness").val() // Yes / No
  };

  //   Remove empty / null fields
  let payload = Object.fromEntries(
    Object.entries(rawPayload).filter(([_, value]) =>
      value !== null &&
      value !== undefined &&
      value !== ""
    )
  );

  // ✅ Convert Yes/No → Boolean
  const booleanFields = [
    "USCitizen",
    "SpouseUSCitizen",
    "FulltimeBusiness"
  ];

  booleanFields.forEach(field => {
    if (payload[field] !== undefined) {
      payload[field] = payload[field].toLowerCase() === "yes";
    }
  });

  

  PersonalDetailsAPI(payload, "POST")
    .then(data => {
      if (data.Status === "Successfully Submitted" || data.Status === "Success") {
        alert("Personal details saved successfully");
      } else {
        alert(data.Status);
      }
    })
    .catch(() => {
      alert("Something went wrong. Please try again.");
    });
}



function loadPersonalDetails() {
  const email = loginUserEmail;
  if (!email) return;

  PersonalDetailsAPI({ Email: email }, "GET")
    .then(data => {
       console.log(data);
      if (data.Status === "Success") {
        console.log("1");
        bindPersonalDetails(data);
      }
    })
    .catch(err => console.error(err));
}

function bindPersonalDetails(data) {
  $("#PersonalGender").val(data.Gender || "");
  $("#PersonalDateOfBirth").val(data.DateOfBirth || "");
  $("#PersonalHomeOwnership").val(data.HomeOwnership || "");
  $("#PersonalUSCitizen").val(toYesNo(data.USCitizen));
  $("#PersonalSocialSecurity").val(data.SocialSecurity || "");
  $("#PersonalMaritalStatus").val(data.MaritalStatus || "");
  $("#PersonalSpouseName").val(data.SpouseName || "");
  $("#PersonalSpouseBirthDate").val(data.SpouseBirthDate || "");
  $("#PersonalSpouseUSCitizen").val(toYesNo(data.SpouseUSCitizen));
  $("#PersonalSpouseSocialSecurity").val(data.SpouseSocilSecurity || "");
  $("#PersonalFulltimeBusiness").val(toYesNo(data.FulltimeBusiness));



 

}





/////////EMPLOYMENT SECTION


async function EmploymentDetailsAPI(payload, method) {
  try {
    const body =
      method === "GET"
        ? { Email: payload.Email, Method: "GET" }
        : { ...payload, Method: "POST" };

    const response = await fetch(EmploymentDetails_API_URL, {
      method: "POST", // Power Automate always POST
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error("API failed");
    }

    return await response.json();

  } catch (err) {
    console.error("Employment Details Error:", err);
    throw err;
  }
}


function submitEmploymentDetails() {

 const rawPayload = {
    Email: loginUserEmail,
    PresentEmployer: $("#EmploymentPresentEmployer").val(),
    JobTitle: $("#EmploymentJobTitle").val(),
    EmploymentStartedDate: new Date($("#EmploymentStartedDate").val()), // yyyy-MM-dd
    WorkAddress: $("#EmploymentWorkAddress").val(),
    WorkHoursPerWeek: $("#EmploymentWorkHoursPerWeek").val(),
    WorkPhone: $("#EmploymentWorkPhone").val(),
    WorkPhoneExtension: $("#EmploymentWorkPhoneExtension").val(),
    AllowCallYouAtWork: $("#EmploymentAllowCallYouAtWork").val(), // Yes/No
    AnnualSalary: $("#EmploymentAnnualSalary").val(),
    YourResponsibilities: $("#EmploymentYourResponsibilities").val(),
    SelfEmployed: $("#EmploymentSelfEmployed").val() // Yes/No
  };

  //   Remove empty / null values
  let payload = Object.fromEntries(
    Object.entries(rawPayload).filter(([_, value]) =>
      value !== null &&
      value !== undefined &&
      value !== ""
    )
  );
 //  Convert Yes/No to boolean
  if (payload.AllowCallYouAtWork !== undefined) {
    payload.AllowCallYouAtWork =
      payload.AllowCallYouAtWork.toLowerCase() === "yes";
  }

  if (payload.SelfEmployed !== undefined) {
    payload.SelfEmployed =
      payload.SelfEmployed.toLowerCase() === "yes";
  }

  //   Convert numbers
  if (payload.WorkHoursPerWeek) {
    payload.WorkHoursPerWeek = parseInt(payload.WorkHoursPerWeek, 10);
  }

  if (payload.AnnualSalary) {
    payload.AnnualSalary = parseFloat(payload.AnnualSalary);
  }

  EmploymentDetailsAPI(payload, "POST")
    .then(data => {
      if (data.Status === "Successfully Submitted" || data.Status === "Success") {
        alert("Employment details saved successfully");
      } else {
        alert(data.Status);
      }
    })
    .catch(() => {
      alert("Something went wrong. Please try again.");
    });
}


function loadEmploymentDetails() {
  const email = loginUserEmail;
  if (!email) return;

  EmploymentDetailsAPI({ Email: email }, "GET")
    .then(data => {
      console.log(data);
      if (data.Status === "Success") {
        console.log("2");
        bindEmploymentDetails(data);
      }
    })
    .catch(err => console.error(err));
}


function bindEmploymentDetails(data) {
  $("#EmploymentPresentEmployer").val(data.PresentEmployer || "");
  $("#EmploymentJobTitle").val(data.JobTitle || "");
  $("#EmploymentStartedDate").val(data.EmploymentStartedDate || "");
  $("#EmploymentWorkAddress").val(data.WorkAddress || "");
  $("#EmploymentWorkHoursPerWeek").val(data.WorkHoursPerWeek || "");
  $("#EmploymentWorkPhone").val(data.WorkPhone || "");
  $("#EmploymentWorkPhoneExtension").val(data.WorkPhoneExtension || "");
  $("#EmploymentAllowCallYouAtWork").val(toYesNo(data.AllowCallYouAtWork));
  $("#EmploymentAnnualSalary").val(data.AnnualSalary || "");
  $("#EmploymentYourResponsibilities").val(data.YourResponsibilities || "");
  $("#EmploymentSelfEmployed").val(toYesNo(data.SelfEmployed));


 
 }


function toYesNo(value) {
  if (value === true || value === "true" || value === "True") return "Yes";
  if (value === false || value === "false" || value === "False") return "No";
  return "";
}



///Co-Applicant Section

function getCoApplicantsByEmail(email) {

  const payload = {
    Email: email
  };

  $.ajax({
    url: CO_APPLICANT_GET_FLOW_URL,
    type: "POST",                     // Flow trigger is POST
    contentType: "application/json",
    data: JSON.stringify(payload),

    success: function (res) {

       if (typeof res === "string") {
        res = JSON.parse(res);
      }

      if (res.Status === "No record found") {
        console.log("No co-applicant record found");
        return;
      }

      if (res.Status === "Success" && Array.isArray(res.CoApplicants)) {
        bindCoApplicants(res.CoApplicants);
      }
    },

    error: function () {
      alert("Something went wrong. Please try again");
    }
  });
}


/*
function bindCoApplicants(coApplicants) {

  coApplicants.forEach(item => {

    const seq = item.SequenceNo || "1";

    // Store Id for later update
    coApplicantIdMap[seq] = item.Id || 0;

    // Fill UI fields by sequence
    $(`.firstname[data-seq="${seq}"]`).val(item.FirstName || "");
    $(`.co-middlename[data-seq="${seq}"]`).val(item.MiddleName || "");
    $(`.co-lastname[data-seq="${seq}"]`).val(item.LastName || "");
    $(`.co-role[data-seq="${seq}"]`).val(item.Role || "");
    $(`.co-address[data-seq="${seq}"]`).val(item.Address || "");
    $(`.co-city[data-seq="${seq}"]`).val(item.City || "");
    $(`.co-state[data-seq="${seq}"]`).val(item.State || "");
    $(`.co-zip[data-seq="${seq}"]`).val(item.Zip || "");
    $(`.co-country[data-seq="${seq}"]`).val(item.Country || "");
    $(`.co-phone[data-seq="${seq}"]`).val(item.Phone || "");
    $(`.co-email[data-seq="${seq}"]`).val(item.EmailAddress || "");
  });
}*/

function bindCoApplicants(coApplicants) {

  window.coApplicantIdMap = {}; // global map for update

  coApplicants.forEach((item, index) => {

    // Sequence handling
    const seq = item.SequenceNo && item.SequenceNo.trim()
      ? item.SequenceNo.trim()
      : String(index + 1);

    // Store Id (0 if first time)
    coApplicantIdMap[seq] = item.Id ? Number(item.Id) : 0;

    console.log("Binding CoApplicant seq:", seq, item);

    const setVal = (cls, val) => {
      const el = $(`${cls}[data-seq="${seq}"]`);
      if (el.length) {
        el.val(val || "");
      } else {
        console.warn(`Missing element: ${cls}[data-seq="${seq}"]`);
      }
    };

    setVal(".firstName", item.FirstName);
    setVal(".middleName", item.MiddleName);
    setVal(".lastName", item.LastName);
    setVal(".role", item.Role);
    setVal(".address", item.Address);
    setVal(".city", item.City);
    setVal(".state", item.State);
    setVal(".zip", item.Zip);
    setVal(".country", item.Country);
    setVal(".phone", item.Phone);
    setVal(".email", item.EmailAddress);
  });
}





function buildCoApplicantPayload() {

  const coApplicants = [];

  for (let seq = 1; seq <= 3; seq++) {

    const firstName = $(`.firstName[data-seq="${seq}"]`).val()?.trim();

    //   Skip empty co-applicant blocks
    if (!firstName) continue;

    coApplicants.push({
      Id: coApplicantIdMap?.[seq] || 0,   // 0 for first time
      SequenceNo: seq,

      FirstName: firstName,
      MiddleName: $(`.middleName[data-seq="${seq}"]`).val() || "",
      LastName: $(`.lastName[data-seq="${seq}"]`).val() || "",
      Role: $(`.role[data-seq="${seq}"]`).val() || "",
      Address: $(`.address[data-seq="${seq}"]`).val() || "",
      City: $(`.city[data-seq="${seq}"]`).val() || "",
      State: $(`.state[data-seq="${seq}"]`).val() || "",
      Zip: $(`.zip[data-seq="${seq}"]`).val() || "",
      Country: $(`.country[data-seq="${seq}"]`).val() || "",
      Phone: $(`.phone[data-seq="${seq}"]`).val() || "",
      EmailAddress: $(`.email[data-seq="${seq}"]`).val() || ""
    });
  }

  return coApplicants;
}





function submitCoApplicants() {

  const payload = {
    Email: localStorage.getItem("loginEmail"),
    CoApplicants: buildCoApplicantPayload()
  };

  $.ajax({
    url: CO_APPLICANT_POST_FLOW_URL,
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(payload),

    success: function (res) {
      if (typeof res === "string") res = JSON.parse(res);

      if (res.Status === "Success") {
        alert("Co-applicants saved successfully");
      }
    },
    error: function () {
      alert("Something went wrong");
    }
  });
}


