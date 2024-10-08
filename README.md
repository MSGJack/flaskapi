Babylon 5 station image is from https://www.deviantart.com/iardacil/art/Babylon-5-598234678

Purpose Backend

Users can make their own mobile suits, mechs, ships or stations. I plan on combing this and the python mini battle simulator together so people can fight with other user's creations.
Wanted to get more experience with Flask and python. Was my first time making any sort of project with them. Intent was to make a CRUD app that wasn't a basic todo list. Thought basing it around something I enjoy would make it mean more. Authorization and Authentication, done with JWT, was added later on so only the creator could interact with whatever they made. Database used was sqlalchemy, might use postgresql for future projects. No validation for incoming data this time(main focus was getting app to work with main features), but will include it in upcoming projects. 

Improvements

Better organization and structure instead of having everything in one big file. Add validation and use a different method of Authentication like Passport. Maybe implent stripe for purchasing. Having a like  system and comment feature is something I definitely want added.

FrontEnd

For frontend, I wanted to use different technologies that I used for the e-commerence I've made. This time, axios was used for fetching data with react bulma components being the main css framwork. I used React Hook Form with Yup for validating data(I tried using them before in the e-comm project, couldn't use them correctly). JWT token is stored in local storage, but will use cookies later on.

Improvements

One of the biggest changes I want to make is making different sized images fit into a card without changing the size of the card or image. Right now, a smaller image makes the card img have a black space and I want to cover that up. Used object-fit property, but that didn't work. With validation, I want it to be specific(liking checking if a number is in user's password, patterns etc...). Also adding some animations when a user decides to check out a card(pop up information, sliding).  
