function generatePopupHtml(targetElement){
    //Generates and appends popup html
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

function fetchUsers(lastUserIndex){
    //Fetches users from the last user fetched
    var url="https://api.github.com/users"

    if(lastUserIndex == undefined){
        return console.log("Last fetched user is undefined");
    }
    else if(lastUserIndex != 0){
        url = url + "?since=" + lastUserIndex;
    }

    $.ajax({
        url: url,
        method: "GET",
        success: function(data, status, jqXHR){
            appendUsersToList(data,".users-list");
        }
    });
}

function appendUsersToList(data, targetElement){
    //Filters seen users from fetched users and append
    var savedUsers = getUsersFromLocalStorage();
    var hasUserBeenSeen = false;
    var htmlUserItems="";

    if(savedUsers==null || savedUsers==undefined){
        data.forEach(element => 
        {
            var userItem = `
                <li class="user-selected-js">
                    <a href="" class="user-link-js" >`+ element.login +`</a>
                </li>`;
                htmlUserItems += userItem;
        });
    } else {
        for(var j=0;j<data.length;j++) 
        {
            for(var i=0; i<savedUsers.length; i++){
                if(savedUsers[i] == data[j].login){
                    hasUserBeenSeen=true;
                    break;
                }
                else {
                    hasUserBeenSeen=false;
                }
            }
            if(hasUserBeenSeen){
                continue;
            }
            else{
                var userItem = `
                <li class="user-selected-js">
                    <a href="" class="user-link-js" >`+ data[j].login +`</a>
                </li>`;
                htmlUserItems += userItem;
            }
        };
    }

    $(targetElement).append(htmlUserItems).fadeIn();
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

var viewedUsers = [];
function saveUsersToLocalStorage(username){
    viewedUsers.push(username);
    localStorage.setItem("viewedUsers", JSON.stringify(viewedUsers));
}

function getUsersFromLocalStorage(){
    return JSON.parse(localStorage.getItem("viewedUsers"));
}

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

    $(".popup-header-container").find("i").click(function(event){
        //Close user details
        event.stopPropagation();
        $(".close-user-js").addClass("hidden");
        fetchUsers(0);
        $(".popup-list-container").show();
        $(".popup-list-container").animate({opacity: '1'},1000,null);
        $(".popup-header-container > h3").text("GitHub Users");
        $(".user-details-inner-container").empty();
         
    });

    $(document).on('click','.user-link-js',function(e){
        //Open user details
        e.preventDefault();
        saveUsersToLocalStorage($(this).text());
        fetchUser($(this).text());
        $(".popup-list-container").animate({opacity: '0'},1000,function(){
            $(this).hide();
            $(".close-user-js").removeClass("hidden");
            $(".users-list").empty();
        });
    });
 
    //Scroll Listeners
    var popupList = $('.users-list');
    popupList.scroll(function () {
        //Load more users
        var scrollTop = $(this).scrollTop();
        var innerHeight = $(this).innerHeight();
        var scrollHeight = $(this)[0].scrollHeight;
 
        if(scrollTop + innerHeight >= scrollHeight - 1) {
            var lastUser = $('.user-selected-js > a').length;
            fetchUsers(lastUser);
            $(this).scrollTop(scrollHeight - innerHeight);
        }
    });
});
