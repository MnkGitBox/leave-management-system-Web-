(function(){

  const preObject = document.getElementById('preOb');
  const listOb = document.getElementById('list')

  const dbRefObject = firebase.database().ref().child('details');
  const dbrefList = dbRefObject.child('hobbies');

  dbRefObject.on('value', snap => {
    preOb.innerText = JSON.stringify(snap.val(),null,3);
  });

  // dbrefList.on('child_added', snap => {
  //   const li = document.createElement('li');
  //   li.appendChild(document.createTextNode(snap.val()));
  //   listOb.appendChild(li);
  // });


}());
