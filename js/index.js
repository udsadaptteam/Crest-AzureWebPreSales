 
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
const StateApiUrl = "https://defaultad358c3362364cda92e747b5c2b8c1.3e.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/0929346124984194ae1fa0ef537cf93a/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=dPykLyOqS7G3_ndMVht9d9Sa6Lt0KisKgV0bftQuTuE";


let otpTimerInterval = null;
let otpRemainingTime = 120; // 2 minutes
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
     $("#shortAlertText").text("Please enter Email and Password");
     $("#shortAlert").modal("show");
   // alert("Please enter Email and Password");
    emailInput.focus();
    return;
  }

  if (!email) {
    $("#shortAlertText").text("Please enter Email");
     $("#shortAlert").modal("show");
   // alert("Please enter Email");
    emailInput.focus();
    return;
  }

  if (!password) {
    $("#shortAlertText").text("Please enter Password");
     $("#shortAlert").modal("show");
    //alert("Please enter Password");
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
    //alert("Unable to login. Please try again.");
    $("#shortAlertText").text("Unable to login. Please try again.");
     $("#shortAlert").modal("show");
  } finally {
    disableButton(false);
  }
}
 
function handleResponse(result) {

  if (result.Status === "Success") {
    const emailInput = document.getElementById("txtEmail");
    storeLoginUser(emailInput.value);
    handleLoginSuccess(result);
    return;
  }

  switch (result.Status) {

    case "Password is incorrect":
      //alert("Incorrect password");
        $("#shortAlertText").text("Incorrect password");
     $("#shortAlert").modal("show");
      break;

    case "Email doesn't exist":
       $("#shortAlertText").text("Email does not exist");
     $("#shortAlert").modal("show");
     // alert("Email does not exist");
      break;

    default:
     // alert("Invalid response from server");
       $("#shortAlertText").text("Invalid response from server");
     $("#shortAlert").modal("show");
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

  console.log(user);
  document.getElementById("topUserName").innerText =
    `${user.Name}`;

    localStorage.setItem("loginUserFullName", user.Name);

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
    $("#shortAlertText").text("Please enter your email address");
     $("#shortAlert").modal("show");
   // alert("Please enter your email address");
    emailInput.focus();
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    $("#shortAlertText").text("Please enter a valid email address");
     $("#shortAlert").modal("show");
   // alert("Please enter a valid email address");
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
   // alert("Something went wrong. Please try again.");
    $("#shortAlertText").text("Something went wrong. Please try again.");
    $("#shortAlert").modal("show");
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
     // alert("Password reset email has been sent successfully.");
      $("#shortAlertText").text("Password reset email has been sent successfully.");
      $("#shortAlert").modal("show");
      break;

    case "Unable to send email. Please try again later or contact support":
       $("#shortAlertText").text("Unable to send email. Please try again later or contact support.");
      $("#shortAlert").modal("show");
     // alert("Unable to send email. Please try again later or contact support.");
      break;

    case "Password doesn't exit":
      $("#shortAlertText").text("Password does not exist for this account.");
      $("#shortAlert").modal("show");
     // alert("Password does not exist for this account.");
      break;

    case "Email doesn't exit":
      //alert("Email does not exist.");
      $("#shortAlertText").text("Email does not exist.");
      $("#shortAlert").modal("show");

      break;

    default:
      //alert("Unexpected response from server.");
      $("#shortAlertText").text("Unexpected response from server.");
      $("#shortAlert").modal("show");

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
   // alert("Please enter your email address");
     $("#shortAlertText").text("Please enter your email address");
      $("#shortAlert").modal("show");
     btn.disabled = false;
    emailInput.focus();
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
     $("#shortAlertText").text("Please enter a valid email address");
      $("#shortAlert").modal("show");
    //alert("Please enter a valid email address");
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
    $("#shortAlertText").text("Something went wrong. Please try again.");
      $("#shortAlert").modal("show");
    //alert("Something went wrong. Please try again.");
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
     // alert("Verification code has been sent to your email.");
      $("#shortAlertText").text("Verification code has been sent to your email.");
      $("#shortAlert").modal("show");
      verify_cod(btn);  
      startOtpTimer();
      break;

    case "Unable to send email. Please try again later or contact support":
      //alert(status);
      $("#shortAlertText").text(status);
      $("#shortAlert").modal("show");
      btn.disabled = false;
      break;

    case "Email already exit, Please Sign In":
      //alert(status);
       $("#shortAlertText").text(status);
      $("#shortAlert").modal("show");
      btn.disabled = false;
      break;

    default:
       $("#shortAlertText").text("Unexpected response from server");
      $("#shortAlert").modal("show");
      //alert("Unexpected response from server");
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
      //alert("Email is missing");
       $("#shortAlertText").text("Email is missing");
      $("#shortAlert").modal("show");
      return;
    }

    if (!code) {
     // alert("Please enter verification code");
      $("#shortAlertText").text("Please enter verification code");
      $("#shortAlert").modal("show");
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
    $("#shortAlertText").text("Something went wrong. Please try again.");
      $("#shortAlert").modal("show");
   // alert("Something went wrong. Please try again.");
    btn.disabled = false;
  }
}


function handleValidateCodeResponse(status, btn) {

  switch (status) {

    case "Verification successful":
     // alert("Code verified successfully");
       $("#shortAlertText").text("Code verified successfully");
      $("#shortAlert").modal("show");
      btn.style.display = "none";
      entrCode.setAttribute("disabled", true);
      password_area.style.display = "block";
      $("#otpSection").hide();
        verify_cod(btn);  
          
      break;

    case "Invalid verification code. Please try again":
      //alert("Invalid verification code");
        $("#shortAlertText").text("Invalid verification code");
      $("#shortAlert").modal("show");
      btn.disabled = false;
      break;

    case "Your verification code has expired. Please request a new one.":
      //alert("Verification code expired. Please resend code.");
       $("#shortAlertText").text("Verification code expired. Please resend code.");
      $("#shortAlert").modal("show");
      btn.disabled = false;
      break;

    case "Email doesn't exit":
       $("#shortAlertText").text("Email does not exist");
      $("#shortAlert").modal("show");
      //alert("Email does not exist");
      btn.disabled = false;
      break;

       case "Email already exit, Please Sign In":
          $("#shortAlertText").text("Email already exit, Please Sign In");
      $("#shortAlert").modal("show");
      //alert("Email already exit, Please Sign In");
      btn.disabled = false;
      break;

    default:
     // alert("Unexpected response from server");
       $("#shortAlertText").text("Unexpected response from server");
      $("#shortAlert").modal("show");
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
     // alert("Email is required");
       $("#shortAlertText").text("Email is required");
      $("#shortAlert").modal("show");
      return;
    }

    if (!password || !confirmPassword) {
       $("#shortAlertText").text("Please enter both password fields");
      $("#shortAlert").modal("show");
     // alert("Please enter both password fields");
      return;
    }

      if (!isStrongPassword(password)) {
      // alert(
      //   "Password must be at least 8 characters long and include:\n" +
      //   "- 1 uppercase letter\n" +
      //   "- 1 lowercase letter\n" +
      //   "- 1 number\n" +
      //   "- 1 special character (!@#$%^&*)"
      // );
         $("#shortAlertText").text("Password must be at least 8 characters long and include:\n" +
        "- 1 uppercase letter\n" +
        "- 1 lowercase letter\n" +
        "- 1 number\n" +
        "- 1 special character (!@#$%^&*)");
      $("#shortAlert").modal("show");
      return;
    }


    if (password !== confirmPassword) {
      //alert("Passwords do not match");
      $("#shortAlertText").text("Passwords do not match");
      $("#shortAlert").modal("show");
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
    //alert("Something went wrong. Please try again.");
    $("#shortAlertText").text("Something went wrong. Please try again.");
      $("#shortAlert").modal("show");
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
     // alert("Your password has been changed successfully.");
      $("#shortAlertText").text("Your password has been changed successfully.");
      $("#shortAlert").modal("show");
      window.location.href = "index.html";
      break;

    case "Email doesn't exit":
       $("#shortAlertText").text("Email does not exist.");
      $("#shortAlert").modal("show");
     // alert("Email does not exist.");
      btn.disabled = false;
      break;

    case "Something went wrong. Please try again.":
       $("#shortAlertText").text("Something went wrong. Please try again.");
      $("#shortAlert").modal("show");
      //alert("Something went wrong. Please try again.");
      btn.disabled = false;
      break;

    default:
       $("#shortAlertText").text("Unexpected response from server.");
      $("#shortAlert").modal("show");
      //alert("Unexpected response from server.");
      btn.disabled = false;
  }
}




async function getProfileData() {
  try {
    const email = getLoginUser();

    if (!email) {
       $("#shortAlertText").text("User not logged in.");
      $("#shortAlert").modal("show");
     // alert("User not logged in.");
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
        $("#shortAlertText").text("Something went wrong. Please try again.");
      $("#shortAlert").modal("show");
   // alert("Something went wrong. Please try again.");
  }
}



function handleProfileResponse(res) {
 
  try {
    if (!res || !res.Status) {
       $("#shortAlertText").text("Invalid response from server");
      $("#shortAlert").modal("show");
     // alert("Invalid response from server");
      return;
    }

    switch (res.Status) {

      case "Email doesn't exit":
       $("#shortAlertText").text("Email does not exist.");
      $("#shortAlert").modal("show");

       // alert("Email does not exist.");
        break;

      case "Success":
        bindProfileData(res);
        $('#updateprofile').modal('show');
        //alert("Profile loaded successfully");
        break;

      default:
            $("#shortAlertText").text(res.Status || "Unexpected response");
      $("#shortAlert").modal("show");
       // alert(res.Status || "Unexpected response");
    }

  } catch (err) {
    console.error("Response Handling Error:", err);
     $("#shortAlertText").text("Unable to process response");
      $("#shortAlert").modal("show");
   // alert("Unable to process response");
  }
}



function bindProfileData(data) {
  if (!data || data.Status !== "Success") {
   // alert("Unable to load profile data");
     $("#shortAlertText").text("Unable to load profile data");
      $("#shortAlert").modal("show");
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
 // document.getElementById("Updatestate").value = data.State || "";
 // ---------- Set Zip ----------
document.getElementById("UpdatezipCode").value = data.ZipCode || "";

// ---------- Country ----------
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

// If country not present, add it
if (data.Country && !isFound) {
  const opt = document.createElement("option");
  opt.value = data.Country;
  opt.text = data.Country;
  opt.selected = true;
  countrySelect.appendChild(opt);
}

// ---------- STATE TOGGLE ----------
const isUSA = data.Country && data.Country.toLowerCase() === "usa";

if (isUSA) {
  // Show dropdown, hide textbox
  $("#Updatestateopt").show();
  $("#Updatestate").hide().val("");

  // Select state in dropdown
  const stateDropdown = document.getElementById("Updatestateopt");
  let stateFound = false;

  Array.from(stateDropdown.options).forEach(opt => {
    if (opt.value === data.State || opt.text === data.State) {
      opt.selected = true;
      stateFound = true;
    }
  });

  // If state not present, add it
  if (data.State && !stateFound) {
    const opt = document.createElement("option");
    opt.value = data.State;
    opt.text = data.State;
    opt.selected = true;
    stateDropdown.appendChild(opt);
  }

} else {
  // Show textbox, hide dropdown
  $("#Updatestateopt").hide().val("");
  $("#Updatestate").show().val(data.State || "");
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
      $("#shortAlertText").text("Only image files allowed");
      $("#shortAlert").modal("show");
   // alert("Only image files allowed");
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
const selectedCountry = $("#Updatecountry option:selected").text().trim();
const isUSA = selectedCountry.toLowerCase() === "usa";

// Get state from correct control
const stateValue = isUSA
  ? $("#Updatestateopt").val()     // dropdown for USA
  : $("#Updatestate").val();      // textbox for others
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
     State: stateValue || "",
    ZipCode: $("#UpdatezipCode").val(),
   // Country: $("#Updatecountry").val(),
        Country: selectedCountry

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
     // alert("Profile updated successfully");
       $("#shortAlertText").text("Profile updated successfully");
      $("#shortAlert").modal("show");
       handleLoginSuccess(data);
          $('#updateprofile').modal('hide');
    //  bindProfileData(data);

    } 
    else {
      alert(data.Status);
    }

  } catch (err) {
      $("#shortAlertText").text("Something went wrong. Please try again.");
      $("#shortAlert").modal("show");
   // alert("Something went wrong. Please try again.");
    console.error(err);
  }
}






/////// Add Password
/*
async function AddNewPassword() {

  const email = $("#youEmail").val()?.toString().trim();
  const code = $("#enterCode").val()?.toString().trim();
  const password = $("#AddnewPassword").val()?.toString();
  const confirmPassword = $("#AddconfirmPassword").val()?.toString();
sessionStorage.setItem("userEmail", email);
       localStorage.setItem("loginEmail", email);

   if (!email || !code || !password || !confirmPassword) {
    //alert("All fields are required");
      $("#shortAlertText").text("All fields are required");
      $("#shortAlert").modal("show");
    return;
  }

  if (password !== confirmPassword) {
    $("#shortAlertText").text("Passwords do not match");
      $("#shortAlert").modal("show");
   // alert("Passwords do not match");
    return;
  }
    if (!isStrongPassword(password)) {
        $("#shortAlertText").text( "Password must be at least 8 characters long and include:\n" +
        "- 1 uppercase letter\n" +
        "- 1 lowercase letter\n" +
        "- 1 number\n" +
        "- 1 special character (!@#$%^&*)");
      $("#shortAlert").modal("show");
      // alert(
      //   "Password must be at least 8 characters long and include:\n" +
      //   "- 1 uppercase letter\n" +
      //   "- 1 lowercase letter\n" +
      //   "- 1 number\n" +
      //   "- 1 special character (!@#$%^&*)"
      // );
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
     $("#shortAlertText").text("Something went wrong. Please try again.");
      $("#shortAlert").modal("show");
   // alert("Something went wrong. Please try again.");
  }
}

*/
async function AddNewPassword(btn) {

  try { 

    const email = $("#youEmail").val()?.trim();
    const code = $("#enterCode").val()?.trim();
    const password = $("#AddnewPassword").val();
    const confirmPassword = $("#AddconfirmPassword").val();

    sessionStorage.setItem("userEmail", email);
       localStorage.setItem("loginEmail", email);

    // STOP if missing fields
    if (!email || !code || !password || !confirmPassword) {
      $("#shortAlertText").text("All fields are required");
      $("#shortAlert").modal("show");
      return;
    }

    if (password !== confirmPassword) {
      $("#shortAlertText").text("Passwords do not match");
      $("#shortAlert").modal("show");
      return;
    }

    if (!isStrongPassword(password)) {
     $("#shortAlertText").text( "Password must be at least 8 characters long and include:\n" +
        "- 1 uppercase letter\n" +
        "- 1 lowercase letter\n" +
        "- 1 number\n" +
        "- 1 special character (!@#$%^&*)");
      $("#shortAlert").modal("show");
      return;
    }

    // Disable button only AFTER validation passes
    btn.disabled = true;

    const payload = {
      Email: email,
      Password: password
    };

    const response = await fetch(RESET_PASSWORD_FLOW_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error("Flow request failed");
    }

    const result = await response.json();
    handleStatus(result.Status, btn);

  } catch (error) {
    console.error(error);
     $("#shortAlertText").text("Something went wrong. Please try again.");
      $("#shortAlert").modal("show");
    btn.disabled = false;
  }
}
 
function goNextStep() {
  if (current < steps.length - 1) {
    current++;
    runing(current);
  }
}


function handleStatus(status,btn) {

  switch (status) {
    case "Password  added successfully.":
        $("#shortAlertText").text(status);
      $("#shortAlert").modal("show");
       btn.style.display = "none";
        goNextStep();
     // alert(status);
     // window.location.href = "/login.html";
      break;

    case "Your password has been changed successfully.":
      $("#shortAlertText").text("Password  added successfully.");
      $("#shortAlert").modal("show");
       btn.style.display = "none";
        goNextStep();
     // alert(status);
     // window.location.href = "/login.html";
      break;
    case "Email doesn't exit":
     // alert("Email does not exist");
       $("#shortAlertText").text("Email does not exist");
      $("#shortAlert").modal("show");
        btn.disabled = false;
      break;

    default:
     // alert("Something went wrong. Please try again.");
       $("#shortAlertText").text("Something went wrong. Please try again.");
      $("#shortAlert").modal("show");
        btn.disabled = false;
      break;
  }
}







document.addEventListener("DOMContentLoaded", () => {
  loadCountries();
  loadState();
  $("#Updatecountry").on("change", function () {
  toggleUpdateStateByCountry($(this).val());
});
$("#countrySelect").on("change", function () {
  toggleUpdateCountry($(this).val());
});

});


// Load Countries data
function toggleUpdateStateByCountry(country) {
  if (country && country.toLowerCase() === "usa") {
    $("#Updatestateopt").show();
    $("#Updatestate").hide().val("");
  } else {
    $("#Updatestateopt").hide().val("");
    $("#Updatestate").show();
  }
}

function toggleUpdateCountry(country) {
  if (country && country.toLowerCase() === "usa") {
    $("#Addstateopt").show();
    $("#Addstate").hide().val("");
  } else {
    $("#Addstateopt").hide().val("");
    $("#Addstate").show();
  }
}

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
    $("#shortAlertText").text("Failed to load countries");
      $("#shortAlert").modal("show");
    //alert("Failed to load countries");
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

 
    ddl.append(`<option value="${c.Title}">${c.Title}</option>`);

    
    $dd2.append(`<option value="${c.Title || c.Title}">${c.Title}</option>`);

    // Capture USA ID
    if (c.Title && c.Title.toLowerCase() === "usa") {
      usaId = c.Title || c.Title;
    }
  });

  
  if (usaId) {
    ddl.val(usaId);
   // $dd2.val(usaId);
  }
}


// Load State data

async function loadState() {
  try {

    const response = await fetch(StateApiUrl, {
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


    if (!data.State) {
      throw new Error("State not found in response");
    }


    let State = data.State;

    if (typeof State === "string") {
      State = JSON.parse(State);
    }


    if (!Array.isArray(State)) {
      throw new Error("State is not an array");
    }

    bindState(State);





  } catch (error) {
    console.error("Country Load Error:", error);
    $("#shortAlertText").text("Failed to load State");
    $("#shortAlert").modal("show");
    //alert("Failed to load countries");
  }
}




function bindState(State) {
console.log(State);
 const ddl = $("#Addstateopt");
  const dd2 = $("#Updatestateopt");

  ddl.empty();
  ddl.append(`<option value="">Select State</option>`);

  dd2.empty();
  dd2.append(`<option value="">Select State</option>`);

  

  //let usaId;

   State.forEach(c => {
    // Only USA states
    if (c.CountryTitle?.toLowerCase() === "usa") {
      ddl.append(`<option value="${c.Title}">${c.Title}</option>`);
      dd2.append(`<option value="${c.Title}">${c.Title}</option>`);
    }
  });


  // if (usaId) {
  //   ddl.val(usaId);
  //   dd2.val(usaId);
   
  // }
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
     $("#shortAlertText").text("Failed to load countries");
      $("#shortAlert").modal("show");
   // alert("Only image files allowed");
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
   // alert("First Name is required");
      $("#shortAlertText").text("First Name is required");
      $("#shortAlert").modal("show");
    $("#firstName").focus();
    return false;
  }

  

  if (!lastName) {
     $("#shortAlertText").text("Last Name is required");
      $("#shortAlert").modal("show");
    //alert("Last Name is required");
    $("#lastName").focus();
    return false;
  }

 

  if (!contact) {
   // alert("Contact Number is required");
      $("#shortAlertText").text("Contact Number is required");
      $("#shortAlert").modal("show");
    $("#contactNumber").focus();
    return false;
  }

 

  return true; 
}

function AddsignIn(btn) {
  if (!validateForm()) {
    return;
  }

  const selectedCountry = $("#countrySelect option:selected").text().trim();
const isUSA = selectedCountry.toLowerCase() === "usa";

// pick state based on country
const stateValue = isUSA
  ? $("#Addstateopt").val()     // dropdown for USA
  : $("#Addstate").val();      // textbox for other countries
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
    State: stateValue || "",
    ZipCode: $("#AddzipCode").val(),
    Country: selectedCountry
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
       $("#shortAlertText").text("Something went wrong. Please try again.");
      $("#shortAlert").modal("show");
     // alert("Something went wrong. Please try again.");
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
      $("#shortAlertText").text("Invalid response from server");
      $("#shortAlert").modal("show");
   // alert("Invalid response from server");
    return;
  }

  switch (result.Status) {

    case "Success":
       $("#shortAlertText").text("Details saved successfully");
      $("#shortAlert").modal("show");
     // alert("Details saved successfully");
       handleLoginSuccess(result);
          $('#registration_modl').modal('hide');
      console.log("Returned Data:", result);
      break;

    case "Email doesn't exit":
    $("#shortAlertText").text("Email does not exist");
      $("#shortAlert").modal("show");
   // alert("Email does not exist");
      break;

    default:
       $("#shortAlertText").text("Something went wrong. Please try again.");
      $("#shortAlert").modal("show");
      //alert("Something went wrong. Please try again.");
      break
  }
}




///////

function startOtpTimer() {
  clearInterval(otpTimerInterval);

  otpRemainingTime = 120;
  $("#btnResendCode").hide();
  $("#otpTimer").show();

  updateOtpTimerText();

  otpTimerInterval = setInterval(() => {
    otpRemainingTime--;

    if (otpRemainingTime <= 0) {
      clearInterval(otpTimerInterval);
      $("#otpTimer").hide();
      $("#btnResendCode").show();
    } else {
      updateOtpTimerText();
    }
  }, 1000);
}
function updateOtpTimerText() {
  const minutes = Math.floor(otpRemainingTime / 60);
  const seconds = otpRemainingTime % 60;

  $("#otpTimer").text(
    `Code expires in ${minutes}:${seconds.toString().padStart(2, "0")}`
  );
}

function resendCode() {

  $("#EnterCode").val("");
  $("#btnResendCode").hide();

  const email =$("#youEmail").val(); // fallback

  if (!email) {
    alert("Email not found. Please refresh.");
    return;
  }

  $.ajax({
    url: SEND_CODE_FLOW_URL,
    method: "POST",
    data: JSON.stringify({ Email: email }),
    contentType: "application/json; charset=utf-8",
    processData: false,
    headers: {
      "Accept": "application/json"
    },
    success: function () {
      alert("New code sent to your email");
      startOtpTimer();
    },
    error: function (xhr) {
      console.error("Resend failed:", xhr.responseText);
      alert("Unable to resend code. Try again.");
      $("#btnResendCode").show();
    }
  });
}


