var infoId;
var snapVal;
(function(){
  infoId = window.location.hash.substring(1);
  const refInfo = firebase.database().ref().child('details/'+infoId);


  refInfo.once('value', snap => {
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

function performReject(){

    const currUser = firebase.auth().currentUser;
    const textField = document.getElementById('reason');
    if (textField.value.length == 0 || textField.value == ""){
      alert('Please enter reason for the reject....');
    }else {
      if (currUser){
      var updates = {};
      var date = new Date();
      var inMiliSeconds = date.getTime();
      updates['details/'+infoId+'/currState'] = 'reject' ;
      updates['details/'+infoId+'/isChecked'] = false ;
      updates['details/'+infoId+'/reactionTime'] = inMiliSeconds / 1000;
      updates['details/'+infoId+'/rejDate'] = inMiliSeconds / 1000;
      updates['details/'+infoId+'/rejReason'] = textField.value;
      updates['details/'+infoId+'/rejUserID'] = currUser.uid;
      updates['user_leave_details/'+snapVal.userID+'/'+snapVal.leaveTypeID+'/'+infoId] = 'reject';
      // updates['details/'+infoId+'/currStateCatagory'] = 'reacted';

      const promise = firebase.database().ref().update(updates);
      promise.then(function(e){
        if (e) {
          alert(e.message)
        }else{
          window.location.replace('index.html');
          alert('Leave Rejected');
        }
      });
    }else{
      alert('Something went wrong, Please signin again..!');
      window.location.replace('signInPage.html');
    }
  }
}
function performApproved(){
    const currUser = firebase.auth().currentUser;
    if(currUser){
    var updates = {};
    var date = new Date();
    var inMiliSeconds = date.getTime();
    updates['details/'+infoId+'/currState'] = 'accept' ;
    updates['details/'+infoId+'/isChecked'] = false ;
    updates['details/'+infoId+'/reactionTime'] = inMiliSeconds / 1000;
    updates['details/'+infoId+'/accDate'] = inMiliSeconds / 1000;
    updates['details/'+infoId+'/accUserID'] = currUser.uid;
    updates['user_leave_details/'+snapVal.userID+'/'+snapVal.leaveTypeID+'/'+infoId] = 'accept';
    // updates['details/'+infoId+'/currStateCatagory'] = 'reacted';
    const promise = firebase.database().ref().update(updates);
    promise.then(function(e){
      if (e) {
        alert(e.message)
      }else{
        window.location.replace('index.html');
        alert('Leave Approved');

      }
    });
  }else{
    alert('Something went wrong, Please signin again..!');
    window.location.replace('signInPage.html');
  }
}
