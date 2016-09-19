$( document ).ready(function() {
	window.history;
	var textbookIDctr = 0;
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
	
	var usersMap = new Map();
	usersMap.set("mbauzon", new User("Josh", "Bauzon", "George Mason University", "mbauzon@gmu.edu", "123456789", "mbauzon", "joshpassword"));
	usersMap.set("xfang5", new User("Xiaowen", "Fang", "George Mason University", "xfang5@gmu.edu", "111111111", "xfang5", "xiaowenpassword"));
	usersMap.set("jmuStudent", new User("Michael", "Smith", "James Madison University", "jmuStudent@gmu.edu", "5555555555", "jmuStudent", "jmustudentpassword"));
	usersMap.set("uvaStudent", new User("William", "Johnson", "University of Virginia", "uvaStudent@gmu.edu", "6666666666", "uvaStudent", "uvastudentpassword"));
	
	
	var textbook1Josh = new Textbook("CS332", "PROGRAM DEVELOPMENT IN JAVA", "Liskov", "", 30, "new sealed");
	var textbook2Josh = new Textbook("CS332", "EFFECTIVE JAVA:PROGRAMMING LANG.GDE.", "Bloch", "", 40, "used but good condition");
	var textbook1Xiaowen = new Textbook("CS332", "PROGRAM DEVELOPMENT IN JAVA", "Liskov", "", 25, "partly used");
	var textbook3Josh = new Textbook("CS211", "GMU texbook for CS211", "Thomas LaToza", "", 45, "semi-new");
	var textbook1jmuStudent = new Textbook("CS211", "JMU texbook for CS211", "Thomas LaToza", "", 50, "brand new");
	var textbook1uvaStudent = new Textbook("CS211", "UVA texbook for CS211", "Thomas LaToza", "", 35, "used");
	
	var gmuTextbookSet = new Set();
	gmuTextbookSet.add("CS332");
	gmuTextbookSet.add("CS211");
	var textbooksSchoolMap = new Map();
	textbooksSchoolMap.set("George Mason University", gmuTextbookSet);
	
	var jmuTextbookSet = new Set();
	jmuTextbookSet.add("CS211");
	var textbooksSchoolMap = new Map();
	textbooksSchoolMap.set("James Madizon University", jmuTextbookSet);
	var uvaTextbookSet = new Set();
	uvaTextbookSet.add("CS211");
	var textbooksSchoolMap = new Map();
	textbooksSchoolMap.set("James Madizon University", uvaTextbookSet);
	
	var textbooksCourseMap = new Map();
	textbooksCourseMap.set("CS332", [textbook1Josh, textbook2Josh, textbook1Xiaowen]);
	textbooksCourseMap.set("CS211", [textbook3Josh, textbook1jmuStudent, textbook1uvaStudent]);
	
	var textbookUserMapping = new Map();
	textbookUserMapping.set(textbook1Josh.ID, "mbauzon");
	textbookUserMapping.set(textbook2Josh.ID, "mbauzon");
	textbookUserMapping.set(textbook1Xiaowen.ID, "xfang5");
	textbookUserMapping.set(textbook3Josh.ID, "mbauzon");
	textbookUserMapping.set(textbook1jmuStudent.ID, "jmuStudent");
	textbookUserMapping.set(textbook1uvaStudent.ID, "uvaStudent");
	
	function printPostingToTable(courseID, school) {
		if (textbooksSchoolMap.get(school)!=null && (textbooksSchoolMap.get(school)).has(courseID))//textbooksCourseMap.get(courseID) != null)
			$('#postingsAppear').html('<b>Postings for ' + courseID + ' by ' + school + ' students:</b>');
		else
			$('#postingsAppear').html('<b>Sorry, there are currently no postings for ' + courseID + ' by ' + school + ' students.</b>');
							
		var table = document.getElementById("searchResultTable");
		$('#searchResultTable td').remove(); 	//reset table
		//$('#debugthis').html('1stdebugwhat: '+ $('#courseOptions').val());
		console.log('in printPostingToTable with course '+courseID);
		var booksArray = textbooksCourseMap.get(courseID);
		if (booksArray!=null)
			for (var book of booksArray){
				var usernameOfThis = textbookUserMapping.get(book.ID);
				if ((usersMap.get(usernameOfThis)).school == school){
					var row = table.insertRow(table.rows.length);	//add row at the bottom
					var course = row.insertCell(0);
					var textbookTitle = row.insertCell(1);
					var author = row.insertCell(2);
					var seller = row.insertCell(3);
					var email = row.insertCell(4);
					var phone = row.insertCell(5);
					var notes = row.insertCell(6);
					var price = row.insertCell(7);
				
					course.innerHTML = courseID;
					textbookTitle.innerHTML = book.title;
					author.innerHTML = book.author;
					
					//$('#debugthis').html('debugwhat: '+ $('#courseOptions').val());
					//$('#debugthis').html('debugwhat: '+ book.ID + '====' + usernameOfThis);
					
					//var userOfThis = usersMap.get("\""+usernameOfThis+"\"");
					//$('#debugthis').html('debugwhat: '+ book.ID + '====' + usernameOfThis + '====' + (usersMap.get(usernameOfThis)).fullName());
					
					seller.innerHTML = (usersMap.get(usernameOfThis)).fullName();
					email.innerHTML = (usersMap.get(usernameOfThis)).email;
					phone.innerHTML = (usersMap.get(usernameOfThis)).phone;
					notes.innerHTML = book.notes;
					price.innerHTML = book.price;
				}
			}
		
	}
	
					$("#createAccount").click(function() {
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
							$('#welcomeMsg').html('Welcome ' + $('#firstname').val() + ' ' + $('#lastname').val());
							var newUser = new User($('#firstname').val(), $('#lastname').val(), $('#school').val(), $('#email').val(), $('#phone').val(), $('#username').val(), $('#pass').val() );
							$('#welcomeMsg').html('Welcome ' + newUser.fullName() + ' succeed 123');
							//$('#welcomeMsg').html('Welcome ' + newUser.fullName() + ' succeed 123::: ' + (usersMap.get("mbauzon")).fullName());
							usersMap.set($('#username').val(), new User($('#firstname').val(), $('#lastname').val(), $('#school').val(), $('#email').val(), $('#phone').val(), $('#username').val(), $('#pass').val()));
							//line above currently does not work
							$('#welcomeMsg').html('Welcome ' + newUser.fullName() + ' succeed');
							
						}
					});
					$("#login").click(function() {
						if ($('#username').val()== '' && $('#pass').val()== '')
							alert('Please enter Username and Password');
						else if ($('#username').val()=='')
							alert('Please enter Username');
						else if ($('#pass').val()=='')
							alert('Please enter Password');
						else if (usersMap.get($('#username').val()) != null){
							if ((usersMap.get($('#username').val())).pass === $('#pass').val())		//SUCCEESS login
								$('#welcomeMsgInLogin').html('<b>Welcome ' + (usersMap.get($('#username').val())).fullName() + '!</b>');
							else
								alert('Username/Password did not match!');	//wrong password
						}
						else{
							alert('Username is not found! Try again or Create an Account!');	//username not in our database
							document.getElementById("username").value = "";
							document.getElementById("pass").value = "";
						}
					});
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
							history.pushState([currentSchool, currentCourse], "Result", "results.html");
							console.log("PUSHED This is course: "+ [currentSchool, currentCourse]);
							/*var table = document.getElementById("searchResultTable");
							$('#debugthis').html('debug: ' + $('#courseOptions').val());
							
							var row = table.insertRow(1);
							var textbookTitle = row.insertCell(0);
							var author = row.insertCell(1);
							var seller = row.insertCell(2);
							var email = row.insertCell(3);
							var phone = row.insertCell(4);
							var notes = row.insertCell(5);
							textbookTitle.innerHTML = "ti";
							author.innerHTML = "myauthor";
							seller.innerHTML = "myfirst";
							email.innerHTML = "email ko";
							phone.innerHTML = "1234567";
							notes.innerHTML = "wasak wasak";*/
						}
					});
					window.addEventListener('popstate', function(e) {
						document.getElementById("schoolOptions").value = (e.state)[0];
						document.getElementById("courseOptions").value = (e.state)[1];
					  printPostingToTable((e.state)[1], (e.state)[0]);
					  console.log("In POP This is e: "+e.state);
					});
					
					
});