$(document).ready(function(){
    //Initialise popup
    generatePopupHtml($("#preloader"));
    fetchUsers(0);
 
    //Click Listeners
    var popupActive=false;
    $(".popup-header-container").click(function(){
        //Show/hide popup
        if(!popupActive){
            $(".github-users").animate({bottom: "350px"},400, null);
            popupActive=true;
        } else {
            $(".github-users").animate({bottom: "50px"},400, null);
            popupActive=false;
        }
    });

    $(".popup-header-container").find(".close-user-js").click(function(event){
        //Close user details
        event.stopPropagation();
        $(".close-user-js").addClass("hidden");
        $(".popup-list-container").show().animate({opacity: '1'},500,null);
        $(".popup-header-container > h3").text("GitHub Users");
        $(".user-details-inner-container").empty();
        removeSeenUsersFromList();
    });

    $(document).on('click','.user-link-js',function(e){
        //Open user details
        e.preventDefault();
        saveUsersToLocalStorage($(this).text());
        fetchUser($(this).text());
        $(".popup-list-container").animate({opacity: '0'},500,function(){
            $(this).hide();
            $(".close-user-js").removeClass("hidden");
        });
    });
 
    //Scroll Listeners
    var popupList = $('.users-list');
    popupList.scroll(function () {
        
        var scrollTop = $(this).scrollTop();
        var innerHeight = $(this).innerHeight();
        var scrollHeight = $(this)[0].scrollHeight;
        
        //Load more users
        if(scrollTop + innerHeight >= scrollHeight - 1) {
            var lastUser = $('.user-selected-js').length;
            fetchUsers(lastUser);
            $(this).scrollTop(scrollHeight - innerHeight);
        }
    });
});

function generatePopupHtml(targetElement){
    $(targetElement).after(
    `<div id="users" class="row-full-width">
        <div class="github-users">
            <div class="popup-header-container">
                <h3>GitHub Users</h3>
                <i class="fa fa-remove hidden close-user-js"></i>
            </div>
            <div class="popup-list-container">
                <ul class="users-list">
                </ul>
            </div>
            <div class="popup-user-details">
                <div class="user-details-inner-container">
                </div>
            </div>
        </div>
    </div>`
    );
}

function showUserDetails(data, targetElement){
    var company = data.company;
    if(company==null){
        company="None"
    }

    var htmlUserDetails = `                    
    <div class="row">
        </br>
        <img class="user-image" src=`+ data.avatar_url +`></img>
        <h3 class="no-margin">Stats</h3>
        <span>Company: `+ company +`</span>
        </br>
    </div>
    <div class="row sm-margin-bottom">
        <div class="col-md-6">
            <p>Public repos : </p>
            <p>` + data.public_repos + `</p>
        </div>
        <div class="float-right col-md-6">
            <p>Public gists : </p>
            <p>` + data.public_gists + `</p>
        </div>
    </div>`
    $(targetElement).append(htmlUserDetails);
    $(".popup-header-container > h3").text(data.login);
}

function appendUsersToList(data, targetElement){
    var htmlUserItems="";
    data.forEach(element => 
    {
        var userItem = `
            <li class="user-selected-js">
                <a href="" class="user-link-js" >`+ element.login +`</a>
            </li>`;
            htmlUserItems += userItem;
    });

    $(targetElement).append(htmlUserItems).fadeIn();
}

function fetchUsers(lastUserIndex){
    var url="https://api.github.com/users"

    if(lastUserIndex == undefined){
        return console.log("Last fetched user is undefined");
    }
    else if(lastUserIndex != 0){
        url += "?since=" + lastUserIndex;
    }

    $.ajax({
        url: url,
        method: "GET",
        success: function(data, status, jqXHR){
            appendUsersToList(data,".users-list");
        }
    });
}

function fetchUser(username) {
    var url = "https://api.github.com/users/" + username;

    $.ajax({
        url: url,
        method: "GET",
        success: function(data, status, jqXHR){
            showUserDetails(data, ".user-details-inner-container");
        }
    })
}

function removeSeenUsersFromList(){
    var seenUsers = getUsersFromLocalStorage();
    if(seenUsers != null && seenUsers != undefined){
        for(var i = 0; i<seenUsers.length; i++){
            $(".user-selected-js > .user-link-js:contains('"+ seenUsers[i] +"')" ).parent().remove();
        }
    }
}

function saveUsersToLocalStorage(username){
    var viewedUsers = getUsersFromLocalStorage();

    if(viewedUsers != null && viewedUsers != undefined){
        viewedUsers.push(username);
    }
    else{
        viewedUsers = [];
        viewedUsers.push(username);
    }
    localStorage.setItem("viewedUsers", JSON.stringify(viewedUsers));
}

function getUsersFromLocalStorage(){
    return JSON.parse(localStorage.getItem("viewedUsers"));
}



