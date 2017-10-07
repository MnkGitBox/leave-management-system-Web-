(function(){

  const txtEmail = document.getElementById('email');
  const txtPassword = document.getElementById('pass');
  const signInBtn = document.getElementById('signIn');

  signInBtn.addEventListener('click', e => {
    const email = txtEmail.value;
    const pass = txtPassword.value;
    const auth = firebase.auth();

    const promise = auth.signInWithEmailAndPassword(email,pass);
    promise.catch(e => alert(e.message));
  });

  firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser){
      checkAuthState(firebaseUser.uid)
    }else{

    }
  });

}());

function checkAuthState(uid){
  const ref = firebase.database().ref().child('users/'+uid);
  ref.once('value').then(function(snapshot){
    if (snapshot.val().auth_type == "admin") {
      window.location.replace('index.html');
    }else {
      alert("You don't have authentication to login this site.");
      const promise = firebase.auth().signOut();
      promise.catch(e => alert('Signout Err: '+e.message));
    }
  },function(err){
    console.error(err);
  });
}
