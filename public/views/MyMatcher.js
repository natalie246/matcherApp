var app = angular.module('MyMatcher',[]); 
var model ={};
var boys ={};
var girls={};
var val1,val2;
var val;
var val_max;
var location_array = [];
var education_array =[];
var locations=[];
var educations=[];
var boy_match;
var girl_match;
var boy_item;
var name=[];


app.run(function($http, $rootScope){
    // Load the SDK asynchronously
    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    window.fbAsyncInit = function() {
        FB.init({
          appId      : '985267198171582',
          cookie     : true,  // enable cookies to allow the server to access 
                              // the session
          xfbml      : true,  // parse social plugins on this page
          version    : 'v2.3' // use version 2.2
        });
        //$rootScope.getLoginStatus();
    }

    $rootScope.getLoginStatus= function(){
         FB.getLoginStatus(function(response) {
            $rootScope.statusChangeCallback(response);
            window.location.href ="boysgirls.html";
        });
    }
 
    $rootScope.statusChangeCallback= function(response){
          console.log('statusChangeCallback');
              if (response.status === 'connected') {
                // Logged into your app and Facebook.
                $rootScope.testAPI();
              }
    }  
 
    $rootScope.testAPI= function(){
       console.log('Welcome!  Fetching your information.... ');
          FB.api('/me/friends?fields=id,name,gender,picture{url}', function(response) {
            console.log('Successful login for: ' , response);
            // alert(response.data[1].name);
            $rootScope.updateUser(response);    
            // document.getElementById('status').innerHTML =
            //   'Thanks for logging in!';
          });
    }

    $rootScope.login= function(){
      FB.login(function(data){
        console.log(data);
        $rootScope.getLoginStatus();
      },["public_profile","email","user_friends"])
    } 
  
     $rootScope.updateUser= function(data){
             $.ajax({
            url:"https://matcher.herokuapp.com/user",
            method:"post",
            data: data,
            //contentType:"application/json",
            success:function(data){
              console.log(data);
              console.log('success : data',data);
            },
            error:function(err){
              console.log("ajax error");
            }
          })
     }   

   $http.get('https://matcher.herokuapp.com/girls').success(function(data) {
        girls.items = data;
    });

    $http.get('https://matcher.herokuapp.com/boys').success(function(data) {
        boys.items = data;
    });
});


app.controller('finallyMatch',function($scope,$http) {
  $scope.bid = bid();
  $scope.gid = gid();
  $scope.bname = {};
  $scope.bpic = {};
  $scope.bage = {};
  $scope.bedu = {};
  $scope.bloc = {};
  $scope.gname = {};
  $scope.gpic = {};
  $scope.gage = {};
  $scope.gedu = {};
  $scope.gloc = {};
  $scope.selectedIndex2 = 0;
  $scope.selectedIndex = 0;

     
    $(document).ready(function(){

        $http.get('https://matcher.herokuapp.com/boys').success(function(data) {
          boys.items = data;

            for(var i=0; i<boys.items.length; i++)
            {  
                 if (boys.items[i].id == bid())
                {
                    var aKeyValue = boys.items[i].name.split(" ");
                    $scope.bname = aKeyValue[0];  
                    console.log("boys.items[i].name "+boys.items[i].name);
                    console.log("$scope.bname "+$scope.bname);
                    console.log("aKeyValue "+aKeyValue);
                    $scope.bage = boys.items[i].age;
                    $scope.bpic = boys.items[i].picture;
                    $scope.bedu = boys.items[i].education;
                    $scope.bloc = boys.items[i].location;
                }
            } 
        });

        $http.get('https://matcher.herokuapp.com/girls').success(function(data) {
           girls.items = data;

            for(var i=0; i<girls.items.length; i++)
            {  
                 if (girls.items[i].id == gid())
                {
                    var aKeyValue = girls.items[i].name.split(" ");
                    $scope.gname = aKeyValue[0]; 
                    console.log("girls.items[i].name "+girls.items[i].name);
                    console.log("$scope.bname "+$scope.gname);
                    console.log("aKeyValue "+aKeyValue);
                    $scope.gage = girls.items[i].age;
                    $scope.gpic = girls.items[i].picture;
                    $scope.gedu = girls.items[i].education;
                    $scope.gloc = girls.items[i].location;
                }
            }
        }); 
    });
});

  function bid() {
    var aKeyValue = window.location.search.substring(1).split("&");
     val = aKeyValue[0].split("=")[1];
    return val;
  };

  function gid() {
    var aKeyValue = window.location.search.substring(1).split("&");
     val = aKeyValue[1].split("=")[1];
    return val;
  }; 

app.controller('boysNgirlsController',function($scope,$http) {

  $scope.val = getval();
  $scope.val2 = getval2();
  $scope.locations = getArrayLocations();
  $scope.educations = getArrayEducations();
  $scope.testGirls = {items:[]};
  $scope.testBoys = {items:[]};

  $scope.boyMatch = function($index,item,$http){
      console.log("im in boy match");
      console.log("index: " + $index);
      console.log("item " , item);

      $scope.selectedIndex = $index;
      boy_match = item;

      if(girl_match)
      {
        console.log("there is match - before girl after boy");
        window.location.href="match.html?bid="+boy_match.id+"&gid="+girl_match.id;
      }
  }

  $scope.girlMatch = function($index,item,$http){
      console.log("im in girl match");
      console.log("index: " + $index);
      console.log("item " , item);

      $scope.selectedIndex2 = $index;
      girl_match = item;

      if(boy_match)
      {
        console.log("there is match before boy after girl");
        window.location.href="match.html?bid="+boy_match.id+"&gid="+girl_match.id;
      }
  }
             
  $(document).ready(function(){

          $http.get('https://matcher.herokuapp.com/boys').success(function(data) {
              boys.items = data;

              if(location_array != "" && education_array != "")
              {
                  for(var i=0; i<boys.items.length; i++)
                  {
                      for(var j=0; j<location_array.length; j++)
                      {
                          for(var k=0; k<education_array.length; k++)
                          {
                              if (boys.items[i].location == location_array[j] && boys.items[i].education == education_array[k] && boys.items[i].age > getval() && boys.items[i].age < getval2())
                              $scope.testBoys.items.push(boys.items[i]);
                          }
                      }            
                  } 
              }

              if(location_array != "" && education_array == "")
              {
                  for(var i=0; i<boys.items.length; i++)
                  {
                      for(var j=0; j<location_array.length; j++)
                      {
                          if (boys.items[i].location == location_array[j] && boys.items[i].age > getval() && boys.items[i].age < getval2())
                          $scope.testBoys.items.push(boys.items[i]);
                         
                      }            
                  } 
              }

                if(location_array == "" && education_array != "")
              {
                  for(var i=0; i<boys.items.length; i++)
                  { 
                      for(var k=0; k<education_array.length; k++)
                      {
                          if (boys.items[i].education == education_array[k] && boys.items[i].age > getval() && boys.items[i].age < getval2())
                          $scope.testBoys.items.push(boys.items[i]);
                      }
                  } 
              }

              if(location_array == "" && education_array == "")
              {
                  for(var i=0; i<boys.items.length; i++)
                  {
                     if(boys.items[i].age > getval() && boys.items[i].age < getval2())
                     $scope.testBoys.items.push(boys.items[i]);             
                  }
              }                 
          });

          $http.get('https://matcher.herokuapp.com/girls').success(function(data) {
              
              girls.items = data;

              if(location_array != "" && education_array != "")
              {
                  for(var i=0; i<girls.items.length; i++)
                  {
                      for(var j=0; j<location_array.length; j++)
                      {
                          for(var k=0; k<education_array.length; k++)
                          {
                              if (girls.items[i].location == location_array[j] && girls.items[i].education == education_array[k] && girls.items[i].age > getval() && girls.items[i].age < getval2())
                              $scope.testGirls.items.push(girls.items[i]);
                          }
                      }            
                  } 
              }

              if(location_array != "" && education_array == "")
              {
                  for(var i=0; i<girls.items.length; i++)
                  {
                      for(var j=0; j<location_array.length; j++)
                      {
                          if (girls.items[i].location == location_array[j] && girls.items[i].age > getval() && girls.items[i].age < getval2())
                          $scope.testGirls.items.push(girls.items[i]);
                         
                      }            
                  } 
              }

              if(location_array == "" && education_array != "")
              {
                  for(var i=0; i<girls.items.length; i++)
                  { 
                      for(var k=0; k<education_array.length; k++)
                      {
                          if (girls.items[i].education == education_array[k] && girls.items[i].age > getval() && girls.items[i].age < getval2())
                          $scope.testGirls.items.push(girls.items[i]);
                      }
                  } 
              }

              if(location_array == "" && education_array == "")
              {
                  for(var i=0; i<girls.items.length; i++)
                  {
                     if(girls.items[i].age > getval() && girls.items[i].age < getval2())
                     $scope.testGirls.items.push(girls.items[i]);             
                  }
              }                   
          });
   });
});

  function getval() {
    var aKeyValue = window.location.search.substring(1).split("&");
     val = aKeyValue[0].split("=")[1];
    console.log("val"+val);
    return val;
  };

  function getval2() {
    var aKeyValue = window.location.search.substring(1).split("&");
     val_max = aKeyValue[1].split("=")[1];
        console.log("val2"+val);

    return val_max;
  };

   function getArrayLocations() {
    var aKeyValue = window.location.search.substring(2).split("&");
    location_array = aKeyValue[2].split("=")[1];
      //console.log("aKeyValue"+aKeyValue);
     location_array = location_array.split(',');
    return location_array ;
  };

     function getArrayEducations() {
    var aKeyValue = window.location.search.substring(3).split("&");
    education_array = aKeyValue[3].split("=")[1];
    //  console.log("aKeyValue"+aKeyValue);
     education_array = education_array.split(',');
    return education_array ;
  };


app.controller('MyMatcherController',function($scope,$http, $location) {

    $scope.testBoys = boys;
    $scope.testGirls = girls;

    $scope.func = function($http){
      window.location.href="boysgirlsfilter.html?val1="+val1 +"&val2=" +val2+ "&arrayLocation="+locations + "&arrayEducation="+educations; 
    }
});


 $(function() {
      $( "#slider-range" ).slider({
        range: true,
        min: 10,
        max: 40,
        values: [ 12,35 ],
        slide: function( event, ui ) {
          $( "#amount" ).val(ui.values[ 0 ]);
          $( "#amount2" ).val(ui.values[ 1 ]);
          val1 = $( "#amount" ).val();
          val2 = $( "#amount2" ).val();
          console.log("val1 "+val1);
          console.log("val2 " +val2);
        }
         
      });

      val1 = $( "#slider-range" ).slider( "values", 0 );
      val2 = $("#slider-range" ).slider( "values", 1 );
      $( "#amount" ).val( $( "#slider-range" ).slider( "values", 0 ));
      $( "#amount2" ).val($( "#slider-range" ).slider( "values", 1 ));

});

  $(function() {
       $( "#slider1" ).click(function() {
          if($('#slider1 + div').css('display') == 'none')
        {
           $( "#slider1 > a").css("display","block") ;
           $( "#slider1").html("<a href='#'><img src='./images/age.png'>Age</a>");
            $( "#slider1 + div" ).css("display","block");  
            $( "#slider1" ).css("border-bottom","2px solid white") ;
            $( "#slider1 + div" ).css("border-bottom","2px solid #f8f8f8") ; 
        }
        else
        {
          $( "#slider1 > a").css("display","none");
             $( "#slider1").html("<a href='#'><img src='./images/age.png' class='B_img'> "+val1+"-"+val2+"</a></a><img src='./images/v.png' class='v_img'></a>");
            $( "#slider1 + div" ).css("display","none") ;  
             $( "#slider1" ).css("border-bottom","2px solid #f8f8f8"); 
        }
      });

      $( "#slider2" ).click(function() {
          if($('#slider2 + div').css('display') == 'none')
        {
            $( "#slider2 > a" ).css("display","block") ;  
            $( "#slider2").html("<a href='#'><img src='./images/location.png'>Location</a>");
            $( "#slider2 + div" ).css("display","block"); 
            $( "#slider2" ).css("border-bottom","2px solid #fff") ;
            $( "#slider2 + div" ).css("border-bottom","2px solid #f8f8f8") ; 
        }
        else
        {
            if(locations != "")
            {
              $( "#slider2 + div" ).css("display","none") ;
              $( "#slider2").html("<a href='#'><img src='./images/location.png' class='loc_img'><a>"+locations+"</a><img src='./images/v.png' class='v_img'></a>");
              $( "#slider2 + div" ).css("display","none") ;    
              $( "#slider2" ).css("border-bottom","2px solid #f8f8f8") ;
            }
            else
            {
              $( "#slider2 + div" ).css("display","none") ;
              $( "#slider2" ).css("border-bottom","2px solid #f8f8f8") ;
            } 
        }
      });


      $( "#slider3" ).click(function() {
            if($('#slider3 + div').css('display') == 'none')
          {
              $( "#slider3 > a" ).css("display","block") ;
              $( "#slider3").html("<a href='#'><img src='./images/education.png'>Education institution</a>");
              $( "#slider3 + div" ).css("display","block");   
              $( "#slider3" ).css("border-bottom","2px solid #fff") ;
              $( "#slider3 + div" ).css("border-bottom","2px solid #f8f8f8") ; 
          }
          else
          {
              if(educations != "")
              {
                $( "#slider3 + div" ).css("display","none") ;
                $( "#slider3").html("<a href='#'><img src='./images/education.png' class='loc_img'><a>"+educations+"</a><img src='./images/v.png' class='v_img'></a>");
                $( "#slider3 + div" ).css("display","none") ;    
                $( "#slider3" ).css("border-bottom","2px solid #f8f8f8") ;
              }
              else
              {
                $( "#slider3 + div" ).css("display","none") ;
                $( "#slider3" ).css("border-bottom","2px solid #f8f8f8") ;
              } 
          }  
        });
  });


  function changeImage(elem) {
    
      if ($(elem).attr("src") == "./images/checkboxes1.png")
      {
           $(elem).attr("src", "./images/fill.png");

           if(($(elem).attr("value") == 1) && (locations.indexOf("Tel-Aviv") == -1)){
              locations.push("Tel-Aviv");
           }
           if (($(elem).attr("value") == 2) && (locations.indexOf("Ramat-Gan") == -1)){
              locations.push("Ramat-Gan");
           }
          if (($(elem).attr("value") == 3) && (locations.indexOf("Jerusalem") == -1)){
           locations.push("Jerusalem");
          }
          if (($(elem).attr("value") == 4) && (locations.indexOf("Be'er-Sheva") == -1)){
           locations.push("Be'er-Sheva");
          }
          if (($(elem).attr("value") == 5) && (locations.indexOf("Reshon-Le-Zion") == -1)){
           locations.push("Reshon-Le-Zion");
          }
          if (($(elem).attr("value") == 6) && (locations.indexOf("Giv'ataim") == -1)){
           locations.push("Giv'ataim");
          }
          if (($(elem).attr("value") == 7) && (locations.indexOf("Bet-Shemesh") == -1)){
           locations.push("Bet-Shemesh");
          }
          if (($(elem).attr("value") == 8) && (locations.indexOf("Netania") == -1)){
           locations.push("Netania");
          }
          if (($(elem).attr("value") == 9) && (locations.indexOf("Ashdod") == -1)){
           locations.push("Ashdod");
          }
          if (($(elem).attr("value") == 10) && (locations.indexOf("Holon") == -1)){
           locations.push("Holon");
          }
          if (($(elem).attr("value") == 11) && (educations.indexOf("Shenkar") == -1)){
           educations.push("Shenkar");
          }
          if (($(elem).attr("value") == 12) && (educations.indexOf("Tel-Aviv-Uni") == -1)){
           educations.push("Tel-Aviv-Uni");
          }
          if (($(elem).attr("value") == 13) && (educations.indexOf("The-Hebrew-Uni") == -1)){
           educations.push("The-Hebrew-Uni");
          }
          if (($(elem).attr("value") == 14) && (educations.indexOf("Ben-Gurion") == -1)){
           educations.push("Ben-Gurion");
          }
      } 

      else
      {
          $(elem).attr("src", "./images/checkboxes1.png"); 

          if(($(elem).attr("value") == 1) && (locations.indexOf("Tel-Aviv") != -1)){
              deleteMe( locations , "Tel-Aviv");
           } 
           if(($(elem).attr("value") == 2) && (locations.indexOf("Ramat-Gan") != -1)){
              deleteMe( locations , "Ramat-Gan");
           }
           if(($(elem).attr("value") == 3) && (locations.indexOf("Jerusalem") != -1)){
              deleteMe( locations , "Jerusalem");
           }
           if(($(elem).attr("value") == 4) && (locations.indexOf("Be'er-Sheva") != -1)){
              deleteMe( locations , "Be'er-Sheva");
           }
           if(($(elem).attr("value") == 5) && (locations.indexOf("Reshon-Le-Zion") != -1)){
              deleteMe( locations , "Reshon-Le-Zion");
           } 
           if(($(elem).attr("value") == 6) && (locations.indexOf("Giv'ataim") != -1)){
              deleteMe( locations , "Giv'ataim");
           } 
           if(($(elem).attr("value") == 7) && (locations.indexOf("Bet-Shemesh") != -1)){
              deleteMe( locations , "Bet-Shemesh");
           } 
           if(($(elem).attr("value") == 8) && (locations.indexOf("Netania") != -1)){
              deleteMe( locations , "Netania");
           } 
           if(($(elem).attr("value") == 9) && (locations.indexOf("Ashdod") != -1)){
              deleteMe( locations , "Ashdod");
           } 
           if(($(elem).attr("value") == 10) && (locations.indexOf("Holon") != -1)){
              deleteMe( locations , "Holon");
           }
          if (($(elem).attr("value") == 11) && (educations.indexOf("Shenkar") != -1)){
           deleteMe(educations, "Shenkar");
          }
           if (($(elem).attr("value") == 12) && (educations.indexOf("Tel-Aviv-Uni") != -1)){
           deleteMe(educations, "Tel-Aviv-Uni");
          }
          if (($(elem).attr("value") == 13) && (educations.indexOf("The-Hebrew-Uni") != -1)){
           deleteMe(educations, "The-Hebrew-Uni");
          }
           if (($(elem).attr("value") == 14) && (educations.indexOf("Ben-Gurion") != -1)){
           deleteMe(educations, "Ben-Gurion");
          }   
      }   
}


var deleteMe = function( arr, me ){
   var i = arr.length;
   while( i-- ) if(arr[i] === me ) arr.splice(i,1);
}

function Match() {
  $(".notification").html("facebook notification sent");
   $( "#slider3 > a" ).css("display","block") ;
}
    