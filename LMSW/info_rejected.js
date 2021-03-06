var infoId;
var snapVal;
(function(){
  infoId = window.location.hash.substring(1);
  const refInfo = firebase.database().ref().child('details/'+infoId);


  refInfo.on('value', snap => {
    snapVal = snap.val();
    createForm(snap.val());

  });

}());


function createForm(snapValue){

getUserDetails(snapValue.userID);
getLeaveDetailsAndSet(snapValue.leaveTypeID);

const reqDetails = document.getElementById('reason_prag');
const spanTagRea = document.createElement('span');
spanTagRea.setAttribute('class','value');
spanTagRea.innerHTML = snapValue.reqReason;
reqDetails.appendChild(spanTagRea);
const begaDate = document.getElementById('began_day');
const reqDate = document.getElementById('req_date');
const returnDate = document.getElementById('ret_date');
const spanTagBeg = document.createElement('span');
const spanTagReq = document.createElement('span');
const spanTagRet = document.createElement('span');
spanTagBeg.setAttribute('class','value');
spanTagReq.setAttribute('class','value');
spanTagRet.setAttribute('class','value');

const reqFullDate = new Date(snapValue.reqDate * 1000);
const beganFullDate = new Date(snapValue.beginDate * 1000);
const retuFullDate = new Date(snapValue.returnDate * 1000);

spanTagBeg.innerHTML = beganFullDate.toDateString()
spanTagReq.innerHTML = reqFullDate.toDateString();
spanTagRet.innerHTML = retuFullDate.toDateString();

reqDate.appendChild(spanTagReq);
begaDate.appendChild(spanTagBeg);
returnDate.appendChild(spanTagRet);

const rejReason = document.getElementById('rej_reason');
const rejUsr = document.getElementById('rej_user');
const rejTime = document.getElementById('rej_time');

const spanTagRejRe = document.createElement('span');
const spanTagRejUsr = document.createElement('span');
const spanTagRejTime = document.createElement('span');

spanTagRejRe.setAttribute('class','value');
spanTagRejUsr.setAttribute('class','value');
spanTagRejTime.setAttribute('class','value');

spanTagRejRe.innerHTML = snapValue.rejReason;
const fullDay = new Date(snapValue.rejDate * 1000);
spanTagRejTime.innerHTML = fullDay.toDateString();

rejReason.appendChild(spanTagRejRe);
rejTime.appendChild(spanTagRejTime);

getFullUserDetails(spanTagRejUsr,rejUsr,snapValue.rejUserID);

}

function getUserDetails(usrId){
  const userName = document.getElementById('userName');
  const spanTag = document.createElement('span');
  spanTag.setAttribute('class','value');
  const refUser = firebase.database().ref().child('users/'+usrId);

  refUser.once('value').then(function(snapshot){
    spanTag.innerHTML = snapshot.val().name;
    userName.appendChild(spanTag);
  },function(err){
    console.error(err);
  });
}
function getFullUserDetails(spanTag,rejectedUsr,usrId){
  const refUser = firebase.database().ref().child('users/'+usrId);
  refUser.once('value').then(function(snapshot){
    spanTag.innerHTML = snapshot.val().name+', '+snapshot.val().occupation+', '+snapshot.val().department;
    rejectedUsr.appendChild(spanTag);
  },function(err){
    console.error(err);
  });
}

function getLeaveDetailsAndSet(leaveId){
  const leaveName = document.getElementById('leave_name');
  const spanTag = document.createElement('span');
  spanTag.setAttribute('class','value');

  const refLeaveType = firebase.database().ref().child('leaves/'+leaveId);

  refLeaveType.once('value').then(function(snapshot){
      spanTag.innerHTML = snapshot.val().name;
      leaveName.appendChild(spanTag);
  },function(err){
    console.error(err);
  });
}
