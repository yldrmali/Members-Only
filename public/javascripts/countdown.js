var timeleft=19;
var downloadTimer = setInterval(function(){
    if(timeleft <= 0){
      clearInterval(downloadTimer);
      document.getElementById("countdown").innerHTML = "Sorry:)), you are redirected";
      window.location.href = "http://localhost:3000/main"
    } else {
    document.getElementById("countdown").innerHTML = `<strong>${timeleft}</strong>`+' second remains';
    }
    timeleft -= 1;
  }, 1100);