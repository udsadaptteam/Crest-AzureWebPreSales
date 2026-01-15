
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

nextBtns.addEventListener('click', function(){
 
  if(current<steps.length - 1){
    current++;
    runing(current);
  }

});

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
