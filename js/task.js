function initialize() {
    fetchAllUsers();

    var popupActive=false;
    $(".popup-header-container").click(function(){
        if(!popupActive){
            $(".github-users").animate({bottom: "300px"},400, null);
            popupActive=true;
        } else {
            $(".github-users").animate({bottom: "50px"},400, null);
            popupActive=false;
        }
    });


    $(".user-selected-js").click(function(){

    });
}

function fetchAllUsers(){
    $.ajax({
        url: "https://api.github.com/users",
        method: "GET",
        success: function(data, status, jqXHR){
            console.log(data);
        }
    });
}

function fetchedUsersToList(data, status){
    
}

function fetchSingleUser() {

}

$(document).ready(initialize());
