var numBasic = 0;

const currUser = firebase.auth().currentUser;
(function(){
  const dbRefObject = firebase.database().ref().child('details').orderByChild("reactionTime").limitToFirst(11);
  const emptyNewsLetter = document.getElementById('empty_newsLetter');

  dbRefObject.on('child_added', snap => {
    if (snap.val().currState != "pending") {
        numBasic += 1;
        if (numBasic < 11) {
          createCard(snap, false);
        }
        emptyNewsLetter.innerText = "";
    }
  });

  const showDetailsBtn = document.getElementById('showDetails');
  const currUsrInfo = document.getElementById('usr_info_ul');
  const signOutBtn = document.getElementById('signuotBtn');
  showDetailsBtn.addEventListener('click', e =>{
    if (currUsrInfo.style.visibility == 'visible') {
      currUsrInfo.style.visibility = 'hidden';
    }else {
      currUsrInfo.style.visibility = 'visible';
    }
  });
  signOutBtn.addEventListener('click', e => {
    if (confirm('Are you really want to signout..?')) {
      const promise = firebase.auth().signOut();
      promise.catch(e => alert('Signout Err: '+e.message));
      currUsrInfo.style.visibility = 'hidden';
    }
  });

  firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser){
      const pUserName = document.getElementById('currUsrName');
      const imgUser = document.getElementById('currUsrImg');
      const currUsrFullName = document.getElementById('curr_user_fullName');
      const currUsrOccupation = document.getElementById('curr_user_occupation');
      const refCurrUser = firebase.database().ref().child('users/'+firebaseUser.uid);
      refCurrUser.once('value', snap =>{
          pUserName.innerText = snap.val().user_name;
          currUsrFullName.innerText = snap.val().name;
          currUsrOccupation.innerText = snap.val().occupation;
          imgUser.setAttribute('src',snap.val().pro_pic_url);
      });

    }else{

      window.location.replace('signInPage.html');
    }
  });

}());

var referenceDiv;
var numOb;


function createCard(snapValue, onMore){

  const divCard = document.createElement('div');
  divCard.setAttribute('class','card');
  divCard.setAttribute('id','cardId');
  const divUser = document.createElement('div');
  divUser.setAttribute('class','user');
  const divUsrImg  = document.createElement('div');
  const usrImg = document.createElement('img');
  usrImg.setAttribute('src','source/ico/pro_img.png');
  usrImg.setAttribute('alt','pro_pic');
  const divUsrDetails = document.createElement('div');
  divUsrDetails.setAttribute('class','subUsrDetails');
  const h2Name = document.createElement('h2');
  const pDesignation = document.createElement('p');
  const divIndicator = document.createElement('div');
  divIndicator.setAttribute('class','indicator');
  const imgIndicator = document.createElement('img');
  imgIndicator.setAttribute('alt','indicator');
  const divLeave = document.createElement('div');
  divLeave.setAttribute('class','leave');
  const h2LeaveName = document.createElement('h2');
  const pReason = document.createElement('p');
  const divMore = document.createElement('div');
  divMore.setAttribute('class','more');
  const pMore = document.createElement('p');
  const aLink = document.createElement('a');

  const userId = snapValue.val().userID;
  getUserDetailsAndSet(userId,h2Name,pDesignation,usrImg );

  switch (snapValue.val().currState) {
    case 'accept':
      imgIndicator.setAttribute('src','source/ico/approved_new.png');
      divMore.style.backgroundColor = '#16A085';
      aLink.innerText = 'Show details..';
      aLink.setAttribute('href','approved_request.html#'+snapValue.key);
      break;
    case 'reject':
      imgIndicator.setAttribute('src','source/ico/reject_new.png');
      divMore.style.backgroundColor = '#E74C3C';
      aLink.innerText = 'Show details..';
      aLink.setAttribute('href','rejected_request.html#'+snapValue.key);
      break;
    default:
      break
  }
  const leaveId = snapValue.val().leaveTypeID;
  setLeaveDetailsAndSet(leaveId,h2LeaveName);
  pReason.innerText = snapValue.val().reqReason;


  const requests = document.getElementById('reqContainer');

  const moreObDiv = document.createElement('div');
  moreObDiv.setAttribute("class","moreObDiv");
  moreObDiv.setAttribute("id","moreOb");


  const moreObBtn = document.createElement('button');
  moreObBtn.setAttribute("onClick","showMoreDetails()");
  moreObBtn.setAttribute("class","moreObBtn");
  moreObBtn.innerText = "LOAD MORE"

  moreObDiv.appendChild(moreObBtn);


  if (referenceDiv == null){
    requests.appendChild(divCard);
    requests.appendChild(moreObDiv);
    referenceDiv = divCard;
    numOb = 1;
  }else{
    requests.insertBefore(divCard,referenceDiv);
    referenceDiv = divCard
    numOb += 1;

    const moreDiv = document.getElementById("moreOb");
    if (!onMore) {
      if(numOb % 3 == 0){
        moreDiv.style.marginTop = "40px";
        moreDiv.style.float = "right"

      }else{
        moreDiv.style.marginTop = "210px"
        moreDiv.style.float = "left"

      }
      if (numBasic > 9) {
        moreDiv.style.visibility = 'visible';
      }else {
        moreDiv.style.visibility = 'hidden';
      }

    }else {
        moreDiv.style.visibility = 'hidden';
    }
  }


  divCard.appendChild(divUser);
  divUser.appendChild(divUsrImg);
  divUsrImg.appendChild(usrImg);
  divUser.appendChild(divUsrDetails);
  divUsrDetails.appendChild(h2Name);
  divUsrDetails.appendChild(pDesignation);

  divCard.appendChild(divIndicator);
  divIndicator.appendChild(imgIndicator);

  divCard.appendChild(divLeave);
  divLeave.appendChild(h2LeaveName);
  divLeave.appendChild(pReason);

  divCard.appendChild(divMore);
  divMore.appendChild(pMore);
  pMore.appendChild(aLink);

}
function getUserDetailsAndSet(userId,name,designation,proImg){
  const dbRefUser = firebase.database().ref().child('users/'+userId);
  dbRefUser.once('value').then(function(snapshot){
    name.innerText = snapshot.val().name;
    designation.innerText = snapshot.val().occupation +", "+ snapshot.val().department +"." ;
    proImg.setAttribute('src',snapshot.val().pro_pic_url);
  },function(err){
    console.error(err);
  })
}
function setLeaveDetailsAndSet(leaveId,leaveName){
  const dbRefLeave = firebase.database().ref().child('leaves/'+leaveId);
  dbRefLeave.once('value').then(function(snapshot){
    leaveName.innerText = snapshot.val().name;
  },function(err){
    console.error(err);
  });
}
function showMoreDetails(){
  const dbRefObject = firebase.database().ref().child('details').orderByChild("reactionTime");

    var con = document.getElementById("reqContainer");
    con.outerHTML = "";
    delete con;
    const sec = document.getElementById('reqSecID');

    con = document.createElement('div');
    con.setAttribute('class','container');
    con.setAttribute('id','reqContainer');

    const nwsLtter = document.createElement('h2');
    nwsLtter.setAttribute('class','empty_newsLetter');
    nwsLtter.setAttribute('id','empty_newsLetter');
    nwsLtter.innerText = "Loading..,Please wait little bit..";

    con.appendChild(nwsLtter);
    sec.appendChild(con);
    referenceDiv = null;

  dbRefObject.on('child_added', snap => {
    if (snap.val().currState != "pending") {

        createCard(snap, true);
        nwsLtter.innerText = '';

      }
  });
}
