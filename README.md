# Solution

The tech stack I used is Node, Express, and NeDB (lightweight DB with Mongo's API). 

I have a script (`scripts/populateDbFromCsv.js`) to populate the DB. As part of registering users, I perform a lookup of their address to get their lat/lon. This makes for a more precise weather lookup at their house. The lat/lon is stored in the DB along with the other PII.

I presumed that the PII stored in the database needed to be guarded. Therefore, I encrypt all PII in the DB. To facilitate lookups, I hash the user's email address to provide a userId that is not PII. I presume that a separate process, outside the scope of this assignment, gives that userId to the user to perform lookups.

I apologize I didn't have time to do any of the extra credit... dockerizing this would have certainly made things simpler for running.

# Usage

1. Install node v12 (I typically use NVM: https://github.com/nvm-sh/nvm), then `nvm use v12`)
1. Run `npm install`
1. Run `npm install -g jest`
1. Run `npm run test` to ensure all tests pass.
1. Run `npm run populate` to populate the database from the text file. This process will also spit out a number of test URLs (one per record). This is a one-time process.
1. Run `node .` to start the service.
1. Open a browser using the URLs provided for testing.