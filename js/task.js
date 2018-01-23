function initialize() {

    generateAndInsertPopupHtml($("#preloader"));
    fetchUsersAndGenerateHtml(0);

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

    var popupList = $('.users-list');
    popupList.scroll(function () {
   
        //TODO:: THIS !!!!
        if($(this).scrollTop() + $(this).innerHeight() == $(this)[0].scrollHeight-1) {
                var lastUser = $('.user-selected-js > a').length;
                fetchUsersAndGenerateHtml(lastUser);
        }
    });
}

function generateAndInsertPopupHtml(targetElement){
    $(targetElement).after(
    `<div id="users" class="row-full-width">
        <div class="github-users">
            <div class="popup-header-container">
                <h3>GitHub Users</h3>
            </div>
            <div class="popup-list-container">
                <ul class="users-list">
                </ul>
            </div>
            <div class="popup-user-details">
                <p>whatever</p>
            </div>
        </div>
    </div>`
    );
}

function fetchUsersAndGenerateHtml(lastUserIndex){
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
            console.log(data);
            console.log(status);
            console.log(jqXHR);

            var htmlUserItems="";
            console.log(data);
            data.forEach(element => {
                var userItem = `<li class="user-selected-js">
                                    <a href="empty" id="`+ element.id +`" index="`+ "" +`">`+ element.login +`</a>
                                </li>`;
                htmlUserItems = htmlUserItems + userItem;
            });
            
            $(".users-list").append(htmlUserItems).fadeIn();
        }
    });
}

function fetchSingleUser() {

}

$(document).ready(initialize());
