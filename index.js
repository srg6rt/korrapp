'use strict';

// [START all]
// [START import]
// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
const firebase = require('firebase');
const admin = require('firebase-admin');
//var express = require('express');
const { uuid } = require('uuidv4');


 var serviceAccount = require("./korapp-222-firebase-adminsdk-ku7tk-12a4ec2e80.json");
 admin.initializeApp({
   credential: admin.credential.cert(serviceAccount),
   databaseURL: "https://korapp-222.firebaseio.com"
 });

const firebaseConfig = {
    apiKey: "AIzaSyAE5gq6T3GmUuXMLu4FKkcr8Xyd_66Tz_Y",
    authDomain: "korapp-222.firebaseapp.com",
    databaseURL: "https://korapp-222.firebaseio.com",
    projectId: "korapp-222",
    storageBucket: "korapp-222.appspot.com",
    messagingSenderId: "512764753218",
    appId: "1:512764753218:web:8fb8f17591e38cfb7204db"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  
// // --- START ----- QUERY ELEMENTS IN DATABASE----
 exports.checkUsersEmail = functions.https.onRequest(async (req, res) => {
  let email_result;
  const searchResult = await db.collection('usersDatabase').where('email','==', `${req.query.email}`).get().then((snapshot) => {
  	snapshot.docs.forEach(doc => {	
  		email_result =  doc.data().email;
  	}); 
  	return email_result; // Each then() should return a value or throw Firebase cloud functions
  } );

  res.json({result: `${searchResult}`});
  	});




// // --- START ----- QUERY ELEMENTS IN DATABASE----
 exports.checkEmployerEmail = functions.https.onRequest(async (req, res) => {
  let email_result;
  let password_result;
  const searchResult = await db.collection('employerDatabase').where('email','==', `${req.query.email}`).get().then((snapshot) => {
  	snapshot.docs.forEach(doc => {	
  		//console.log('E-mail ' +  doc.data().email);
  		email_result =  doc.data().email;
      password_result =  doc.data().password;
  	}); 
  	return [email_result,password_result] ; // Each then() should return a value or throw Firebase cloud functions
  } );
  // Send back a message that we've succesfully find email (OPTIONAL)
  //res.json(searchResult[0],searchResult[0]);
  res.json({email: `${searchResult[0]}`, password: `${searchResult[1]}`});
  	});
// // --- END----- QUERY ELEMENTS IN DATABASE----



// // --- START ----- QUERY ELEMENTS IN DATABASE----
 exports.loginEmployer = functions.https.onRequest(async (req, res) => {

  let reqresult;

  const searchResult = await db.collection('employerDatabase').where('email','==', `${req.query.email}`).get().then((snapshot) => {
  	snapshot.docs.forEach(doc => {	
  		//console.log('E-mail ' +  doc.data().email);
  		reqresult =  {email:`${doc.data().email}`,password:`${doc.data().email}`};
  		// SAME AS:
  		//reqresult =  {'email':`${doc.data().email}`,'password':`${doc.data().email}`};
  	}); 
  	return reqresult; // Each then() should return a value or throw Firebase cloud functions
  } );
  // Send back a message that we've succesfully find email (OPTIONAL)
  res.json(searchResult);
  	});
// // --- END----- QUERY ELEMENTS IN DATABASE----


// // --- START ----- QUERY ELEMENTS IN DATABASE----
 exports.getEmployerInfo = functions.https.onRequest(async (req, res) => {

  let reqresult;

  const searchResult = await db.collection('employerDatabase').where('email','==', `${req.query.email}`).get().then((snapshot) => {
    snapshot.docs.forEach(doc => {  
      //console.log('E-mail ' +  doc.data().email);
      reqresult =  {email:`${doc.data().email}`,first_name:`${doc.data().first_name}`,last_name:`${doc.data().last_name}`};
      // SAME AS:
      //reqresult =  {'email':`${doc.data().email}`,'password':`${doc.data().email}`};
    }); 
    return reqresult; // Each then() should return a value or throw Firebase cloud functions
  } );
  // Send back a message that we've succesfully find email (OPTIONAL)
  res.json(searchResult);
    });
// // --- END----- QUERY ELEMENTS IN DATABASE----

//[START addEmployerTrigger]
exports.addEmployer = functions.https.onRequest(async (req, res) => {

//   if(request.method !== "POST"){
//  res.status(400).send('Please send a POST request');
//  return;
// }

// [END addEmployerTrigger]
  // Grab the employer info.
  let employerInfo = {
  	email: req.body.email, 
  	password: req.body.password, 
  	first_name:req.body.first_name,
  	last_name:req.body.last_name,
  	company_name:req.body.company_name,
  	phone_number:req.body.phone_number,
  	business_address:req.body.business_address,
  	reg_number_enterprises:req.body.reg_number_enterprises,
    tokenFromPhone:req.body.tokenFromPhone
  };
  // [START ]
  // Push the new employer into  employerDatabase Cloud Firestore .
  const writeResult = await db.collection('employerDatabase').add(employerInfo);
  // Send back a message that we've succesfully written the employerInfo (OPTIONAL)
  res.json({result: `Employer with ID: ${writeResult.id} added.`});
  // [END ]
});


 
//[START addUsersTrigger]
exports.addUsers = functions.https.onRequest(async (req, res) => {
// [END addUsersTrigger]
  // Grab the users info.
  let userInfo = {
  	email: req.query.email, 
  	password: req.query.password, 
  	first_name:req.query.first_name,
  	last_name:req.query.last_name,
  	social_insurance_number:req.query.social_insurance_number,
  	address:req.query.address,
  	full_name_of_the_parents:req.query.full_name_of_the_parents,
  	parent_phone_number:req.query.parent_phone_number
  	
  };
  // [START ]
  // Push the new userinfo into  usersDatabase Cloud Firestore .
  const writeResult = await db.collection('usersDatabase').add(userInfo);
  // Send back a message that we've succesfully written the userInfo (OPTIONAL)
  res.json({result: `User with ID: ${writeResult.id} added.`});
  // [END ]
});



//[START addUsersTrigger]
exports.sendNotifToNeffos = functions.https.onRequest(async (req, res) => {
  //const firebaseToken = 'cC8IPH3yRi8:APA91bERnqRt8fNaWIDyuUPNcoglBdFwyrFhIwsHspezVT-Yc_aA4a1XAr7RdrcOFeq_jZrBiP33SAaI4Jpr8NbLPCg3PkOPcxrvkmLUOlKvZtP9oiBZyg3gGT3zaWj28OavaKbeZ-Qt';
  
  const options = {
      priority: 'high',
      timeToLive: 60 * 60 * 24, // 1 day
    }; 
    
  let email_result;
  let firebaseToken;
  const writeResult = await db.collection('employerDatabase').where('email','==', `${req.query.email}`).get().then((snapshot) => {
    snapshot.docs.forEach(doc => {  
      //console.log('Password ' +  doc.data().password);
      email_result =  doc.data().email;
      firebaseToken = doc.data().tokenFromPhone;
    let payload = {
      notification: {
        title: 'Atencione!!!',
        body: email_result + ' This is first notification!!',
      }
    };    

      if (email_result) {
        admin.messaging().sendToDevice(firebaseToken, payload, options);
        //console.log('messaging ' +  email_result);
      } 
    }); 
    return email_result; // Each then() should return a value or throw Firebase cloud functions
  } );  
  // Push the new userinfo into  usersDatabase Cloud Firestore .
  // Send back a message that we've succesfully written the userInfo (OPTIONAL)
  res.json({result: `Send message to : ${writeResult}`});
  // [END ]
});

// Sends a notifications to all users when a new message is posted.
exports.sendNotifications = functions.firestore.document('messages/{messageId}').onCreate(
  async (snapshot) => {
    // Notification details.
    const text = snapshot.data().text;
    const payload = {
      notification: {
        title: `${snapshot.data().name} posted ${text ? 'a message' : 'an image'}`,
        body: text ? (text.length <= 100 ? text : text.substring(0, 97) + '...') : '',
        icon: snapshot.data().profilePicUrl || '/images/profile_placeholder.png',
        click_action: `https://${process.env.GCLOUD_PROJECT}.firebaseapp.com`,
      }
    };
    // Get the list of device tokens.
    let firebaseToken;
    const tokens = [];
    const allTokens = await admin.firestore().collection('employerDatabase').get().then((snapshot) => {

      snapshot.docs.forEach(doc => {  
      //console.log('Password ' +  doc.data().password);
      firebaseToken = doc.data().tokenFromPhone;
      //console.log(firebaseToken);

      if (firebaseToken) {
        tokens.push(firebaseToken);
      }
        }); 
      return tokens;
    });
 
    if (tokens.length > 0) {
      // Send notifications to all tokens.
      const response = await admin.messaging().sendToDevice(tokens, payload);
      await cleanupTokens(response, tokens);
      console.log('Notifications have been sent and tokens cleaned up.');
    }
  });

// Cleans up the tokens that are no longer valid.
function cleanupTokens(response, tokens) {
  // For each notification we check if there was an error.
  const tokensDelete = [];
  response.results.forEach((result, index) => {
    const error = result.error;
    if (error) {
      console.error('Failure sending notification to', tokens[index], error);
      // Cleanup the tokens who are not registered anymore.
      if (error.code === 'messaging/invalid-registration-token' ||
          error.code === 'messaging/registration-token-not-registered') {
        const deleteTask = admin.firestore().collection('fcmTokens').doc(tokens[index]).delete();
        tokensDelete.push(deleteTask);
      }
    }
  });
  return Promise.all(tokensDelete); 
}

//[START addUsersTrigger]
exports.messages = functions.https.onRequest(async (req, res) => {
// [END addUsersTrigger]
  // Grab the users info.
  let messageInfo = {
    name: req.body.name, 
    text: req.body.text, 
  };
  // [START ]
  // Push the new userinfo into  usersDatabase Cloud Firestore .
  const writeResult = await db.collection('messages').add(messageInfo);
  // Send back a message that we've succesfully written the userInfo (OPTIONAL)
  res.json({result: `Message: ${writeResult.id} added.`});
  // [END ]
});





// // // --- START ----- QUERY ELEMENTS IN DATABASE----
//  exports.loginAuthFire = functions.https.onRequest(async (req, res) => {

//   // auth.signInWithEmailAndPassword(email, pass);

//   //auth.createUserWithEmailAndPassword(email, pass);

//   // auth.onAuthStateChanged(firebaseUser => { } );

//   const promise = auth.signInWithEmailAndPassword(email, pass).then((snapshot) => {

//     reqresult =  {email:`${doc.data().email}`,password:`${doc.data().email}`}; 


//     return reqresult; // Each then() should return a value or throw Firebase cloud functions
//   } );

//   promise.catch => console.log(e.message);

//   res.json(promise.catch);


exports.createLoginAndUsersAuthFire = functions.https.onRequest((req, res) => {
  const auth = firebase.auth();
  let email;
  let pass;

  email = req.query.email;
  pass  = req.query.pass;

  auth.createUserWithEmailAndPassword(email, pass);

   res.json('User created');

});



// exports.loginAuthFire = functions.https.onRequest((req, res) => {
//  // const auth = firebase.auth();
//   let email;
//   let result;

//   email = req.query.email;
  
 // const promise = auth.signInWithEmailAndPassword(email, pass);
//  firebase.auth().onAuthStateChanged(function(email) {
//     if (email) {
//       console.log(email);
//       result = email;
//     } else {
//       console.log('not logged in ^__^');
//       result = 'not logged in ^__^';
//       }
//   });

//  res.json(result);
// });


//[START addEmployerTrigger]
exports.addUserToCafe = functions.https.onRequest(async (req, res) => {
  let data = {
    uid:req.query.uid,
    first_name:req.query.first_name,
    last_name:req.query.last_name,
};
const writeResult = await db.collection('usersFromCafeDetailedInfo').doc(data.uid).set(data);
  // Send back a message that we've succesfully written the employerInfo (OPTIONAL)
  res.json({result: `User with ID: ${writeResult} added.`});
  // [END ]
});



//[START addEmployerAuto]

exports.addEmployerAuto = functions.https.onRequest(async (req, res) => {
  
    let userExtendInfo = {j:req.body.j}; // create REST example: https://https://us.cloudfunctions.net/addEmployerAuto?j={"first_name":"Serg","last_name":"Sergio"}
 // ATENCIONE!! 
 //  j:req.body.j  - for POST
 //  j:req.query.j - for GET
  // Push the new employer into  employerDatabase Cloud Firestore .
  const writeResult = await db.collection('employerDatabase').add(JSON.parse(userExtendInfo.j)); // remove first and last charachter for view "name":""
  // Send back a message that we've succesfully written the User (OPTIONAL)
  res.json('User added');

});


//ATENCIONE!!! When put string to URL, ENCODE forbidden character like +-/*^%$ to %24%25%26%24
exports.uploadImageInBase64toStorage = functions.https.onRequest(async (req, res) => {
    const { uuid } = require('uuidv4');
   // Convert the base64 string back to an image to upload into the Google Cloud Storage bucket
    var base64EncodedImageString = req.body.Thumbnail64, // может принимать только символы URL %2F%2D%2B вместо "+/-#$"
        fileName = req.body.ImgFileName,  // or makeid(15)+'.jpg',
        mimeType = 'image/jpeg',
         

        imageBuffer = new Buffer(decodeURIComponent(base64EncodedImageString), 'base64');
                                // decodeURIComponent - нужен для декодирования символов URL %2F%2D%2B...
   // console.log(  ' base64EncodedImageString -'+base64EncodedImageString);

    var bucket = admin.storage().bucket(firebaseConfig.storageBucket);

    // Upload the image to the bucket
    var file1 = bucket.file('profile-images/' + fileName);
    //console.log(  '---decodeURI(base64EncodedImageString)  '+ decodeURIComponent(base64EncodedImageString));
     console.log(  '---fileName  '+ fileName);
    file1.save(imageBuffer, {
        metadata: { contentType: mimeType ,  metadata: {
            firebaseStorageDownloadTokens: uuid()
          } },
    }, 
    ((error) => {

        if (error) {
            return res.status(500).send('Unable to upload the image.');
        }
            
      
            return res.status(200).send('Uploaded');
    }));
});

function makeid(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}
  


 

// // --- START ----- QUERY ELEMENTS IN DATABASE----
 exports.getMenuInfo = functions.https.onRequest(async (req, res) => {

    let reqresult = {}, rowsFromDB = [];

  const menuInfoResult = await db.collection('CafeMenu').get().then((snapshot) => {
    snapshot.docs.forEach(doc => { 
    // reqresult.id = id;
    // reqresult.quantity = quantity;
      reqresult =  {dish_name:`${doc.data().dish_name}`,
                    dish_photo:`${doc.data().dish_photo}`,
                    dish_price:`${doc.data().dish_price}`,
                    dish_weight:`${doc.data().dish_weight}`};
      rowsFromDB.push(reqresult);
    //  console.log(reqresult) 
      // SAME AS:
      //reqresult =  {'email':`${doc.data().email}`,'password':`${doc.data().email}`};
    }); 
    reqresult = Object.assign({}, rowsFromDB); // Convert ['a','b','c'] to {0:"a", 1:"b", 2:"c"}

    return reqresult; // Each then() should return a value or throw Firebase cloud functions
    // slice need for remove first character [ and last character ] in result [{"key":"value"}, {"key":"value"}]

  } );
  // Send back a message that we've succesfully find email (OPTIONAL)
  res.json(menuInfoResult);
     
    });
// // --- END----- QUERY ELEMENTS IN DATABASE----
 



// // --- START ----- QUERY ELEMENTS IN DATABASE----
//  exports.getMenuInfo = functions.https.onRequest(async (req, res) => {
// var photo_url, tt; 
// let cafeMenu = db.collection('CafeMenu');
// const allCafeMenu = await cafeMenu.get().then(snapshot => {
//     snapshot.forEach(doc => {

//       //console.log(doc.id, '=>', doc.data());

//       photo_url =  doc.data().dish_photo;
   
//       //imageBuffer = new Buffer(decodeURIComponent(photo_url), 'hex'),
//       // imageBufferEncoder = new Buffer(encodeURIComponent(imageBuffer.toString('base64')), 'utf8');
   
//       var 
//       request         = require('request').defaults({ encoding: null });
//     request.get(photo_url, (error, response, body) => {
         
//                       var  data = new Buffer(body).toString('base64');
//                             //  console.log('data ->', data);
//                             //  console.log('dataencodeURI ->', encodeURIComponent(data));
//                           tt = encodeURIComponent(data);
//                         });
//     console.log('tt ->', tt); 
//     });

    
//    return encodeURIComponent(tt);
//   })

//   .catch(err => {
//     console.log('Error getting documents', err);
//   });
 

//   res.json({photo_url: `${allCafeMenu}`});
//     });
// // --- END----- QUERY ELEMENTS IN DATABASE----












   // let userExtendInfo = {imgBase64:req.query.imgBase64}; // create REST example: https://https://us.cloudfunctions.net/addEmployerAuto?j={"first_name":"Serg","last_name":"Sergio"}
 // Base64 formatted string
//var message = '5b6p5Y+344GX44G+44GX44Gf77yB44GK44KB44Gn44Go44GG77yB';
//ref.putString(message, 'base64').then(function(snapshot) {
 // console.log('userExtendInfo   '+ userExtendInfo);
  //console.log('JSON.parse   '+ JSON.parse(userExtendInfo));
//});

 // const writeResult = await JSON.parse(userExtendInfo); // remove first and last charachter for view "name":""
  // Send back a message that we've succesfully written the User (OPTIONAL)








// // This registration token comes from the client FCM SDKs.
// var registrationToken = 'cC8IPH3yRi8:APA91bERnqRt8fNaWIDyuUPNcoglBdFwyrFhIwsHspezVT-Yc_aA4a1XAr7RdrcOFeq_jZrBiP33SAaI4Jpr8NbLPCg3PkOPcxrvkmLUOlKvZtP9oiBZyg3gGT3zaWj28OavaKbeZ-Qt';

// var message = {
//   data: {
//     title: 'Helllo',
//     body: 'This is message',
//     score: '850',
//     time: '2:45'
//   },
//   token: registrationToken
// };

// // Send a message to the device corresponding to the provided
// // registration token.
// admin.messaging().send(message)
//   .then((response) => {
//     // Response is a message ID string.
//     console.log('Successfully sent message:', response);
//   })
//   .catch((error) => {
//     console.log('Error sending message:', error);
//   });


// // EXAMPLE: https://us-central1-korapp-222.cloudfunctions.net/addMessage?email=Artur@gmail.com&password=somepass
 

// --- START DELTE ID IN DATABASE----

 //db.collection('usersDatabase').doc('5uzbgmN9veyH0y8k5nJD').delete();


// --- END DELTE ID IN DATABASE----


//--START----GET ELEMENTS FROM DATABASE------
  // db.collection('usersDatabase').get().then((snapshot) => {
  // 	snapshot.docs.forEach(doc => {	

  // 		console.log('E-mail ' +  doc.data().email);
  // 		console.log('Password ' +  doc.data().password);
  // 		//console.log(doc.data())
  // 	})//console.log(snapshot.docs);
  // })
//--END----GET ELEMENTS FROM DATABASE------




//COMMANDS FOR CMD
// firebase login
// firebase deploy -only functions:uploadImageInBase64toStorage

// // EXAMPLE: https://us-central1-korapp-222.cloudfunctions.net/addMessage?email=Artur@gmail.com&password=somepass
 


