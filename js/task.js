function initialize() {

    //Initialise popup
    generatePopupHtml($("#preloader"));
    fetchUsers(0);

    //Click Listeners
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

    $(".user-link-js").click(function(){
        fetchUser(this.text());
    });

    //Scroll Listeners
    var popupList = $('.users-list');
    popupList.scroll(function () {

        var scrollTop = $(this).scrollTop();
        var innerHeight = $(this).innerHeight();
        var scrollHeight = $(this)[0].scrollHeight;

        if(scrollTop + innerHeight >= scrollHeight - 1) {
            var lastUser = $('.user-selected-js > a').length;
            fetchUsers(lastUser);
            $(this).scrollTop(scrollHeight - innerHeight);
        }
    });
}

function generatePopupHtml(targetElement){
    $(targetElement).after(
    `<div id="users" class="row-full-width">
        <div class="github-users">
            <div class="popup-header-container">
                <h3>GitHub Users</h3>
            </div>
            <div class="popup-list-container" style="display:none;">
                <ul class="users-list">
                </ul>
            </div>
            <div class="popup-user-details" style="display:block;">
                <div class="user-details-inner-container">
                    <img class="user-image" src="https://avatars0.githubusercontent.com/u/1?v=4"></img>
                    <h3>Stats</h3>
                    <div>
                        <p>Public repos : </p>
                        <p>repos</p>
                    </div>
                    <div>
                        <p>Public gists : </p>
                        <p>gists</p>
                    </div>
                    
                </div>
            </div>
        </div>
    </div>`
    );
}

function fetchUsers(lastUserIndex){
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
    var htmlUserItems="";

    data.forEach(element => 
    {
        var userItem = `
        <li class="user-selected-js">
            <a href="" class="user-link-js" >`+ element.login +`</a>
        </li>`;
        htmlUserItems = htmlUserItems + userItem;
    });
            
    $(targetElement).append(htmlUserItems).fadeIn();
}

function fetchUser(username) {
    var url = "https://api.github.com/users/" + username;

    $.ajax({
        url: url,
        method: "GET",
        success: function(data, status, jqXHR){
            showUserDetails(data);
        }
    })
}

function showUserDetails(data){

}

$(document).ready(initialize());
