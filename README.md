###### How to Run
1) Clone and navigate to the Repo
2) Run command node server.js (Need to have node.js installed)
3) Following are the APIs :

    a) http://localhost:8080/contact/ - POST Request

          Body (JSON) : {
                		"name": "siddharth",
                		"email": "sid@example.com",
                		"phone": "12345678990"
                	}

    b) http://localhost:8080/contact/:contactName - GET Request
        example : http://localhost:8080/contact/siddharth

    c) http://localhost:8080/contactByEmail/:contactEmailID - GET Request
        example : http://localhost:8080/contactByEmail/sid@example.command

    d) http://localhost:8080/contact/?pageSize={resultsPerPage}&page={pageNo}&query={contactEmailID} - GET Request
        example : http://localhost:8080/contact/?pageSize=10&page=1&query=su9228@example.com

    e) http://localhost:8080/contact/:contactName - PUT Request
       example : http://localhost:8080/contact/siddharth

       Body (JSON) : {
                      "oldname": "siddharth",
                      "newname": "sid"
                      }
#### Some Points
1) elasticsearch index is plivotest
2) Use Authenication in Headers with value Basic Og== (Basic Og== is postman's encoding of 1234)
3) For testing mocha is enabled which looks for test.js file in the codebase, test.js has all the unit tests. In order to test run npm test from the code directory
