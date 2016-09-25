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
	//Textbook constructor
	function Textbook(course, title, author, isbn, price, notes){
		this.courseID = course;
		this.title = title;
		this.author = author;
		this.isbn = isbn;
		this.price = price;
		this.notes = notes;
		textbookIDctr++;
		this.ID = textbookIDctr;
	}
	
	var gmuCourses = ["CS100", "CS101", "CS105", "CS112", "CS211", "CS222", "CS262", "CS306", "CS310", "CS321", "CS330", "CS332", "CS367", "CS390", "CS425", "CS450", "CS451", "CS465", "CS469", "CS471", "CS477", "CS480", "CS482", "CS483", "CS484", "CS485", "CS490", "SWE205", "SWE432", "SWE437", "SWE443"];
	var jmuCourses = ["CS112", "CS211", "CS222", "CS262", "SWE432"];
	var uvaCourses = ["CS1010", "CS1110", "CS1111", "CS1112", "CS1113", "CS2102", "CS2110", "CS2150", "CS2910", "CS3102", "CS3205", "CS3240", "CS3330", "CS4102", "CS4414", "CS4457", "CS4457", "CS4501", "CS4630", "CS4710", "CS4720", "CS4740", "CS4750", "CS4753", "CS4810", "CS4970", "CS4980", "CS4993", "CS4998"];
	//map school name to courses provided by the school
	var schoolCourseMap = new Map();
	schoolCourseMap.set("GMU", gmuCourses);
	schoolCourseMap.set("JMU", jmuCourses);
	schoolCourseMap.set("UVA", uvaCourses);
	//map username to user info
	var usersMap = new Map();
	usersMap.set("mbauzon", new User("Josh", "Bauzon", "GMU", "mbauzon@gmu.edu", "123456789", "mbauzon", "joshpassword"));
	usersMap.set("xfang5", new User("Xiaowen", "Fang", "GMU", "xfang5@gmu.edu", "111111111", "xfang5", "xiaowenpassword"));
	usersMap.set("jmuStudent", new User("Michael", "Smith", "JMU", "jmuStudent@jmu.edu", "5555555555", "jmuStudent", "jmustudentpassword"));
	usersMap.set("uvaStudent", new User("William", "Johnson", "UVA", "uvaStudent@uva.edu", "6666666666", "uvaStudent", "uvastudentpassword"));
	//info of the textbook owned by the user
	var textbook1Josh = new Textbook("CS332", "PROGRAM DEVELOPMENT IN JAVA", "Liskov", "", 30, "new sealed");
	var textbook2Josh = new Textbook("CS332", "EFFECTIVE JAVA:PROGRAMMING LANG.GDE.", "Bloch", "", 40, "used but good condition");
	var textbook1Xiaowen = new Textbook("CS332", "PROGRAM DEVELOPMENT IN JAVA", "Liskov", "", 25, "partly used");
	var textbook3Josh = new Textbook("CS211", "GMU texbook for CS211", "Thomas LaToza", "", 45, "semi-new");
	var textbook1jmuStudent = new Textbook("CS211", "JMU texbook for CS211", "Thomas LaToza", "", 50, "brand new");
	var textbook1uvaStudent = new Textbook("CS211", "UVA texbook for CS211", "Thomas LaToza", "", 35, "used");
	//map school name to textbooks avaliable in that school
	var gmuTextbookSet = new Set();
	gmuTextbookSet.add("CS332");
	gmuTextbookSet.add("CS211");
	var textbooksSchoolMap = new Map();
	textbooksSchoolMap.set("GMU", gmuTextbookSet);
	
	var jmuTextbookSet = new Set();
	jmuTextbookSet.add("CS211");
	textbooksSchoolMap.set("JMU", jmuTextbookSet);
	var uvaTextbookSet = new Set();
	uvaTextbookSet.add("CS2110");
	textbooksSchoolMap.set("UVA", uvaTextbookSet);
	//map course id to textbooks required by the course
	var textbooksCourseMap = new Map();
	textbooksCourseMap.set("CS332", [textbook1Josh, textbook2Josh, textbook1Xiaowen]);
	textbooksCourseMap.set("CS211", [textbook3Josh, textbook1jmuStudent]);//, textbook1uvaStudent]);
	textbooksCourseMap.set("CS2110", [textbook1uvaStudent]);
	//map textbook id to user name
	var textbookUserMapping = new Map();
	textbookUserMapping.set(textbook1Josh.ID, "mbauzon");
	textbookUserMapping.set(textbook2Josh.ID, "mbauzon");
	textbookUserMapping.set(textbook1Xiaowen.ID, "xfang5");
	textbookUserMapping.set(textbook3Josh.ID, "mbauzon");
	textbookUserMapping.set(textbook1jmuStudent.ID, "jmuStudent");
	textbookUserMapping.set(textbook1uvaStudent.ID, "uvaStudent");
	
	/**prints table of postings based on courseID and school */
	function printPostingToTable(courseID, school) {
		var table = document.getElementById("searchResultTable");
		$('#searchResultTable td').remove(); 	//reset table
		
		$('#postingsAppear').html('<b>Sorry, there are currently no postings for ' + courseID + ' by ' + school + ' students.</b>');
		
		console.log('in print posting');
		var ref = new Firebase("https://bookrecycle-5b8d1.firebaseio.com/school/" + school + "/" + courseID);
		ref.once("value", function(snapshot) {			//firebase.database().ref("school/" + school + "/" + courseID).once("value").then(function(snapshot) {
		  	//go through each seller of this school, course search combination
			snapshot.forEach(function(childSnapshot) {
				$('#postingsAppear').html('<b>Textbook postings for ' + courseID + ' at ' + school + ' are the following: ');
				
				console.log('current seller: '+ childSnapshot.key());
				var seller = childSnapshot.key();
				
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
				firebase.database().ref("school/" + school + "/" + courseID + "/" + seller + "/title").once('value').then(function(snapshot) {
					textbookTitle.innerHTML = snapshot.val();
				});
				firebase.database().ref("school/" + school + "/" + courseID + "/" + seller + "/isbn").once('value').then(function(snapshot) {
					isbn.innerHTML = snapshot.val();
				});
				firebase.database().ref("school/" + school + "/" + courseID + "/" + seller + "/author").once('value').then(function(snapshot) {
					author.innerHTML = snapshot.val();
				});
				//firebase.database().ref("users/" + seller +"/email").once('value').then(function(snapshot) {
				//	email.innerHTML = snapshot.val();
				//})
				sellerCell.innerHTML = seller;
				firebase.database().ref("users/" + seller +"/email").once('value').then(function(snapshot) {
					email.innerHTML = snapshot.val();
				});
				firebase.database().ref("users/" + seller +"/phone").once('value').then(function(snapshot) {
					phone.innerHTML = snapshot.val();
				});
				firebase.database().ref("school/" + school + "/" + courseID + "/" + seller + "/note").once('value').then(function(snapshot) {
					notes.innerHTML = snapshot.val();
				});
				firebase.database().ref("school/" + school + "/" + courseID + "/" + seller + "/price").once('value').then(function(snapshot) {
					price.innerHTML = snapshot.val();
				});
			});
		  
		});
		
		/*
		//check if courseID and school are in our maps
		console.log('in printPostingToTable School: ' + school + ' course ' + courseID );
		var table = document.getElementById("searchResultTable");
		$('#searchResultTable td').remove(); 	//reset table
		
		if (textbooksSchoolMap.get(school)!=null && (textbooksSchoolMap.get(school)).has(courseID))//textbooksCourseMap.get(courseID) != null)
			$('#postingsAppear').html('<b>Postings for ' + courseID + ' by ' + school + ' students:</b>');
		else
			$('#postingsAppear').html('<b>Sorry, there are currently no postings for ' + courseID + ' by ' + school + ' students.</b>');
							
		var booksArray = textbooksCourseMap.get(courseID);
		if (booksArray!=null)
			for (var book of booksArray){
				var usernameOfThis = textbookUserMapping.get(book.ID);
				if ((usersMap.get(usernameOfThis)).school == school){
					console.log('in if');
					var row = table.insertRow(table.rows.length);	//add row at the bottom
					var course = row.insertCell(0);
					var textbookTitle = row.insertCell(1);
					var author = row.insertCell(2);
					var seller = row.insertCell(3);
					var email = row.insertCell(4);
					var phone = row.insertCell(5);
					var notes = row.insertCell(6);
					var price = row.insertCell(7);
					
					//set the values in the cells
					course.innerHTML = courseID;
					textbookTitle.innerHTML = book.title;
					author.innerHTML = book.author;
					seller.innerHTML = (usersMap.get(usernameOfThis)).fullName();
					email.innerHTML = (usersMap.get(usernameOfThis)).email;
					phone.innerHTML = (usersMap.get(usernameOfThis)).phone;
					notes.innerHTML = book.notes;
					price.innerHTML = book.price;
				}
			}*/
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
			//var newUser = new User($('#firstname').val(), $('#lastname').val(), $('#school').val(), $('#email').val(), $('#phone').val(), $('#username').val(), $('#pass').val() );
			//usersMap.set($('#username').val(), new User($('#firstname').val(), $('#lastname').val(), $('#school').val(), $('#email').val(), $('#phone').val(), $('#username').val(), $('#pass').val()));
			//line above currently does not work

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
		/*else if (usersMap.get($('#username').val()) != null){
			if ((usersMap.get($('#username').val())).pass === $('#pass').val())		//SUCCEESS login
				$('#welcomeMsgInLogin').html('<b>Welcome ' + (usersMap.get($('#username').val())).fullName() + '!</b>');
			else
				alert('Username/Password did not match!');	//wrong password
		}
		else{
			alert('Username is not found! Try again or Create an Account!');	//username not in our database
			//reset data input fields
			document.getElementById("username").value = "";
			document.getElementById("pass").value = "";
		}*/
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
		firebase.database().ref('school/' + school + '/' + course + '/' + userID).set({
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
