var myTags;

function getCredentials() {
  var data = {
      'grant_type': 'client_credentials',
      'client_id': 'NMPECSTz69V6t_iG3DecYp_Y_G0kqXl1tdDdNlaX',
      'client_secret': 'Pu0FBJmcXON014ugEpdlmxNujj1u5kjakk5-asyX'
    };

    $.ajax({
      'url': 'https://api.clarifai.com/v1/token',
      'data': data,
      'type': 'POST'
    })
    .then(function(r) {
      localStorage.setItem('accessToken', r.access_token);
    });
}

function postImage(imgurl) {
    var data = {
      'url': imgurl
    };
    var accessToken = localStorage.getItem('accessToken');

    return $.ajax({
      'url': 'https://api.clarifai.com/v1/tag',
      'headers': {
        'Authorization': 'Bearer ' + accessToken
      },
      'data': data,
      'type': 'POST'
    }).then(function(r){
        localStorage.setItem('tagResp', r);
        parseResponse(r);
    });
  }

function  parseResponse(resp) {
    console.log(resp);
    var tags = [];
    if (resp.status_code === 'OK') {
      var results = resp.results;
      tags = results[0].result.tag.classes;
    } else {
      console.log('Sorry, something is wrong.');
    }
    myTags = tags;
    getTags(myTags);
    return tags;
  }

/* prints tags one by one in console and prints in html */
// function getTags(myTags) {
//   for(i in myTags) {
//     console.log(myTags[i]);
//   }
//   // myTags.toString();
//   document.getElementById("tags").innerHTML = myTags.toString();
// }
/* prints tags one by one in console and prints in html */
function getTags(myTags) {
  for(i in myTags) {
    console.log(myTags[i]);
  }
  //myTags.toString();
  var myArray = myTags.toString();
  document.getElementById("tags").innerHTML = myTags.toString();
  compare(myArray);
}

function compare (myArray) {
  var opt = {
        type: "basic",
        title: "Don't post!",
        message: "This contains possibly explicit content.",
        iconUrl: "icon.png"
  }

  var opt2 = {
        type: "basic",
        title: "Post!",
        message: "Yaaaaas. This content passed our filter test. :)",
        iconUrl: "icon.png"
  }
  var bool = false;
  var array = myArray.split(",");
  var compareArray = ["paraphernalia", "dab", "piece", "bowl", "bong", "seductive", "lingerie", "underwear", "bra", "brief", "smoke", "cigarette", "beer", "alcohol", "drink", "lager", "pub", "foam", "glass", "bar", "brewery", "ale", "competition", "wine", "bottle", "party", "full", "container", "liquid", "Merlot", "wineglass", "winery", "Cabernet", "liquor", "ice", "marijuana", "cannabis", "prescription", "illegal", "addiction", "medicine", "joint", "alternative", "pot", "healthcare", "pill", "treatment", "capsule", "cure", "pain", "drug", "illness", "syringe", "injection", "needle", "curse", "words", "fuck", "shit", "bitch", "ass", "cunt", "nude", "nudity", "naked", "cleavage", "breast", "nipple", "body", "penis", "butt", "boob", "shaft", "ball", "testicle", "gonad", "porn", "pornography", "sexy", "skin"];

var counter = 0;
  for(i in compareArray) {
    for (j in array) {
      
      if(array[j] == compareArray[i]) {
      bool = true;
      counter++;
      break;
      }
    }
  }
  if(bool == true && counter >=2) {
      chrome.notifications.create('reject', opt, function() { });
    }
    else {
      chrome.notifications.create('accept', opt2, function() { });
    }
}


function run(imgurl) {
        $.when(getCredentials())
          .then(postImage(imgurl));
}