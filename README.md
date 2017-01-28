# BookRecycle
Overview
Book Recycle is a textbook transaction platform that can be used by students from various universities. The main components of this application are to allow students to post textbooks, search for textbooks, and contact the seller of the desired textbook they have searched for.
Posting textbooks can be done by registering or logging in (if the user already has an account) first. This feature cannot be done by anyone who is not logged in, because information, such as email and phone number, are needed for them to be contacted by anyone who wants to buy the textbook they are selling. After logging in, creating a textbook posting can easily be done by going to the Create Posting tab / Post a Textbook page, filling up the form with School, Course, Textbook Title, Author(s), ISBN (optional), Price in USD, and Seller’s Notes (optional), then hitting the Post your textbook button. This functionality is pretty straightforward for users to understand it easily. We modified some of the required fields while in the process of building the whole application. We decided that the most helpful information about a textbook are the school and course the user would want to post this under, the title of the textbook, the author of the textbook, and how much they are selling it. Other information such as ISBN and Notes are also helpful for specificity and description of a book, but should not be required. Notes is where the seller can share various information such a book review, the book’s physical condition, usefulness, and other description. 
Searching for textbooks can be done by anyone, without the requirement of logging in. This is for users whose main objective is to just search for textbooks and don’t really have any books to sell. Searching for a textbook can be done by navigating to the Find Textbooks tab / Textbook Posting page, filling up the query of the user’s school and desired course, then clicking the Search for Postings button. This will show all postings, in an organized table, for the given school and course combination. If there is no textbook in the database for the given school and course, it will display a message saying that no textbook posting is found. Our decision of allowing any user to search for a textbook without the requirement of logging in is to promote convenience. Some or even majority of the users who would visit our website have the main objective of looking for a textbook for their class. Some users do not plan to post any textbook and if they are required to create an account just to view postings, this would not be convenient for them.
On the results page of searching for a textbook, the user can see the seller’s contact information by clicking on the row of his/her desired posting. After the user submits a school and course combination for searching a textbook, it will show all postings for the specified course. They can then look over the postings. When the user is interested on a posting and is ready to contact the seller, he/she can easily find the seller’s contact information by clicking the textbook posting he/she is interested in. This will show the seller’s name, phone number, and email for the user’s convenience of contacting the seller. When contacting a seller, we decided that phone number and email address are the most reasonable and helpful information about a seller. It is up to the user which method (phone or email) he finds the more convenient way.
There are total of six html files - one per page: home, registration, login, create posting, find posting, visualization. Creating them in separate files is logical for us because each of them take a different functionality.

Textbook transaction platform. SWE-432 Project. 

6 scenarios:
1. Registration/Login/Logout. Users will be able to create an account and login in to post textbooks.
2. Create Postings. Users will be able to post textbooks. Only registered and logged in users can use this feature.
3. Search Postings. Users will be able to search for postings given a school and a course. Any user (no need to be logged in) is allowed to search for textbooks. 
4. Search users. Users will be able to search users' info by username. Any user (no need to be logged in) is allowed to search for other users.
5. Visualization. Visualize the number of avaliable textbooks. Visualize the number of textbooks avaliable under courses in each school using circle packing.
6. Upload of profile picture. Users will be able to upload/change their profile pictures in the home page (index.html)


Senarios implemented:
1. Registration/Login
2. Search Postings (by school name and course)
3. Contact Users / Search Users. 
4. D3 senario: Visualize the number of avaliable textbooks. Using circle packing schema. Reference: http://bl.ocks.org/mbostock/4063530


Heroku app: https://evening-woodland-17308.herokuapp.com/