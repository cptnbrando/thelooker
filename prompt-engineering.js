const mainPrompt = "Here is a frame of security camera footage for my house. I need to know "; 
const responsePrompt = "Please respond with: ";

const possibilities = [
    {"if there is a car parked in my driveway" : "CAR PARKED IN DRIVEWAY"},
    {"if there is a human being anywhere in the frame" : "HUMAN FOUND IN FRAME"},
    {"if there is a car parked on the road" : "CAR PARKED ON ROAD"}
];

const defaultResponse = "if none of the above apply please respond with ALL IS WELL. ";

export const getPrompt = () => {
    // Step 1: Concatenate the keys into a single query
    const conditions = possibilities.map(poss => Object.keys(poss)[0]).join(', or ');
    
    // Step 2: Create the prompt for the AI
    let prompt = mainPrompt + conditions + ". " + responsePrompt;
    
    // Step 3: Specify the expected responses for each condition
    const responses = possibilities.map(poss => Object.values(poss)[0]).join(', or ');

    // Complete the prompt with possible responses
    prompt += responses + ", or " + defaultResponse;

    prompt += "Please keep responses limited to only the above options, as a specifically engineered application depends on those exact responses. Thank you!"
    
    return prompt;
}
