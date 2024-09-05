# Gmail Delegate Account Manager

This Node.js script allows you to add or delete delegate accounts for a Gmail inbox using the Google API. The script uses a service account with domain-wide delegation to perform operations on behalf of a user.

## Prerequisites

Before running the script, ensure the following:

1. You have a **Google Cloud Service Account** with Gmail API access and domain-wide delegation.
2. You have a JSON key file for the service account.
3. The **Gmail API** is enabled for your Google Cloud project.
4. The service account is granted permission to manage delegate settings for the user's Gmail account.

## Features

- **Add Delegate:** Adds a specified email as a delegate for a Gmail account.
- **Delete Delegate:** Removes a specified email from the list of delegates for a Gmail account.
- Automatically handles Google Authentication and API requests.

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/Arunnpuram/Accountsdelegationprocess.git
   cd Accountsdelegationprocess
   npm install
   node createDelegate.js
   node deleteDelegate.js


## Example Output

node createDelegate.js
# Enter the file path to your service account JSON key file: ./service-account-key.json
# Enter the email of the inbox to impersonate: user@example.com
# Enter the email of the delegate: delegate@example.com

node deleteDelegate.js
# Enter the file path to your service account JSON key file: ./service-account-key.json
# Enter the email of the inbox to impersonate: user@example.com
# Enter the email of the delegate to delete: delegate@example.com
