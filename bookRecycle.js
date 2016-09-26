$( document ).ready(function() {
	
	//<script src="https://www.gstatic.com/firebasejs/3.4.0/firebase.js"></script>
	// Initialize Firebase
	var config = {
		apiKey: "AIzaSyBYNz3IGt8PS6kZBvN7gbkXMfLC2JekAMI",
		authDomain: "bookrecycle-5b8d1.firebaseapp.com",
		databaseURL: "https://bookrecycle-5b8d1.firebaseio.com",
		storageBucket: "bookrecycle-5b8d1.appspot.com",
		messagingSenderId: "12019208667"
	};
	firebase.initializeApp(config);

	//var bigOne = document.getElementById('testFirebase');
	//var dbRef = firebase.database().ref().child('school').child('George Mason University');
	//dbRef.on('value', snap => bigOne.innerText = snap.val());
	
	window.history;
	var textbookIDctr = 0;
	//User constructor
	function User(first, last, school, email, phone, user, pass){
		this.firstName = first;
		this.lastName = last;
		this.school = school;
		this.email = email;
		this.phone = phone;
		this.username = user;
		this.pass = pass;
		this.fullName = function(){
			return this.firstName + " " + this.lastName;
		}
	}
	
	var gmuCourses = ["CS100", "CS101", "CS105", "CS112", "CS211", "CS222", "CS262", "CS306", "CS310", "CS321", "CS330", "CS332", "CS367", "CS390", "CS425", "CS450", "CS451", "CS465", "CS469", "CS471", "CS477", "CS480", "CS482", "CS483", "CS484", "CS485", "CS490", "SWE205", "SWE432", "SWE437", "SWE443"];
	var jmuCourses = ["CS112", "CS211", "CS222", "CS262", "SWE432"];
	var uvaCourses = ["CS1010", "CS1110", "CS1111", "CS1112", "CS1113", "CS2102", "CS2110", "CS2150", "CS2910", "CS3102", "CS3205", "CS3240", "CS3330", "CS4102", "CS4414", "CS4457", "CS4457", "CS4501", "CS4630", "CS4710", "CS4720", "CS4740", "CS4750", "CS4753", "CS4810", "CS4970", "CS4980", "CS4993", "CS4998"];
	//map school name to courses provided by the school
	var schoolCourseMap = new Map();
	schoolCourseMap.set("GMU", gmuCourses);
	schoolCourseMap.set("JMU", jmuCourses);
	schoolCourseMap.set("UVA", uvaCourses);

	/**prints table of postings based on courseID and school */
	function printPostingToTable(courseID, school) {
		var table = document.getElementById("searchResultTable");
		$('#searchResultTable td').remove(); 	//reset table
		
		$('#postingsAppear').html('<b>Sorry, there are currently no postings for ' + courseID + ' by ' + school + ' students.</b>');
		
		console.log('in print posting');
		var ref = new Firebase("https://bookrecycle-5b8d1.firebaseio.com/school/" + school + "/" + courseID);
		ref.once("value", function(snapshot) {			//firebase.database().ref("school/" + school + "/" + courseID).once("value").then(function(snapshot) {
		  	//go through each postingID of this school, course search combination
			snapshot.forEach(function(childSnapshot) {
				$('#postingsAppear').html('<b>Textbook postings for ' + courseID + ' at ' + school + ' are the following: ');
				
				console.log('current postingID: '+ childSnapshot.key());
				var postingID = childSnapshot.key();
				
				var row = table.insertRow(table.rows.length);	//add row at the bottom
				var course = row.insertCell(0);
				var textbookTitle = row.insertCell(1);
				var isbn = row.insertCell(2);
				var author = row.insertCell(3);
				var sellerCell = row.insertCell(4);
				var email = row.insertCell(5);
				var phone = row.insertCell(6);
				var notes = row.insertCell(7);
				var price = row.insertCell(8);
				
				var textbookElems = ["author", "isbn", "note", "price", "title"];
				var textbookValsMap = new Map();
				
				course.innerHTML = courseID;
				firebase.database().ref("school/" + school + "/" + courseID + "/" + postingID + "/title").once('value').then(function(snapshot) {
					textbookTitle.innerHTML = snapshot.val();
				});
				firebase.database().ref("school/" + school + "/" + courseID + "/" + postingID + "/isbn").once('value').then(function(snapshot) {
					isbn.innerHTML = snapshot.val();
				});
				firebase.database().ref("school/" + school + "/" + courseID + "/" + postingID + "/author").once('value').then(function(snapshot) {
					author.innerHTML = snapshot.val();
				});
				//get seller info
				firebase.database().ref("school/" + school + "/" + courseID + "/" + postingID + "/sellerID").once('value').then(function(snapshot) {
					var sellerID = snapshot.val();
					firebase.database().ref("users/" + sellerID +"/firstName").once('value').then(function(snapshot) {
						var firstname = snapshot.val();
						firebase.database().ref("users/" + sellerID +"/lastName").once('value').then(function(snapshot) {
							sellerCell.innerHTML = firstname + " " + snapshot.val();
						});
					});
					firebase.database().ref("users/" + sellerID +"/email").once('value').then(function(snapshot) {
						email.innerHTML = snapshot.val();
					});
					firebase.database().ref("users/" + sellerID +"/phone").once('value').then(function(snapshot) {
						phone.innerHTML = snapshot.val();
					});
					
				});
				
				firebase.database().ref("school/" + school + "/" + courseID + "/" + postingID + "/note").once('value').then(function(snapshot) {
					notes.innerHTML = snapshot.val();
				});
				firebase.database().ref("school/" + school + "/" + courseID + "/" + postingID + "/price").once('value').then(function(snapshot) {
					price.innerHTML = snapshot.val();
				});
			});
		  
		});
	}
	/**Updates course options list based on schoolID passed in*/
	function updateCourseOptions(schoolID){
		console.log("modified courseOptions for school " + schoolID);
		var coursesArray = schoolCourseMap.get(schoolID);
		$('#courseOptions').find('option').remove().end().append('<option disabled selected style="color:red">-select-</option>');//.val('whatever');
		for (var course of coursesArray){
			var option = document.createElement("option");
			option.text = course;
			document.getElementById("courseOptions").add(option);
		}
	}
	$("#schoolOptions").change(function() {
		var selectedSchoolVal = $('#schoolOptions option:selected').val();
		console.log("clicked " + selectedSchoolVal);
		updateCourseOptions(selectedSchoolVal);		
	});
	
	function userExistsCallback(userId, exists) {
        if (exists) {
          alert('Username ' + userId + ' already exists. Please pick another one.');
		  document.getElementById("username").value = ""; //reset field
        } else {
			firebase.auth().createUserWithEmailAndPassword($('#email').val(), $('#pass').val()).then(function(user){
				//set up profile
				createUserProfile($('#username').val(), $('#firstname').val(), $('#lastname').val(), $('#school').val(), $('#email').val(), $('#phone').val());
				var user = firebase.auth().currentUser;
				
				user.updateProfile({
				  displayName: userId
				}).then(function() {
				  // Update successful.
				  console('displayname updated to: ' + userId);
				}, function(error) {
				  // An error happened.
				  console('displayname not updated');
				});
				firebase.auth().onAuthStateChanged(function(user) {
				  if (user) {
					// User is signed in.
					//$('#welcomeMsg').html('<b>Account successfully created. Welcome to BookRecycle ' + $('#firstname').val() + ' ' + $('#lastname').val() + '! '+ user.displayName +'</b>');
					alert('Account successfully created. Welcome to BookRecycle ' + $('#firstname').val() + ' ' + $('#lastname').val() + '! ');
				    window.location.href = "index.html";
				  } else {
					// No user is signed in.
				  }
				});
			}).catch(function(error) {
				// Handle Errors here.
				var errorCode = error.code;
				var errorMessage = error.message;
				console.log(errorCode);
				console.log(errorMessage);
				$('#welcomeMsg').html('<b>'+errorMessage+'</b>');
			});
        }
    }
       
      // Tests to see if /users/<userId> has any data. 
    function checkIfUserExists(userId) {
        //var usersRef = new Firebase("https://bookrecycle-5b8d1.firebaseio.com/users");
        //usersRef.child(userId).once('value').then(function(snapshot) {
        firebase.database().ref("users/" + userId).once('value').then(function(snapshot) {
		  var exists = (snapshot.val() !== null);
          userExistsCallback(userId, exists);
        });
      }
	
	function createUserProfile(userID, firstname, lastname, school, email, phone) {
		console.log('in create user profile ' + userID +' '+ firstname +' '+ lastname +' '+ school +' '+ email +' '+ phone);
		firebase.database().ref('users/' + userID).set({
		firstName: firstname,
		lastName: lastname,
		school: school,
		email: email,
		phone: phone
		});
	}
	/**Create Account page create account button*/
	$("#createAccountButton").click(function() {
		var labels = ['firstname', 'lastname', 'school', 'email', 'phone', 'username', 'pass', 'passreenter'];
		var unfilled = false;
		//recolor unfilled inputs
		for(var ind=0; ind<labels.length; ind++){
		if ( ( $('#'+ labels[ind] + '').val() ) == null  || ( $('#'+ labels[ind] + '').val() ) == '' ){
			$('#'+ labels[ind] +'Lbl').css("color", "red");
			unfilled = true;
		}
		else
			$('#'+ labels[ind] +'Lbl').css("color", "black");
		}
		if (unfilled)//$('#firstname').val()=='' || $('#lastname').val()=='' || $('#email').val()=='' || $('#phone').val()==''|| $('#username').val()==''|| $('#pass').val()=='')	
			alert('Please enter required fields');
		else if ($('#pass').val() != $('#passreenter').val() ){
			alert('Passwords do not match!');
			document.getElementById("pass").value = "";
			document.getElementById("passreenter").value = "";
		}
		else{
			checkIfUserExists($('#username').val());
		}
	});
	/**Login page login button*/
	$("#loginButton").click(function() {
		if ($('#username').val()== '' && $('#pass').val()== '')
			alert('Please enter Username and Password');
		else if ($('#username').val()=='')
			alert('Please enter Username');
		else if ($('#pass').val()=='')
			alert('Please enter Password');
		else{
			var email = '';
			var username = $('#username').val();
			firebase.database().ref("users/" + username).once('value').then(function(snapshot) {
				var exists = (snapshot.val() !== null);
				if (exists){
					var emailGetter = firebase.database().ref('users/' + ($('#username').val()) +'/email');
					emailGetter.on('value', function(snapshot) {
						console.log('hey here');
						email = snapshot.val();
						firebase.auth().signInWithEmailAndPassword(email, $('#pass').val()).then(function(user){
						//var user = firebase.auth().currentUser;
						//login success
						var name = firebase.database().ref().child('users').child($('#username').val()).child('firstName');
						$('#welcomeMsgInLogin').html('<b>Welcome back to BookRecycle ' + name + '! '+ user.displayName  +'</b>');
						var username = $('#username').val();
						window.location.href='index.html';
						console.log(username);
						}).catch(function(error) {
						  // Handle Errors here.
						  console.log('fail');
						  var errorCode = error.code;
						  var errorMessage = error.message;
						  console.log(errorMessage);
						  $('#welcomeMsgInLogin').html('<b><div style="color:red">'+errorMessage+'</div></b>');
						});
					});
				}
				else{
					console.log('Username ' + username + ' is not in system');
					$('#welcomeMsgInLogin').html('<b><div style="color:red">Username "'+ username +'" is not in our system. Please create an account.</div></b>');
				}
				  
				userExistsCallback(userId, exists);
			});
			
			console.log(email);
			
		}
	});
	$("#logoutLink").click(function() {
		firebase.auth().signOut().then(function() {
		  // Sign-out successful.
		  console.log('sign-out successful');
		}, function(error) {
		  // An error happened.
		  console.log('error in signing out');
		});
		location.reload();
	});
	window.onload = function(){
		firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
			// User is signed in.
				console.log('user logged in: ' + user.displayName);
				$('#navBarUser').html('<b>You are signed in as: <u>' + user.displayName + '</u></b>');
				
				//var first = firebase.database().ref('users/' + user.displayName +'/firstName');
				//var last = firebase.database().ref('users/' + user.displayName +'/lastName');
				$('#welcomeIndex').html('<b>Welcome '+ user.displayName + '!</b>');
				$('#welcomeIndex').show();
				$("#logoutLink").show();
				//display createPosting form
				$("#createPostingForm").show();
				$("#createPostingButton").show();
				$("#createPostingNotSignedInMsg").hide();
				$("#loginForm").hide();
				$("#loginButton").hide();
				$("#logInSignedInMsg").show();
				$("#createAccountForm").hide();
				$("#createAccountButton").hide();
				$("#createAccountSignedInMsg").show();
			 } else {
			// No user is signed in.
				$('#navBarUser').html('You are not logged in. Please sign in!');
				$('#welcomeIndex').hide();
				$("#createPostingForm").hide();
				$("#createPostingButton").hide();
				$("#createPostingNotSignedInMsg").show();
				$("#loginForm").show();
				$("#loginButton").show();
				$("#logInSignedInMsg").hide();
				$("#createAccountForm").show();
				$("#createAccountButton").show();
				$("#createAccountSignedInMsg").hide();
			}
		});
		/*var user = firebase.auth().currentUser;
		console.log(user.email);
		console.log('in load');
		if (firebase.auth().currentUser != null){
			console.log('inside if');
			$("#createPostingForm").show();
			$("#createPostingNotSignedInMsg").hide();
		}*/
	};
	function createTextbookPosting(school, course, userID, title, author, price, isbn, note) {
		//alert if user already has a post on school and course
		console.log('in createTextbookPosting function ' + school + ' ' + course + ' ' + userID + ' ' + title + ' ' + author + ' ' + price + ' ' + isbn + ' ' + note)
		/*firebase.database().ref('school/' + school + '/' + course + '/' + userID).set({
		title: title,
		author: author,
		price: price,
		isbn: isbn,
		note: note
		});*/
		var key = firebase.database().ref('school/' + school + '/' + course).push({
		sellerID: userID,
		title: title,
		author: author,
		price: price,
		isbn: isbn,
		note: note
		});
	}
	
	/**Create Postings page create posting button*/
	$("#createPostingButton").click(function() {
		console.log("clicked createposting button");
		if (firebase.auth().currentUser == null){
			alert('You are not signed in. Please sign in first.');
		}
		else{
		// $('#loading').show();
			
			console.log(firebase.auth().currentUser);
			var labels = ['schoolOptions', 'courseOptions', 'title', 'author', 'price']; //'isbn' and 'notes' are optional
			var unfilled = false;
			//recolor unfilled inputs
			for(var ind=0; ind<labels.length; ind++){
			if ( ( $('#'+ labels[ind] + '').val() ) == null  || ( $('#'+ labels[ind] + '').val() ) == '' ){
				$('#'+ labels[ind] +'Lbl').css("color", "red");
				unfilled = true;
			}
			else
				$('#'+ labels[ind] +'Lbl').css("color", "black");
			}
			if (unfilled)
				alert('Please enter required fields');
			else{
				console.log('post success');
				var isbn = $('#isbn').val();
				var note = $('#note').val();
				if ($('#isbn').val() == "")
					isbn = "none";
				if ($('#note').val() == "")
					note = "none";
				firebase.auth().onAuthStateChanged(function(user) {
				if (user) {
					// User is signed in.
					createTextbookPosting($('#schoolOptions').val(), $('#courseOptions').val(), user.displayName, $('#title').val(), $('#author').val(), $('#price').val(), isbn, note);
					$('#postSuccessMsg').html('<b>Post successfully created! </b>');
					//reset Create Posting form fields
					document.getElementById("schoolOptions").value = "-select-";
					document.getElementById("courseOptions").value = "-select-";
					document.getElementById("title").value = "";
					document.getElementById("author").value = "";
					document.getElementById("isbn").value = "";
					document.getElementById("price").value = "";
					document.getElementById("isbn").value = "";
					document.getElementById("note").value = "";
				 } else {
					// No user is signed in.
					('#postSuccessMsg').html('<b>Post unssuccessful</b>');
					console.log('else');
				}
				});
				$('#postSuccessMsg').html('<b>Post successfully created! </b>');
			}
		}
	});
	
	/**Textbook Postings search button*/
	$("#searchPostings").click(function() {
		if ($('#courseOptions').val() == null && $('#schoolOptions').val() == null)
			alert('Please select a school and a course.');
		else if ($('#courseOptions').val() == null)
			alert('Please select a course.');
		else if ($('#schoolOptions').val() == null)
			alert('Please select a school.');
		else{
			var currentCourse = $('#courseOptions').val();
			var currentSchool = $('#schoolOptions').val();
			printPostingToTable(currentCourse, currentSchool);
			history.pushState([currentSchool, currentCourse], "Result", "");	//add to history stack
			console.log("PUSHED This is course: "+ [currentSchool, currentCourse]);
		}
	});
	
	/**handle back and forward activities*/
	window.addEventListener('popstate', function(e) {
		//use history stack states
		document.getElementById("schoolOptions").value = (e.state)[0];
		updateCourseOptions((e.state)[0]);
		document.getElementById("courseOptions").value = (e.state)[1];
		printPostingToTable((e.state)[1], (e.state)[0]);
		console.log("In POP This is e: "+e.state);
	});
});
