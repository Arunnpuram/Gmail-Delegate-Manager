// https://developers.google.com/gmail/api/reference/rest/v1/users.settings.delegates/delete

import { google } from 'googleapis';
import { createInterface } from 'readline';
import { readFileSync } from 'fs';

// Function to prompt for input
function askQuestion(query) {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    
    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }));
}

async function listDelegates(service, userEmail) {
    try {
        const response = await service.users.settings.delegates.list({
            userId: 'me',  // 'me' refers to the impersonated user
        });
        return response.data.delegates || [];
    } catch (error) {
        console.error('Error listing delegates:', error);
        if (error.response) {
            console.error('List delegates error response:', error.response.data);
        }
        return [];
    }
}

async function deleteDelegateAccount() {
    try {
        // Prompt for the JSON key file path
        const serviceAccountFile = await askQuestion('Enter the file path to your service account JSON key file: ');
        // Prompt for the email of the user to impersonate
        const userEmail = await askQuestion('Enter the email of the user to impersonate: ');
        // Prompt for the email of the delegate
        const delegateEmail = await askQuestion('Enter the email of the delegate to delete: ');
        
        console.log('Loading service account key file...');
        // Load the service account key file
        const keyFile = readFileSync(serviceAccountFile, 'utf8');
        const key = JSON.parse(keyFile);
        console.log('Service account key file loaded successfully.');
        
        console.log('Configuring Google Auth...');
        // Configure Google Auth
        const auth = new google.auth.JWT(
            key.client_email,
            null,
            key.private_key,
            ['https://www.googleapis.com/auth/gmail.settings.sharing',
             'https://www.googleapis.com/auth/gmail.settings.basic',
             'https://www.googleapis.com/auth/gmail.modify'],
            userEmail
        );
        
        // Verify token acquisition
        console.log('Attempting to obtain access token...');
        try {
            const token = await auth.getAccessToken();
            console.log('Access token obtained successfully');
        } catch (tokenError) {
            console.error('Error obtaining access token:', tokenError);
            if (tokenError.response) {
                console.error('Token error response:', tokenError.response.data);
            }
            console.error('Token error stack:', tokenError.stack);
            return; // Exit the function if we can't get a token
        }

        console.log('Creating Gmail API client...');
        // Create the Gmail API client
        const gmail = google.gmail({ version: 'v1', auth });

        // Verify API access
        console.log('Verifying API access...');
        try {
            await gmail.users.getProfile({ userId: 'me' });
            console.log('Successfully accessed Gmail API');
        } catch (profileError) {
            console.error('Error accessing Gmail API:', profileError);
            if (profileError.response) {
                console.error('Profile error response:', profileError.response.data);
            }
            console.error('Profile error stack:', profileError.stack);
            return; // Exit the function if we can't access the API
        }
        
        // Check if the delegate exists
        console.log('Checking if delegate exists...');
        const delegates = await listDelegates(gmail, userEmail);
        const delegateExists = delegates.some(delegate => delegate.delegateEmail === delegateEmail);
        
        if (!delegateExists) {
            console.log('Delegate does not exist.');
            return;
        }
        
        // Delete the delegate
        console.log('Attempting to delete delegate...');
        await gmail.users.settings.delegates.delete({
            userId: 'me',  // 'me' refers to the impersonated user
            delegateEmail: delegateEmail
        });
        
        console.log('Delegate account deleted successfully.');
    } catch (error) {
        console.error('Error deleting delegate account:', error);
        if (error.response) {
            console.error('Error response:', error.response.data);
        }
        console.error('Error stack:', error.stack);
    }
}

deleteDelegateAccount();
