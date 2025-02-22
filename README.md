
#Work Flow

index.js -> entry point for the app

routes/auth.routes.js -> calls a specific controller function

controller handles http request (extracts variables from the body
send success/error response) *NEVER* handles business logic. Call service
handleFetchPlayers.js

Service handles business logic (validation, formatting, calculation)
then calls the models
fetchPlayers.js deleteSomething changeSomething

model only interact with database. no business logic
insertSomething, updateSomething, selectPlayers.js
