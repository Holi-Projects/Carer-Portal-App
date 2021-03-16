This project demo is available at https://dev.goalmaker.com.au:1103/#/login.

## Available Test Data
Email: mike.nichol@test.com.au or spotshotz@test.com.au
Password: password


## Project File Structure
### Top Level
- .gitignore (where files excluded from the git repository are defined)

- devextreme.json

- package.json (where the overall configuration for the application is defined)

- package-lock.json

- README.md (contains an overview and an installation guide for the application)

- yarn.lock

**Folders**

- **/.vscode** (stores settings for prettier things vscode extention)

- **/node_modules** (Contains a list of all dependencies required by the application)

- **/public**   
     * Web root entry point of the application. Contains index.html, which contains the <div> “root”, that is used by React to render the application (from /src/index.js)

     * index.html is also used to customize the title of the index page and the favicon

- **/src** (contains all project files)

### /src Files

- App.js

- app-info.js (where the application title is defined)

- app-navigation.js (where the sidebar menu items are defined)

- app-routes.js (where the path and component of each application route are defined)

- App.test.js

- Content.js

- dx-styles.scss

- index.css (where the global application styling is defined)

- index.js

- NotAuthenticatedContent.js (used to control the rendering of \<LoginForm\>, \<CreateAccountForm\>, \<ResetPasswordForm\> and \<ChangePasswordForm\>)

- polyfills.js

- serviceWorker.js

- setupTests.js

**Folders**

- **/api**

- **/components**

- **/contexts**

- **/layouts**

- **/pages**

- **/themes**

- **/utils**

### /src/api Files

**Folders**

Contains components that interact with the API

- **auth-header.js**

     * Gets the stored token required to authenticate users 

- **deleteData.js**

     * Query the API and execute the DELETE method in request.  

- **deleteDataBlock.js**

- **fetchFile.js**

     * Query the server and executes a GET request method for a file system 

- **fetchData.js**

     * Execute the GET request method of an API 

- **insertData.js**

     * Executes the POST request method of an API 

- **updateData.js**

     * Executes the PUT request method of an API


### /src/components Files

- index.js

**Folders**

Contains reusable React components used to assemble the pages of the application

- **availability**

    * **AvailabilityList.js**: DX \<Scheduler\> component to display and update a Carer’s availability for the week. Uses the Carer API (/api/carer/{carerId}/availability) and Reference API (/api/ref/weekday)

- **booking**

    * Bookings > All Bookings page

       * **BookingDetails.js**: DX \<Popup\> component to display details of a Carer’s booking. Uses the Booking API (/api/booking/{id})

       * **Calendar.js**: DX \<Scheduler\> component to display all of a Carer’s bookings. Uses the Booking API (/api/booking)

       * **filters.js**: defines the dropdown menu items used to filter a Carer’s bookings by status

    * Bookings > Unconfimed Shifts page

       * **UnconfirmedList.js**: DX \<DataGrid\> component to display all of a Carer’s unconfirmed shifts. Uses the Booking API (/api/booking)

- **change-password-form** 

    * **change-password-form.js**: DX \<Form\> component to allow carers to change their current password by validating the current password against the database and checking that the new password meets predefined conditions of the system. Uses the General API (/api/auth/change-password) 

- **contact**

   * **ContactHistory.js**: DX \<DataGrid\> component to display a Carer’s communication log with the carer manager. Uses the Contact History API (/api/contact-history)
    
    
- **create-account-form**

- **footer**

- **header**

- **login-form**

    * **login-form.js**: DX <Form> component that allows active carers to log in into the system. Interacts with the logIn function from '../../contexts/auth'.

- **profile**

    * **viewSkills**

      * **viewSkills.js**: DX \<DataGrid\> component that displays carers skills in a list with the added functionality of allowing carers to attached documents to their skills, using a DX \<Popup\> component to manage files for each skill. Interacts with fetchData.js, fetchFile.js, updateData.js and deleteData.js. The component is called in /src/pages/profile/profile.js. Uses the Carer API (/api/carer/{carerId}/skill)

    * **addSkill**

      * **addSkill.js**: HTML form customized with DX components to enable carers to add new skills to their skill list. . Uses the Carer API (/api/carer)

    * **editProfile**

      * **editProfile.js**: DX \<Form\> component to allow carers to edit their personal information that interacts with fetchData.js to receive their current information, and insertData.js to update existing data. This component is called in /src/pages/profile/profile.js. Uses the Carer API (/api/carer)

- **reset-password-form**

- **side-navigation-menu**

- **user-panel**

    * **user-panel.js**: DX \<ContextMenu\> component that displays a drop down quick menu for carers to navigate the profile, change password and logout pages.

- **unavailability**

   * **LeaveBookingDetails.js**:  DX \<Form\> component is displayed as a form popup, allows carers to view/edit an existing leave request. Uses the Carer API (/api/carer/{carerId}/unavailability/{id}) and Reference API (/api/ref/leave)

   * **LeaveBookingForm.js**:  DX \<Form\> component is displayed as a form popup, allows carers to add a leave request.  Uses the Carer API (/api/carer/{carerId}/unavailability) and Reference API (/api/ref/leave)

   * **UnavailableCalendar.js**: DX \<Scheduler\> component to allow carers to view/add/edit/delete Carer’s unavailability events and view booking events from a calendar view. Uses the Carer API (/api/carer/{carerId}/unavailability) and Reference API (/api/ref/leave)

### /src/contexts Files

Contains React contexts used to share state across the application

- **auth.js**
    * A React functional component that serves to verify that a carer can login or logout into the system. As well as checking if the logged in carer is authorized to make APIs calls/requests by verifying the validity of the user token. 
    
- **navigation.js**

### /src/layouts Files

Contains page layouts (auto-generated by DevExtreme)

- index.js

**Folders**

- side-nav-inner-toolbar.js

- side-nav-outter-toolbar.js

- single-card.js

### /src/pages Files

Contains top-level page definitions for each of the left-hand side menu options

- index.js

**Folders**

Main app pages

- **availability**

    * **availability.js**: imports AvailabilityList from src/components/availability/AvailabilityList to allow carers to view and update their availability for the week

- **booking**

   * **current-roster.js**: imports Calendar from src/components/booking/Calendar to allow carers to view their bookings in a calendar view

   * **unconfirmed-shifts.js**: imports UnconfirmedList from /components/booking/UnconfirmedList to allow carers to view and update their list of unconfirmed shifts

- **contact**

   * **contact.js**: imports ContactHistory from src/components/contact/ContactHistory to allow carers to view their communication log with the carer manager

- display-data

- home

- **incident-report**

   * **incident-report.js**: DX \<Form\> to allow carers to submit incident reports, interacts with the insertData.js to submit report onto the database. Submitted reports can be viewed, edited, and deleted on the past-submissions page. The carer must select from its list of clients in order to submit a report (If the client list is empty that means that the carer doesn't have any clients).

- **injury-claim**

   * **injury-claim.js**: DX \<Form\> to allow carers to submit injury claims after they have submitted an incident report. interacts with the insertData.js to submit form onto the database. Carers must download an existing form, fill it out and then upload it before submitting the injury claim. Submitted injury claims can be viewed, edited, and deleted on the past-submissions page. <br />  
   
     **note:** currently the form can be connected to the incident through the submitted incident date field to be selected, however work still needs to be done to call the PUT api to update the existing fields (submit the form), and also to add carer name in the selection together with submission date to make it more user friendly.

- **past-submissions**

   * **past-submissions.js**: DX \<DataGrid\> lists submitted incident reports / Injury claims and allow carers to view all past submissions, edit and delete reports/claims (submissions that have been sent but not confirmed by the carer manager, refer to the DateIncidentApproved field in the database). This page interacts with fetchData.js, updateData.js and deleteData.js.

- **profile**

   * Renders the Profile page having DX \<Form\> to allow carers to view/edit their profile and skills. The page contains child components AddSkill component from src/components/profile/addSkill, viewSkillscomponent from src/components/profile/viewSkillsand the EditProfile component from src/components/profile/editProfile

- **testing**

- **unavailability**

   * **unavailability.js**: Renders the Unavailability page and load the UnavailableCalendarcomponent from src/components/unavailability/UnavailableCalendar to allow carers to view their unavailable events in a calendar view
   
### Autogenerated Folders

- **/src/themes**   
Contains references to the theme used by the application

- **/src/utils**  
Contains components that help with resizing the screen to fit different devices
