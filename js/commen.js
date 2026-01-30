



const entrCode = document.querySelector(".enter_code_bx"); 
const password_area = document.querySelector(".password_area");


const emailId = document.getElementById("youEmail");
const validate_Code = document.getElementById("validate_code");
const entcod = document.getElementById("enterCode");


function verify_cod(itm){

  if(itm.id === 'send_verfication_code'){
    itm.style.display = 'none';
    emailId.setAttribute('disabled', true);
    validate_Code.style.display = 'block';
    entrCode.style.display ="block";
  }

   // VALIDATE CODE

 if(itm.id === 'validate_code'){
   itm.style.display = 'none';
   entcod.setAttribute('disabled', true);
   password_area.style.display = 'block';
   document.getElementById("nextStp").style.display = 'block';
 } 
 
};



/**** form step code *****/

const steps = document.querySelectorAll(".step");
const nextBtns = document.querySelector(".next");
var current = 0;


function runing(numbr){
    steps.forEach(function(items){
    items.classList.remove('active');
    steps[numbr].classList.add('active');
    let trget = document.querySelector('.both_coverstp');
        trget.scrollBy({
          left: items.offsetWidth,
          behavior:'smooth'
        })
 
});
}

// nextBtns.addEventListener('click', function(){
 
//   if(current<steps.length - 1){
//     current++;
//     runing(current);
//   }

// });

/***sign in condition*****/

function signIn(selct){

 document.querySelector('.welcome_section').classList.add('active');
 document.querySelector('.login_first').classList.remove('active');

 if (selct.id === 'submiting_details') {
    $('#registration_modl').modal('hide'); // Bootstrap 3 modal close
  }

}

/***** open  Prospect Application ***/

function pros_application(){
  window.location.href = 'edit_details.html';
}


// sign out code

function signOut() {
  localStorage.clear();
  sessionStorage.clear();

  window.location.href = "index.html";
  document.querySelector('.welcome_section').classList.remove('active');
  document.querySelector('.login_first').classList.add('active');

}



/****show and hide password***/ 

const eyeEvent = document.querySelectorAll('.eye_event');

  eyeEvent.forEach(function(itm){
    itm.onclick = function(){
      let inpt  = itm.previousElementSibling;
          if(inpt.type === 'password'){
            itm.src = "img/eye-open.png";
            inpt.type = "text";
          }
          else{
            itm.src = "img/eye-close.png";
            inpt.type = "password";
          }
    }
  })

