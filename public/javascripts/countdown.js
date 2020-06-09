var timeleft=19;
var downloadTimer = setInterval(function(){
    if(timeleft <= 0){
      clearInterval(downloadTimer);
      document.getElementById("countdown").innerHTML = "Sorry:)), you are redirected";
      //change location href to https://localhost:3000/main to use domain locally
      window.location.href = "https://sheltered-dusk-63801.herokuapp.com/main"
    } else {
    document.getElementById("countdown").innerHTML = `<strong>${timeleft}</strong>`+' second remains';
    }
    timeleft -= 1;
  }, 1100);