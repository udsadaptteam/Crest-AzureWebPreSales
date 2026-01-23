 
/* =========================
   CONFIG
========================= */
//For Login Use
const FLOW_URL = "https://defaultad358c3362364cda92e747b5c2b8c1.3e.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/2f722fedf77a4d7c9a4308f7701d8402/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=y0FGNQNKyNnMUQfF6RKQ9_JFj2G_3xHiP9jWWpfe7Vc";
// For Reset Password
const FORGOT_PASSWORD_FLOW_URL = "https://defaultad358c3362364cda92e747b5c2b8c1.3e.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/14bdec6a03714a5eb8a9284329002931/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=S5yQypLcPG-vmAvKO8REIUtNnDBCyNAWEidn7MXUOBM";
//F For verification Code
const SEND_CODE_FLOW_URL = "https://defaultad358c3362364cda92e747b5c2b8c1.3e.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/45739459ad48474db0c501b98acc66d5/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=-9yfQAt12a-m_a8VervaRJ3v0uXM8CrAGytTLOpdf_E";
// For validate code
const VALIDATE_CODE_FLOW_URL = "https://defaultad358c3362364cda92e747b5c2b8c1.3e.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/57da794a0d634c889e3f82ee9ec3c171/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=ohQatYVuuDJcXIfwtGCzvanVxgCHl6O1OKwYO0S1tYk";

const RESET_PASSWORD_FLOW_URL = "https://defaultad358c3362364cda92e747b5c2b8c1.3e.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/ed0df114859749bbbc7c1339e6f13554/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=CdC27HNUEsKHbix1jzvAR_SOG3eay5DdQDMPDEkFmRk";
/* =========================
   SIGN IN CLICK
========================= */
document.getElementById("btnLogin").addEventListener("click", signIn);
document.getElementById("lnkForgotPassword").addEventListener("click", function (e) {
  e.preventDefault(); // prevent #
  forgotPassword();  // your existing function
});
 /* =========================
   MAIN FUNCTION
========================= */
async function signIn() {

  const emailInput = document.getElementById("txtEmail");
  const passwordInput = document.getElementById("txtPassword");

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  /* ---------- VALIDATION ---------- */
  if (!email && !password) {
    alert("Please enter Email and Password");
    emailInput.focus();
    return;
  }

  if (!email) {
    alert("Please enter Email");
    emailInput.focus();
    return;
  }

  if (!password) {
    alert("Please enter Password");
    passwordInput.focus();
    return;
  }

  /* ---------- CALL POWER AUTOMATE ---------- */
  try {
    disableButton(true);

    const response = await fetch(FLOW_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        Email: email,
        Password: password
      })
    });

    if (!response.ok) {
      throw new Error("Flow call failed");
    }

    const result = await response.json();
    console.log(result);
    handleResponse(result);

  } catch (error) {
    console.error("Login Error:", error);
    alert("Unable to login. Please try again.");
  } finally {
    disableButton(false);
  }
}

/* =========================
   HANDLE FLOW RESPONSE
=========================  
function handleResponse(status) {

  switch (status) {

    case "Success":
        handleLoginSuccess(result);
      // alert("Login successful");
      // window.location.href = "dashboard.html";
      break;

    case "Password is incorrect":
      alert("Incorrect password");
      break;

    case "Password doesn't exist":
      alert("Password does not exist");
      break;

    case "Email doesn't exit":
      alert("Email does not exist");
      break;

    default:
      alert("Invalid response from server");
  }
}*/
function handleResponse(result) {

  if (result.Status === "Success") {
    const emailInput = document.getElementById("txtEmail");
    storeLoginUser(emailInput.value);
    handleLoginSuccess(result);
    return;
  }

  switch (result.Status) {

    case "Password is incorrect":
      alert("Incorrect password");
      break;

    case "Email doesn't exist":
      alert("Email does not exist");
      break;

    default:
      alert("Invalid response from server");
  }
}
 
function storeLoginUser(email) {
  if (!email) {
    console.warn("Email is empty, not storing in localStorage");
    return;
  }

  localStorage.setItem("loginEmail", email.trim());
}

function getLoginUser() {
  return localStorage.getItem("loginEmail");
}
function handleLoginSuccess(result) {

  populateWelcomeScreen(result);

  document.querySelector('.welcome_section').classList.add('active');
  document.querySelector('.login_first').classList.remove('active');
}
function populateWelcomeScreen(user) {

  document.getElementById("topUserName").innerText =
    `${user.Name}`;

  document.getElementById("mainUserName").innerText =
    `${user.Name}`;

  document.getElementById("userRole").innerText =
    user.Designation || "";

  document.getElementById("companyName").innerText =
    user.Company || "";

     if (user.ImageBase64) {
    document.getElementById("userImage").src =
      "data:image/png;base64," + user.ImageBase64;
      document.getElementById("navUserpic").src =
      "data:image/png;base64," + user.ImageBase64;

       
  } else {
   
    document.getElementById("userImage").src = "img/user-circle.png";
        document.getElementById("navUserpic").src = "img/user-circle.png";

  }
  localStorage.setItem("loginUserFullName", user.Name);
    localStorage.setItem("loginUserProfileImage", user.ImageBase64);

}


/* =========================
   UI HELPERS
========================= */
function disableButton(disabled) {
  const btn = document.getElementById("btnLogin");
  btn.disabled = disabled;
  btn.innerText = disabled ? "Signing in..." : "Sign In";
}







/////For Forget Pasword Code
 
 
async function forgotPassword() {

  const emailInput = document.getElementById("txtEmail");
  const email = emailInput.value.trim();

  /* ---------- VALIDATION ---------- */
  if (!email) {
    alert("Please enter your email address");
    emailInput.focus();
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address");
    emailInput.focus();
    return;
  }

  /* ---------- CALL POWER AUTOMATE ---------- */
  try {
   // toggleButton(true);

    const response = await fetch(FORGOT_PASSWORD_FLOW_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        Email: email
      })
    });

    if (!response.ok) {
      throw new Error("Flow call failed");
    }

    const result = await response.json();
    handleForgotPasswordResponse(result.Status);

  } catch (error) {
    console.error("Forgot Password Error:", error);
    alert("Something went wrong. Please try again.");
  } finally {
    //toggleButton(false);
  }
}

/* =========================
   HANDLE FLOW RESPONSE
========================= */
function handleForgotPasswordResponse(status) {

  switch (status) {

    case "Mail sent successfully to user":
      alert("Password reset email has been sent successfully.");
      break;

    case "Unable to send email. Please try again later or contact support":
      alert("Unable to send email. Please try again later or contact support.");
      break;

    case "Password doesn't exit":
      alert("Password does not exist for this account.");
      break;

    case "Email doesn't exit":
      alert("Email does not exist.");
      break;

    default:
      alert("Unexpected response from server.");
  }
}

/* =========================
   UI HELPERS
========================= */
function toggleButton(disabled) {
  const btn = document.getElementById("btnForgotPassword");
  btn.disabled = disabled;
  btn.innerText = disabled ? "Sending..." : "Reset Password";
}






/////Send VerificationCode
 

/* =========================
   CLICK EVENT
========================= */
//document.getElementById("send_verfication_code").addEventListener("click", sendVerificationCode);

/* =========================
   MAIN FUNCTION
========================= */
async function sendVerificationCode(btn) {

  const emailInput = document.getElementById("youEmail");
  const email = emailInput.value.trim();

  /* ---------- VALIDATION ---------- */
  if (!email) {
    alert("Please enter your email address");
     btn.disabled = false;
    emailInput.focus();
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address");
     btn.disabled = false;
    emailInput.focus();
    return;
  }
 btn.disabled = true;
  /* ---------- CALL POWER AUTOMATE ---------- */
  try {
 
    const response = await fetch(SEND_CODE_FLOW_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        Email: email
      })
    });

    const text = await response.text();

    // handle both JSON & plain text safely
    let result;
    try {
      result = JSON.parse(text);
    } catch {
      result = { Status: text };
    }

    handleSendCodeResponse(result.Status,btn);

  } catch (error) {
    console.error("Send code error:", error);
    alert("Something went wrong. Please try again.");
     btn.disabled = false;
  } finally { btn.disabled = false;
   }
}

/* =========================
   HANDLE FLOW RESPONSE
========================= */
function handleSendCodeResponse(status, btn) {

  switch (status) {

    case "Mail sent successfully to user":
      alert("Verification code has been sent to your email.");
      verify_cod(btn);  
      break;

    case "Unable to send email. Please try again later or contact support":
      alert(status);
      btn.disabled = false;
      break;

    case "Email already exit, Please Sign In":
      alert(status);
      btn.disabled = false;
      break;

    default:
      alert("Unexpected response from server");
      btn.disabled = false;
  }
}

/* =========================
   UI HELPER
========================= */
function toggleButtonVerification(disabled) {
  const btn = document.getElementById("send_verfication_code");
  btn.disabled = disabled;
  btn.innerText = disabled ? "Sending..." : "Send Verification code";
}



 

/* ============================
   VALIDATE CODE
============================ */
async function validateCode(btn) {

  try {
     const emailInput = document.getElementById("youEmail");
  const email = emailInput.value.trim();
  const enterCode = document.getElementById("enterCode");
  const code = enterCode.value.trim();
   
     

    if (!email) {
      alert("Email is missing");
      return;
    }

    if (!code) {
      alert("Please enter verification code");
      return;
    }

    btn.disabled = true;

    const response = await fetch(VALIDATE_CODE_FLOW_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Email: email,
        Code: code
      })
    });

    if (!response.ok) {
      throw new Error("Flow request failed");
    }

    const result = await response.json();
    handleValidateCodeResponse(result.Status, btn);

  } catch (error) {
    console.error("Validate Code Error:", error);
    alert("Something went wrong. Please try again.");
    btn.disabled = false;
  }
}


function handleValidateCodeResponse(status, btn) {

  switch (status) {

    case "Verification successful":
      alert("Code verified successfully");
      btn.style.display = "none";
      entrCode.setAttribute("disabled", true);
      password_area.style.display = "block";
        verify_cod(btn);  
      break;

    case "Invalid verification code. Please try again":
      alert("Invalid verification code");
      btn.disabled = false;
      break;

    case "Your verification code has expired. Please request a new one.":
      alert("Verification code expired. Please resend code.");
      btn.disabled = false;
      break;

    case "Email doesn't exit":
      alert("Email does not exist");
      btn.disabled = false;
      break;

       case "Email already exit, Please Sign In":
      alert("Email already exit, Please Sign In");
      btn.disabled = false;
      break;

    default:
      alert("Unexpected response from server");
      btn.disabled = false;
  }
}

 

 

 

/* ===============================
   RESET PASSWORD
================================ */
async function resetPassword(btn) {
  try {
   // const email = document.getElementById("resetEmail").value.trim();
   const email = getLoginUser();
    const password = document.getElementById("newPassword").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

 
    if (!email) {
      alert("Email is required");
      return;
    }

    if (!password || !confirmPassword) {
      alert("Please enter both password fields");
      return;
    }

      if (!isStrongPassword(password)) {
      alert(
        "Password must be at least 8 characters long and include:\n" +
        "- 1 uppercase letter\n" +
        "- 1 lowercase letter\n" +
        "- 1 number\n" +
        "- 1 special character (!@#$%^&*)"
      );
      return;
    }


    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    btn.disabled = true;

    
    const response = await fetch(RESET_PASSWORD_FLOW_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        Email: email,
        Password: password
      })
    });

    if (!response.ok) {
      throw new Error("Flow request failed");
    }

    const result = await response.json();
    handleResetPasswordResponse(result.Status, btn);

  } catch (error) {
    console.error("Reset Password Error:", error);
    alert("Something went wrong. Please try again.");
    btn.disabled = false;
  }
}

function isStrongPassword(password) {

  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

  return regex.test(password);
}

function handleResetPasswordResponse(status, btn) {
  switch (status) {

    case "Your password has been changed successfully.":
      alert("Your password has been changed successfully.");
      window.location.href = "index.html";
      break;

    case "Email doesn't exit":
      alert("Email does not exist.");
      btn.disabled = false;
      break;

    case "Something went wrong. Please try again.":
      alert("Something went wrong. Please try again.");
      btn.disabled = false;
      break;

    default:
      alert("Unexpected response from server.");
      btn.disabled = false;
  }
}




async function getProfileData() {
  try {
    const email = getLoginUser();

    if (!email) {
      alert("User not logged in.");
      return;
    }

    const flowUrl = "https://defaultad358c3362364cda92e747b5c2b8c1.3e.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/3e40318ca9a443eabde7a5825d12b129/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=gR3RdTf-dFBfnIIxEYWsNJ75UUL0zRefdYegv42IYA8";

    const payload = {
      Email: email
    };

    const response = await fetch(flowUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    handleProfileResponse(result);

  } catch (error) {
    console.error("Update Profile Error:", error);
    alert("Something went wrong. Please try again.");
  }
}



function handleProfileResponse(res) {
  debugger;
  try {
    if (!res || !res.Status) {
      alert("Invalid response from server");
      return;
    }

    switch (res.Status) {

      case "Email doesn't exit":
        alert("Email does not exist.");
        break;

      case "Success":
        bindProfileData(res);
        $('#updateprofile').modal('show');
        //alert("Profile loaded successfully");
        break;

      default:
        alert(res.Status || "Unexpected response");
    }

  } catch (err) {
    console.error("Response Handling Error:", err);
    alert("Unable to process response");
  }
}



function bindProfileData(data) {
  if (!data || data.Status !== "Success") {
    alert("Unable to load profile data");
    return;
  }

  // ---- Name Split ----
  const fullName = (data.Name || "").trim().split(" ");
  document.getElementById("UpdatefirstName").value = fullName[0] || "";
  document.getElementById("UpdatemiddleName").value = fullName.length > 2 ? fullName[1] : "";
  document.getElementById("UpdatelastName").value =
    fullName.length > 1 ? fullName[fullName.length - 1] : "";

  // ---- Basic Info ----
  document.getElementById("UpdatecompanyName").value = data.Company || "";
  document.getElementById("UpdatecontactNumber").value = data.ContactNumber || "";
  document.getElementById("Updatedesignation").value = data.Designation || "";

  // ---- Address ----
  document.getElementById("Updateaddress").value = data.Address || "";
  document.getElementById("Updatecity").value = data.City || "";
  document.getElementById("Updatestate").value = data.State || "";
  document.getElementById("UpdatezipCode").value = data.ZipCode || "";

// ---- Country ----
  const countrySelect = document.getElementById("Updatecountry");
  let isFound = false;

  Array.from(countrySelect.options).forEach(opt => {
    if (
      opt.value == data.Country ||
      opt.text.toLowerCase() === String(data.Country).toLowerCase()
    ) {
      opt.selected = true;
      isFound = true;
    }
  });

  // If country not present in dropdown, add it
  if (data.Country && !isFound) {
    const opt = document.createElement("option");
    opt.value = data.Country;
    opt.text = data.Country;
    opt.selected = true;
    countrySelect.appendChild(opt);
  }

  // ---- Profile Image ----
  if (data.ImageBase64) {
    document.getElementById("UpdateprofileImage").src =
      `data:image/png;base64,${data.ImageBase64}`;
      localStorage.setItem("profileImageBase64", data.ImageBase64);
  }
}





///////Update Profile



$("#UpdateprofileImageInput").on("change", function () {

  const file = this.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Only image files allowed");
    this.value = "";
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {

    // Show preview immediately
    $("#UpdateprofileImage").attr("src", e.target.result);

    // Save NEW image (overwrite old)
    localStorage.setItem("profileImageBase64", e.target.result.split(",")[1]);
    localStorage.setItem("profileImageFileName", file.name);
  };

  reader.readAsDataURL(file);
});




async function updateProfile() {

  const payload = {
    Email: localStorage.getItem("loginEmail"),
    FirstName: $("#UpdatefirstName").val(),
    MiddleName: $("#UpdatemiddleName").val(),
    LastName: $("#UpdatelastName").val(),
    CompanyName: $("#UpdatecompanyName").val(),
    ContactNumber: $("#UpdatecontactNumber").val(),
    Designation: $("#Updatedesignation").val(),
    Address: $("#Updateaddress").val(),
    City: $("#Updatecity").val(),
    State: $("#Updatestate").val(),
    ZipCode: $("#UpdatezipCode").val(),
   // Country: $("#Updatecountry").val(),
        Country: $("#Updatecountry option:selected").text()

   // FileName: "profile.png",
    
   // ImageBase64: localStorage.getItem("profileImageBase64")
  };
   const imageBase64 = localStorage.getItem("profileImageBase64");
  const fileName = localStorage.getItem("profileImageFileName");

 
  if (imageBase64 && fileName) {
    payload.ImageBase64 = imageBase64;
    payload.FileName = fileName;
  }

  try {
    const res = await fetch("https://defaultad358c3362364cda92e747b5c2b8c1.3e.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/c0c7ccee145144a8ab49fe51e7eea469/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=JXMPFP0RBfABHmPrkHLtbNetC_L-GwbK2wIxxyHM1Fo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (data.Status === "Success") {
      alert("Profile updated successfully");
       handleLoginSuccess(data);
          $('#updateprofile').modal('hide');
    //  bindProfileData(data);

    } 
    else {
      alert(data.Status);
    }

  } catch (err) {
    alert("Something went wrong. Please try again.");
    console.error(err);
  }
}






/////// Add Password

async function AddNewPassword() {

  const email = $("#youEmail").val()?.toString().trim();
  const code = $("#enterCode").val()?.toString().trim();
  const password = $("#AddnewPassword").val()?.toString();
  const confirmPassword = $("#AddconfirmPassword").val()?.toString();
sessionStorage.setItem("userEmail", email);
       localStorage.setItem("loginEmail", email);

   if (!email || !code || !password || !confirmPassword) {
    alert("All fields are required");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }
    if (!isStrongPassword(password)) {
      alert(
        "Password must be at least 8 characters long and include:\n" +
        "- 1 uppercase letter\n" +
        "- 1 lowercase letter\n" +
        "- 1 number\n" +
        "- 1 special character (!@#$%^&*)"
      );
      return;
    }


  const payload = {
    Email: email,
    Password: password
  };

  console.log("Reset Payload:", payload);

  try {
    const response = await fetch(RESET_PASSWORD_FLOW_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    handleStatus(result.Status);

  } catch (error) {
    console.error(error);
    alert("Something went wrong. Please try again.");
  }
}


function handleStatus(status) {

  switch (status) {
    case "Password  added successfully.":
      alert(status);
     // window.location.href = "/login.html";
      break;

    case "Email doesn't exit":
      alert("Email does not exist");
      break;

    default:
      alert("Something went wrong. Please try again.");
      break;
  }
}







document.addEventListener("DOMContentLoaded", () => {
  loadCountries();
});


// Load Countries data

async function loadCountries() {
  try {
  const countryApiUrl="https://defaultad358c3362364cda92e747b5c2b8c1.3e.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/16b0fd3f28ca4d0a9fa3bd9c559009fb/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=nTR84nQzGgdxnK7JIf1KwaX-gpqD_DlSh1WpfsZrgU4";  

    const response = await fetch(countryApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({})
    });

    if (!response.ok) {
      throw new Error("API call failed");
    }

 let data = await response.json();

console.log("RAW data:", data);

 
if (!data.Countries) {
  throw new Error("Countries not found in response");
}

 
let countries = data.Countries;

if (typeof countries === "string") {
  countries = JSON.parse(countries);
}

 
if (!Array.isArray(countries)) {
  throw new Error("Countries is not an array");
}
 
bindCountries(countries);

  

  //  bindCountries(data);

  } catch (error) {
    console.error("Country Load Error:", error);
    alert("Failed to load countries");
  }
}
 
 


function bindCountries(countries) {

  const ddl = $("#countrySelect");
  const $dd2 = $("#Updatecountry");

  ddl.empty();
  ddl.append(`<option value="">Select Country</option>`);

  $dd2.empty();
  $dd2.append(`<option value="">Select Country</option>`);

  let usaId = null;

  countries.forEach(c => {

 
    ddl.append(`<option value="${c.ID}">${c.Title}</option>`);

    
    $dd2.append(`<option value="${c.ID || c.Id}">${c.Title}</option>`);

    // Capture USA ID
    if (c.Title && c.Title.toLowerCase() === "usa") {
      usaId = c.ID || c.Id;
    }
  });

  
  if (usaId) {
    ddl.val(usaId);
   // $dd2.val(usaId);
  }
}





///// Addd Data
 /************************************
/************************************
 * GLOBAL VARIABLES
 ************************************/
var AddimageBase64 = null;
var AddimageFileName = null;

/************************************
 * IMAGE TO BASE64 (ONLY IF SELECTED)
 ************************************/
$(document).on("change", "#profileImage", function () {
  
  

 

  const file = this.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Only image files allowed");
    this.value = "";
    return;
  }

  AddimageFileName = file.name;

  const reader = new FileReader();
  reader.onload = function (e) {
    const dataUrl = e.target.result;
      $("#profilePreview").attr("src", dataUrl);
    AddimageBase64 = dataUrl.split(",")[1];; 
  };
  reader.readAsDataURL(file);
 

});

/************************************
 * SIGN IN / SUBMIT DETAILS
 ************************************/
/************************************
 * BASIC FORM VALIDATION
 ************************************/
function validateForm() {

  var firstName = $("#AddfirstName").val().trim();
  var lastName = $("#AddlastName").val().trim();
  var contact = $("#AddcontactNumber").val().trim();

  

  if (!firstName) {
    alert("First Name is required");
    $("#firstName").focus();
    return false;
  }

  

  if (!lastName) {
    alert("Last Name is required");
    $("#lastName").focus();
    return false;
  }

 

  if (!contact) {
    alert("Contact Number is required");
    $("#contactNumber").focus();
    return false;
  }

 

  return true; 
}

function AddsignIn(btn) {
  if (!validateForm()) {
    return;
  }
  var payload = {
    Email: sessionStorage.getItem("userEmail") || localStorage.getItem("userEmail"),

    FirstName: $("#AddfirstName").val(),
    MiddleName: $("#AddmiddleName").val(),
    LastName: $("#AddlastName").val(),

    CompanyName: $("#AddcompanyName").val(),
    ContactNumber: $("#AddcontactNumber").val(),
    Designation: $("#Adddesignation").val(),

    Address: $("#Addaddress").val(),
    City: $("#Addcity").val(),
    State: $("#Addstate").val(),
    ZipCode: $("#AddzipCode").val(),
    Country: $("#countrySelect option:selected").text()
  };

   
  if (AddimageBase64 && AddimageFileName) {
    payload.FileName = AddimageFileName;
    payload.ImageBase64 = AddimageBase64;
  }

  console.log("FINAL PAYLOAD:", payload);

  submitDetails(payload, btn);
}

/************************************
 * API CALL
 ************************************/
function submitDetails(payload, btn) {

  $(btn).prop("disabled", true).text("Submitting...");

const registerApiUrl="https://defaultad358c3362364cda92e747b5c2b8c1.3e.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/c0c7ccee145144a8ab49fe51e7eea469/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=JXMPFP0RBfABHmPrkHLtbNetC_L-GwbK2wIxxyHM1Fo";
  fetch(registerApiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (result) {
      AddhandleResponse(result);
    })
    .catch(function (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    })
    .finally(function () {
      $(btn).prop("disabled", false).text("Submit");
    });
}

/************************************
 * HANDLE API RESPONSE
 ************************************/
function AddhandleResponse(result) {

  if (!result || !result.Status) {
    alert("Invalid response from server");
    return;
  }

  switch (result.Status) {

    case "Success":
      alert("Details saved successfully");
       handleLoginSuccess(result);
          $('#registration_modl').modal('hide');
      console.log("Returned Data:", result);
      break;

    case "Email doesn't exit":
      alert("Email does not exist");
      break;

    default:
      alert("Something went wrong. Please try again.");
      break;
  }
}

