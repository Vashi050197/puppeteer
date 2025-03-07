const path = require('path');
const fs = require('fs');
const readline = require('readline');
// import puppeteer from 'puppeteer'; // v23.0.0 or later
// puppeteer.Locator
// .race()
// console.log("Puppeteer script started...");
// console.log("Puppeteer script started...");

// res.result.text().then(jsonString => {
//     try{
//      const booleanValue = JSON.parse(jsonString).myBooleanValue;
//     console.log(booleanValue);
// }
// catch(error){
//     console.error("Error parsing JSON or accessing the property:",error)
// }
// });

const { GoogleGenerativeAI,SchemaType } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyDEl4vJaneM22pSs67ygDmi9nUTZ87I0xY");
// import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
var schema = {
    description: "Single word response",
    type: "string",
    minLength: 1,
    maxLength: 1,
  };
 
  
  
//   const schema2 = {
//     description: "Question and options",
//     type: SchemaType.OBJECT,
//     items: {
//         type: SchemaType.OBJECT,
//         properties: {
//         question: {
//             type: SchemaType.STRING},
//         options:{
//             type: SchemaType.Array,
//             items: {
//                 type: SchemaType.STRING
//             }

//         }    
//     },
//     required: ["question"],
//   },
//   };
const schema2 = {
    description: "Question and options",
    type: SchemaType.OBJECT,
    properties: {
        question: {
            type: SchemaType.STRING
        }
    },
    required: ["question"],
  };

const schema4 = {
    description: "Options of question",
    type: SchemaType.OBJECT,
    properties: {
        options: {
            type: SchemaType.ARRAY,
            items: {
                type: SchemaType.STRING
            }
        }
    },
    required: ["options"],
  };
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema,
    },
    // systemInstruction: "Consisder yourself a job applicant. And Give the output in 1 Char from the options if provided, if no answer is found in Json than output 99 and RESPONSE ASAP sometime answer is not in Json So simply output 99. some of the question has same meaning like NOTICE PERIOD or NP and 'how soon you can join' these all have same meaning. similarly for current salary,  current CTC or CCTC are same. CCTC is just short form of current CTC. Same for Expected CTC and ECTC. ECTC and CCTC are obviously different. Related question which has same meaning/context may be find in the Json than answer that but if you are not sure than output 99"
    //systemInstruction: "Consider yourself a Job Applicant. Your task is to provide a single word response from the given options (if provided). If the question has multiple-choice options (visible in the provided image), select the single best answer and output that. Similar questions which have the same meaning/context can be found in json. For example:- 'Notice Period', 'NP' 'How soon can you join?' mean the same thing. 'Current Salary', 'Current CTC', and 'CCTC' are the same. 'Expected CTC' and 'ECTC' are the same but different from CCTC. If a similar question exists in the JSON, use it to answer. **Applicant Persona:** For generic questions like 'Is there any conflict of interest?', 'Have you previously worked for any company?', or 'Are you a contractor?', assume you are a typical JOB Applicant and answer appropriately (e.g., 'No','Yes'). **Allowed Responses:** Your response MUST be from the options given in the image(if provided) or from the json(single word) or '99'. No additional text or explanation."
    systemInstruction: "You are a Job Applicant responding to questions. Provide a single-word answer.\n -1. If multiple-choice options are shown in the image, select the best option.\n- 2. If the question matches a synonym in the provided JSON (e.g., 'Notice Period' = 'NP' ='How soon join' all have same meaning/Context), use the JSON value.\n- 3. For general questions like 'Conflict of interest?','Are you willing to take test?', answer as a typical applicant ('Yes' or 'No').\n-5. If no suitable answer is found, respond with '99'.\n 6. Output ONLY the single-word answer or '99'."
    // systemInstruction:  "Consider yourself a Job Applicant. Your task is to provide a single-character response from the given options (if provided). If the question has multiple-choice options (visible in the provided image), select the single best answer and output that. Similar questions which have the same meaning/context can be find in json. For example:- 'Notice Period', 'NP' 'How soon can you join?' mean the same thing. 'Current Salary', 'Current CTC', and 'CCTC' are the same. 'Expected CTC' and 'ECTC' are the same but different from CCTC. If a similar question exists in the JSON, use it to answer.**Applicant Persona:** For generic questions like 'Is there any conflict of interest?', 'Have you previously worked for any company?', or 'Are you a contractor?', assume you are a typical job applicant and answer appropriately (e.g., 'No','Yes').   **Single Character Output:** Your response MUST be a single character (from the options) or '99'. No additional text or explanation."    
  });
 
  const schema1 = {
    
    type: 'object',
    properties: {
        myBooleanValue: { type: 'boolean' }
    },
    required: ['myBooleanValue'],
  };
  const model1 = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema1,
      temperature: 0.0,
    }
  });

  const model3 = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema2,
    },
    systemInstruction: "Be a data Extractor"
    // systemInstruction:  "Consider yourself a Job Applicant. Your task is to provide a single-character response from the given options (if provided). If the question has multiple-choice options (visible in the provided image), select the single best answer and output that. Similar questions which have the same meaning/context can be find in json. For example:- 'Notice Period', 'NP' 'How soon can you join?' mean the same thing. 'Current Salary', 'Current CTC', and 'CCTC' are the same. 'Expected CTC' and 'ECTC' are the same but different from CCTC. If a similar question exists in the JSON, use it to answer.**Applicant Persona:** For generic questions like 'Is there any conflict of interest?', 'Have you previously worked for any company?', or 'Are you a contractor?', assume you are a typical job applicant and answer appropriately (e.g., 'No','Yes').   **Single Character Output:** Your response MUST be a single character (from the options) or '99'. No additional text or explanation."    
  });

  const model4 = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema4,
    },
    // systemInstruction: "Consisder yourself a job applicant. And Give the output in 1 Char from the options if provided, if no answer is found in Json than output 99 and RESPONSE ASAP sometime answer is not in Json So simply output 99. some of the question has same meaning like NOTICE PERIOD or NP and 'how soon you can join' these all have same meaning. similarly for current salary,  current CTC or CCTC are same. CCTC is just short form of current CTC. Same for Expected CTC and ECTC. ECTC and CCTC are obviously different. Related question which has same meaning/context may be find in the Json than answer that but if you are not sure than output 99"
    //systemInstruction: "Consider yourself a Job Applicant. Your task is to provide a single word response from the given options (if provided). If the question has multiple-choice options (visible in the provided image), select the single best answer and output that. Similar questions which have the same meaning/context can be found in json. For example:- 'Notice Period', 'NP' 'How soon can you join?' mean the same thing. 'Current Salary', 'Current CTC', and 'CCTC' are the same. 'Expected CTC' and 'ECTC' are the same but different from CCTC. If a similar question exists in the JSON, use it to answer. **Applicant Persona:** For generic questions like 'Is there any conflict of interest?', 'Have you previously worked for any company?', or 'Are you a contractor?', assume you are a typical JOB Applicant and answer appropriately (e.g., 'No','Yes'). **Allowed Responses:** Your response MUST be from the options given in the image(if provided) or from the json(single word) or '99'. No additional text or explanation."
    systemInstruction: "Be a data Extractor"
    // systemInstruction:  "Consider yourself a Job Applicant. Your task is to provide a single-character response from the given options (if provided). If the question has multiple-choice options (visible in the provided image), select the single best answer and output that. Similar questions which have the same meaning/context can be find in json. For example:- 'Notice Period', 'NP' 'How soon can you join?' mean the same thing. 'Current Salary', 'Current CTC', and 'CCTC' are the same. 'Expected CTC' and 'ECTC' are the same but different from CCTC. If a similar question exists in the JSON, use it to answer.**Applicant Persona:** For generic questions like 'Is there any conflict of interest?', 'Have you previously worked for any company?', or 'Are you a contractor?', assume you are a typical job applicant and answer appropriately (e.g., 'No','Yes').   **Single Character Output:** Your response MUST be a single character (from the options) or '99'. No additional text or explanation."    
  });

const puppeteer = require('puppeteer');

// Function to ask for user input
// function askQuestion(query) {
//     debugger;
//     const rl = readline.createInterface({
//         input: process.stdin,
//         output: process.stdout,
//     });

//     return new Promise((resolve) => rl.question(query, (answer) => {
//         rl.close();
//         resolve(answer);
//     }));
// }

async function askQuestion(query) {
    debugger;
    process.stdout.write(query + " "); // Show the question in the terminal
    return new Promise((resolve) => {
        process.stdin.once("data", (data) => {
            resolve(data.toString().trim()); // Read user input
        });
    });
}
// const readline = require('readline');
// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
// });

// function askQuestion(query) {
//     return new Promise((resolve) => rl.question(query, (answer) => {
//         rl.close();
//         resolve(answer);
//     }));
// }
const filePath = path.join(__dirname, 'inputValues.json');
let indexValues = {};
if (fs.existsSync(filePath)) {
    indexValues = JSON.parse(fs.readFileSync(filePath, 'utf8'));
}
debugger;

(async () => {
    console.log("Puppeteer script started...2");
    debugger;
    // const browser = await puppeteer.launch(headless=false);
    const browser = await puppeteer.connect({browserURL: "http://localhost:9222/"});
    const pages = await browser.pages();

    
    
    let targetPage = null;
    let page = null;
    for (const p of pages) {
        const url = p.url();
        // const title = await p.title(); // Note the await here

        if (url.includes("workday")) {
            targetPage = p;
            break; // Exit the loop once you find the page
        }
    }

    page=targetPage;

    const timeout = 25000;
    page.setDefaultTimeout(timeout);
    
    const fs = require('fs');
    
    
   
    {
        const targetPage = page;
       
        await targetPage.setViewport({
            width: 893,
            height: 676
        })
    }
    

   

    // {
    //   const targetPage = page;
    //   await puppeteer.Locator.race([
    //       targetPage.locator('html > div:nth-of-type(1) >>>> img'),
    //       targetPage.locator(':scope >>> html > div:nth-of-type(1) >>>> :scope >>> img'),
    //       targetPage.locator('::-p-aria(Show fill prompt) >>>> ::-p-aria(Simplify)')
    //   ])
    //       .setTimeout(timeout)
    //       .click({
    //       //   offset: {
    //       //     x: 13,
    //       //     y: 26,
    //       //   },
    //       });
    // }

    let gtf = null;
    debugger; 
    // Expose a function to get user input
    // async function getUserInput(targetPage, mess = "Enter the answer here") {
    //     return await targetPage.evaluate(() => {
    //         return new Promise((resolve) => {
    //             // Create a simple input box
    //             if (mess === undefined) {
    //                 mess = "Enter the answer here";
    //             }
    
    //             const modal = document.createElement('div');
    //             modal.innerHTML = ` <div style="margin-bottom: 10px;">${mess}</div> 
    //                                 <input id="userInput" placeholder="Enter name " style="width: 300px; padding: 8px; font-size: 16px;">
    //                                <button id="submit">OK</button>`;
    //             Object.assign(modal.style, {
    //                 position: 'fixed', top: '15%', left: '50%', transform: 'translate(-50%, -50%)',
    //                 background: 'white', padding: '10px', zIndex: '9999'
    //             });
    //             document.body.appendChild(modal);
    
    //             const inputField = document.getElementById('userInput');
    //             const submitButton = document.getElementById('submit');
    
    //             function submitInput() {
    //                 const value = inputField.value;
    //                 document.body.removeChild(modal); // Remove input UI
    //                 resolve(value); // Return input value
    //             }
    
    //             // Submit when clicking the button
    //             submitButton.onclick = submitInput;
    
    //             // Submit when pressing Enter
    //             inputField.addEventListener('keydown', (event) => {
    //                 if (event.key === 'Enter') submitInput();
    //             });
    
    //             // Auto-focus on input field
    //             inputField.focus();
    //         });
    //     });
    // }
    async function getUserInput(targetPage, mess = "Enter the answer here") {
        return await targetPage.evaluate((message) => {
            return new Promise((resolve) => {
                // Create a simple input box
                const modal = document.createElement('div');
                modal.innerHTML = ` 
                    <div style="margin-bottom: 10px;">${message}</div> 
                    <input id="userInput" placeholder="Enter name" style="width: 300px; padding: 8px; font-size: 16px;">
                    <button id="submit">OK</button>
                `;
                Object.assign(modal.style, {
                    position: 'fixed', top: '15%', left: '50%', transform: 'translate(-50%, -50%)',
                    background: 'white', padding: '10px', zIndex: '9999', border: '1px solid black'
                });
                document.body.appendChild(modal);
    
                const inputField = document.getElementById('userInput');
                const submitButton = document.getElementById('submit');
    
                function submitInput() {
                    const value = inputField.value;
                    document.body.removeChild(modal); // Remove input UI
                    resolve(value); // Return input value
                }
    
                // Submit when clicking the button
                submitButton.onclick = submitInput;
    
                // Submit when pressing Enter
                inputField.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter') submitInput();
                });
    
                // Auto-focus on input field
                inputField.focus();
            });
        }, mess); // Pass 'mess' explicitly as an argument
    }

    async function getIndexValue(page,key) {
        
        
        if (!indexValues[key]) {
            
            // Capture screenshot directly as a Buffer and convert to base64
            // const screen = await page.screenshot({ path: 's.jpg',type: "jpeg", fullPage: false, omitBackground: true });
            
            // const userConfirmed132 = await getUserInput(page,"Waiting for confirmed");

            // Construct the image part object using the buffer data
            const imagePart = {
            inlineData: {
                data: Buffer.from(fs.readFileSync('s1.png')).toString("base64"),
                mimeType: "image/png"
            }
            };

            debugger;
            if  (key.includes("Unnamed")){

                let prompt2 = 'Fetch the question just above RED COLOUR HIGHLIGHTED BOX which has "?" and "*" mark from the image along with options if provided?';
                const result2 = await model3.generateContent([prompt2, imagePart]);

                key = JSON.parse(result2.response.text()).question;

            }

            try{
                let prompt1 = `Analyze the image. Is the red highlighted question ${key} in the image a multiple choice question with options? Respond with true if it's a multiple choice question or false if it's not.`;
                const result1 = await model1.generateContent([prompt1, imagePart]);
            
                if (result1.response.text().includes('true')){
                    let prompt21 = `Fetch all the options of red Highlighted question or ${key} from the image?`;
                    const result21 = await model4.generateContent([prompt21, imagePart]);
                    
                    const booleanValue = JSON.parse(result21.response.text()).options;
                    console.log(booleanValue,Array.isArray(booleanValue));
                    let prompt12 = `Analyse the image. Is  ${booleanValue} are all of the options of red highlighted question or ${key} in the image?`;
                    const result12 = await model1.generateContent([prompt12, imagePart]);

                    if (result12.response.text().includes('true')){


                        const model5 = genAI.getGenerativeModel({
                            model: "gemini-1.5-pro",
                            generationConfig: {
                            responseMimeType: "application/json",
                            responseSchema:  {
                                description: "Single word response",
                                type: "string",
                                enum: booleanValue,
                            },
                            temperature:0.0,
                            },
                            systemInstruction: `Provide a single word answer from the available options. Your response must be one of these options: ${booleanValue.join(', ')}.`
                            });

                            let prompt = `
                            Question: "${key}"
                            Image Context: (The image shows the question and its options.)
                            JSON Data: ${JSON.stringify(indexValues)}
                            Options: ${booleanValue.join(', ')}.
                            Answer the Question from the otpions.
                            `;
                        

                        var result = await model5.generateContent([prompt, imagePart]);

                    }

                    else {

                        let prompt = `Question: "${key}"
                            Image Context: (The image shows the question and any answer options.)
                            JSON Data: ${JSON.stringify(indexValues)}
                            Answer is definitely from ${booleanValue} or of this type.
                            `;

                        var result = await model.generateContent([prompt, imagePart]);    
                    }

                }
            } catch (error) {
                console.error(`Error processing field "${key}" using locators:`, error);
            }
        
            // const prompt = `Answer the question, "${key}". question and options is given in the image. If the job application question is too generic and irrelevant to a specific candidature than answer the question apporpirately yourself strictly from the options(if provided) given in the image. Use ${JSON.stringify(indexValues)} for reference to answer. Some irrelavant questions are "Is there any conflict of interest?","Have you previously worked for any company?","Are you contractor of any company?" obviously appropriate answer to thsee question should be No. Most of the time such question have options in the image, so choose from them or Consisder yourself a job applicant and answer the appropirate answer using your intellegence`;
            let prompt = `Question: "${key}"
                         Image Context: (The image shows the question and any answer options.)
                         JSON Data: ${JSON.stringify(indexValues)}
                         Answer (from option only if provided):
                        `;

            
            // Call the generative model (e.g., Gemini)
            
            if (result == undefined) {
            var result = await model.generateContent([prompt, imagePart]);
            }
           
            const an= result.response.text();
            const ad=JSON.parse(an);
            var bn=ad.trim();
            if (bn === "99") {
                const answer =  await getUserInput(targetPage,key);    
                bn = answer;
                    
            }
            
            if  (!key.includes("Unnamed") && (!bn.toLowerCase().includes("select"))) {
            indexValues[key] = bn;
            fs.writeFileSync(filePath, JSON.stringify(indexValues, null, 2));
            } 
            
            return bn;
        }
        else{
            return indexValues[key];
        }
        
        
        }
        
{

       const locators = [
        targetPage.locator('#simplify-jobs-container > div >>>> #fill-button'),
        targetPage.locator(':scope >>> #fill-button')
    ];

    
    {
        const targetPage = page;
        debugger;
        console.log('1');
        gtf = await puppeteer.Locator.race(locators)
              .setTimeout(timeout)
              .click({
                offset: {
                  x: 204,
                  y: 20.800003051757812,
                },
              });
              console.log('1 finished');      
    }
    const memo= "enter";


   
    await targetPage.waitForSelector("[data-automation-id='file-upload-successful']", { timeout: 15000 });

    {
        const timeout = 10000;
        const targetPage = page;
        await puppeteer.Locator.race([
            targetPage.locator("[data-automation-id='bottom-navigation-next-button']"),
            targetPage.locator('::-p-xpath(//*[@data-automation-id=\\"bottom-navigation-next-button\\"])'),
            targetPage.locator(":scope >>> [data-automation-id='bottom-navigation-next-button']"),
            targetPage.locator('::-p-aria(Continue)'),
            targetPage.locator('::-p-text(Continue)')
        ])
            .setTimeout(timeout)
            .click({
            offset: {
                x: 44.4000244140625,
                y: 28.79998779296875,
            },
            });
        console.log('2 finished');

        
    }
    
    {
        const targetPage = page;
        const timeout = 35000;
        console.log('3gfgff');
        await puppeteer.Locator.race([
            targetPage.locator('::-p-aria(My Information)'),
            targetPage.locator('h2'),
            targetPage.locator('::-p-xpath(//*[@id=\\"mainContent\\"]/div/div[3]/h2)'),
            targetPage.locator(':scope >>> h2')
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 331,
                y: 55.390625,
              },
            });
            console.log('3ff finished');
    }
    
    
    
    { 
        const timeout = 15000;
        const targetPage = page;
        debugger;
        await puppeteer.Locator.race([
            targetPage.locator("[data-automation-id='phone-number']"),
            targetPage.locator('::-p-xpath(//*[@data-automation-id=\\"phone-number\\"])'),
            targetPage.locator(":scope >>> [data-automation-id='phone-number']"),
            targetPage.locator('::-p-aria(Phone Number)'),
            
        ])
            .setTimeout(timeout)
            .click({
              offset: {
                x: 26.399993896484375,
                y: 26.600006103515625,
              },
            });
    }
    {
        const targetPage = page;
        debugger;
        await puppeteer.Locator.race([
            targetPage.locator("[data-automation-id=' phone-number']"),
            targetPage.locator('::-p-xpath(//*[@data-automation-id=\\"phone-number\\"])'),
            targetPage.locator(":scope >>> [data-automation-id='phone-number']"),
            targetPage.locator('::-p-aria(Phone Number)'),
            
        ])
            .setTimeout(timeout)
            .fill('8077975459');
        console.log('4 finished');    
    }

    {   
        const timeout = 70000;
        const targetPage = page;
        debugger;
        console.log('3');
        await puppeteer.Locator.race([
            targetPage.locator('#simplify-jobs-container > div >>>> #fill-button'),
            targetPage.locator(':scope >>> #fill-button')
        ])
              .setTimeout(timeout)
              .click({
                offset: {
                  x: 204,
                  y: 20.800003051757812,
                },
              });
              console.log('3 finished');      
    }

    

      const inputFields = await page.evaluate(() => {
        return Array.from(document.querySelectorAll("input, select, textarea, button[aria-haspopup='listbox']"))
            .map(el => {
                // Check if the field has an explicit "required" attribute
                let isRequired = el.hasAttribute("aria-required") 
                    ? el.getAttribute("aria-required") === "true" || (el.hasAttribute("aria-label") && el.getAttribute("aria-label").includes('required'))

                    : "Not specified";
                
                

                // If there's no `aria-required`, check for an asterisk in the label
                const label = el.closest("div").querySelector("label");
                if (label && label.innerHTML.includes('<abbr aria-hidden="true"'))
                    isRequired = true;
                const container = el.closest("div");
                const inputEl = container.querySelector("input, select, textarea, button[aria-haspopup='listbox']");
                
                    
                    
                const labelText = label ? label.textContent.trim() : (el.getAttribute("aria-label") ? el.getAttribute("aria-label") : "No Label");
                if (labelText){
                    if (labelText.includes("required") || labelText.includes("*")){
                        isRequired = true;
                    }
                }
                const kf=  el.getAttribute("aria-label") || (label ? label.innerText.trim() : "No Label");
                if (kf){
                    if (kf.includes("required") || kf.includes("*")){
                        isRequired = true;
                }
                return {
                    type: el.tagName.toLowerCase(),
                    id: el.id || "No ID",
                    name: el.hasAttribute("data-automation-id") ? el.getAttribute("data-automation-id") : "No data-automation-id",
                    required: isRequired,
                    value: el.value || el.innerText || "No value",
                    label: kf,
                    q1: labelText,
                    ariaLabel: inputEl ? inputEl.getAttribute("aria-label") : null
                };
            };
      });
    });
    
  
    const userConfirmed31 =  await getUserInput(targetPage,'Waiting for confirmed');
    
    
    
    for (const field of inputFields)    {
        if (field.name.toLowerCase() === "phone-number") {
            

            { 
                const timeout = 15000;
                const targetPage = page;
                await puppeteer.Locator.race([
                    targetPage.locator("[data-automation-id='phone-number']"),
                    targetPage.locator('::-p-xpath(//*[@data-automation-id=\\"phone-number\\"])'),
                    targetPage.locator(":scope >>> [data-automation-id='phone-number']"),
                    targetPage.locator('::-p-aria(Phone Number)'),
                    targetPage.locator('::-p-text(918077975459)')
                ])
                    .setTimeout(timeout)
                    .click({
                    offset: {
                        x: 26.399993896484375,
                        y: 26.600006103515625,
                    },
                    });
            }
            {
                const targetPage = page;
                debugger;
                await puppeteer.Locator.race([
                    targetPage.locator("[data-automation-id='phone-number']"),
                    targetPage.locator('::-p-xpath(//*[@data-automation-id=\\"phone-number\\"])'),
                    targetPage.locator(":scope >>> [data-automation-id='phone-number']"),
                    targetPage.locator('::-p-aria(Phone Number)'),
                    targetPage.locator('::-p-text(918077975459)')
                ])
                    .setTimeout(timeout)
                    .fill('8077975459');
                console.log('4 dshhs finished');    
            }
            
        
        }
        else if(field.id === "1"){
            

            {
                const targetPage = page;
                await puppeteer.Locator.race([
                    targetPage.locator('#\\32 '),
                    targetPage.locator('::-p-xpath(//*[@id=\\"2\\"])'),
                    targetPage.locator(':scope >>> #\\32 '),
                    targetPage.locator('::-p-aria(No)')
                ])
                    .setTimeout(timeout)
                    .click({
                      offset: {
                        x: 18.399993896484375,
                        y: 13.600006103515625,
                      },
                    });
                    console.log('5 finished');
            }
        
        }
          
        else if(field.name === "addressSection_postalCode"){

            

            
            {
                const targetPage = page;
                await puppeteer.Locator.race([
                    targetPage.locator("[data-automation-id='addressSection_postalCode']"),
                    targetPage.locator('::-p-xpath(//*[@data-automation-id=\\"addressSection_postalCode\\"])'),
                    targetPage.locator(":scope >>> [data-automation-id='addressSection_postalCode']"),
                    targetPage.locator('::-p-aria(Postal Code)')
                ])
                    .setTimeout(timeout)
                    .click({
  
                      offset: {
                        x: 56.399993896484375,
                        y: 6.199981689453125,
                      },
                    });
                    console.log('6 hahsddhahhfinished');
            }
            
            {
                const targetPage = page;
                await puppeteer.Locator.race([
                     targetPage.locator("[data-automation-id='addressSection_postalCode']"),
                    targetPage.locator('::-p-xpath(//*[@data-automation-id=\\"addressSection_postalCode\\"])'),
                    targetPage.locator(":scope >>> [data-automation-id='addressSection_postalCode']"),
                    targetPage.locator('::-p-aria(Postal Code)')
                ])
                    .setTimeout(timeout)
                    .fill('250001');
            }

        

        }
           
        else if ( field.name === "legalNameSection_title"){
            


        
            {
                const targetPage = page;
                await puppeteer.Locator.race([
                    targetPage.locator("[data-automation-id='legalNameSection_title']"),
                    targetPage.locator('::-p-xpath(//*[@data-automation-id=\\"legalNameSection_title\\"])'),
                    targetPage.locator(":scope >>> [data-automation-id='legalNameSection_title']"),
                    targetPage.locator('::-p-aria(Prefix select one required)'),
                    targetPage.locator('::-p-text(select one)')
                ])
                    .setTimeout(timeout)
                    .click({
                      offset: {
                        x: 170,
                        y: 14.109375,
                      },
                    });
                console.log('7 finished');    
            }
  
            // {
            //     const targetPage = page;
            //     debugger;
            //     await puppeteer.Locator.race([
            //         targetPage.locator('#d0c149m > div'),
            //         targetPage.locator('::-p-xpath(//*[@id=\\"d0c149m\\"]/div)'),
            //         targetPage.locator(':scope >>> #d0c149m > div'),
            //         targetPage.locator('::-p-aria(Mr.) >>>> ::-p-aria([role=\\"generic\\"])'),
            //         targetPage.locator('::-p-text(Mr.)')
            //     ])
            //         .setTimeout(timeout)
            //         .click({
            //           offset: {
            //             x: 65,
            //             y: 10,
            //           },
            //         });
            //     console.log('8 finished');    
            // }
            {
                const targetPage = page;
                await puppeteer.Locator.race([
                    targetPage.locator("[data-automation-id='legalNameSection_title']"),
                    targetPage.locator('::-p-xpath(//*[@data-automation-id=\\"legalNameSection_title\\"])'),
                    targetPage.locator(":scope >>> [data-automation-id='legalNameSection_title']"),
                    targetPage.locator('::-p-aria(Prefix Mr. required)'),
                    targetPage.locator('::-p-text(Mr.)')
                ])
                    .setTimeout(timeout)
                    .click({
                      offset: {
                        x: 253,
                        y: 25.109375,
                      },
                    });
                    console.log('9 finished');
            }
            
          
        }
        else if(field.name ===  "searchBox"){
            
              
            {    const targetPage = page;
                await puppeteer.Locator.race([
                    targetPage.locator('#input-2'),
                    targetPage.locator('::-p-xpath(//*[@id=\\"input-2\\"])'),
                    targetPage.locator(':scope >>> #input-2'),
                    targetPage.locator('::-p-aria(How Did You Hear About Us?)')
                ])
                    .setTimeout(timeout)
                    .click({
                      offset: {
                        x: 165,
                        y: 8.8359375,
                      },
                    });
                 console.log('10 finished');   
            }
            {
                const targetPage = page;
                await puppeteer.Locator.race([
                    targetPage.locator("[data-automation-id='searchBox']"),
                    targetPage.locator('::-p-xpath(//*[@data-automation-id=\\"searchBox\\"])'),
                    targetPage.locator(":scope >>> [data-automation-id='searchBox']"),
                    targetPage.locator('::-p-aria(How Did You Hear About Us?)')
                ])
                    .setTimeout(timeout)
                    .fill('Other');
                    console.log('11 finished');
        
            }
            {
                const targetPage = page;
                await targetPage.keyboard.down('Enter');
            }
            {
                const targetPage = page;
                await targetPage.keyboard.up('Enter');
            }
            {
                const targetPage = page;
                await targetPage.keyboard.down('Enter');
            }
            {
                const targetPage = page;
                await targetPage.keyboard.up('Enter');
            
            } 
        
      
        }
    }      


    // await targetPage.waitForFunction(() => {
    //     const field = document.querySelector("[data-automation-id='phone-number']");
    //     return field && field.value.trim().length > 0; // Ensure field has content
    // }, { timeout: 8000 }); // Adjust timeout as needed
    
    // await targetPage.waitForFunction(() => {
    //     const fileNameElement = document.querySelector("::-p-text(Autofill again)");
    //     return fileNameElement;
    // }, { timeout: 120000 });
    
   
    while(true){
        const userConfirmed = await getUserInput(targetPage,"Any left 1");
    
        
        if (userConfirmed === ""){

            { 
                const timeout = 15000;
                const targetPage = page;
                await puppeteer.Locator.race([
                    targetPage.locator("[data-automation-id='phone-number']"),
                    targetPage.locator('::-p-xpath(//*[@data-automation-id=\\"phone-number\\"])'),
                    targetPage.locator(":scope >>> [data-automation-id='phone-number']"),
                    targetPage.locator('::-p-aria(Phone Number)'),
                    targetPage.locator('::-p-text(918077975459)')
                ])
                    .setTimeout(timeout)
                    .click({
                    offset: {
                        x: 26.399993896484375,
                        y: 26.600006103515625,
                    },
                    });
            }
            {
                const targetPage = page;
                debugger;
                await puppeteer.Locator.race([
                    targetPage.locator("[data-automation-id='phone-number']"),
                    targetPage.locator('::-p-xpath(//*[@data-automation-id=\\"phone-number\\"])'),
                    targetPage.locator(":scope >>> [data-automation-id='phone-number']"),
                    targetPage.locator('::-p-aria(Phone Number)'),
                    targetPage.locator('::-p-text(918077975459)')
                ])
                    .setTimeout(timeout)
                    .fill('8077975459');
                console.log('4 dshhs finished');    
            }
            
        }
        else if (userConfirmed === "1"){

            {
                const targetPage = page;
                await puppeteer.Locator.race([
                    targetPage.locator('#\\32 '),
                    targetPage.locator('::-p-xpath(//*[@id=\\"2\\"])'),
                    targetPage.locator(':scope >>> #\\32 '),
                    targetPage.locator('::-p-aria(No)')
                ])
                    .setTimeout(timeout)
                    .click({
                      offset: {
                        x: 18.399993896484375,
                        y: 13.600006103515625,
                      },
                    });
                    console.log('5 finished');
            }
        }
        else if (userConfirmed === "2"){

            
            {
                const targetPage = page;
                await puppeteer.Locator.race([
                    targetPage.locator("[data-automation-id='addressSection_postalCode']"),
                    targetPage.locator('::-p-xpath(//*[@data-automation-id=\\"addressSection_postalCode\\"])'),
                    targetPage.locator(":scope >>> [data-automation-id='addressSection_postalCode']"),
                    targetPage.locator('::-p-aria(Postal Code)')
                ])
                    .setTimeout(timeout)
                    .click({
  
                      offset: {
                        x: 56.399993896484375,
                        y: 6.199981689453125,
                      },
                    });
                    console.log('6 hahsddhahhfinished');
            }
            
            {
                const targetPage = page;
                await puppeteer.Locator.race([
                    targetPage.locator("[data-automation-id='addressSection_postalCode']"),
                    targetPage.locator('::-p-xpath(//*[@data-automation-id=\\"addressSection_postalCode\\"])'),
                    targetPage.locator(":scope >>> [data-automation-id='addressSection_postalCode']"),
                    targetPage.locator('::-p-aria(Postal Code)')
                ])
                    .setTimeout(timeout)
                    .fill('250001');
            }

        }
        
        else if (userConfirmed === "3"){


        
            {
              const targetPage = page;
              debugger;
              await puppeteer.Locator.race([
                  targetPage.locator("[data-automation-id='legalNameSection_title']"),
                  targetPage.locator('::-p-xpath(//*[@data-automation-id=\\"legalNameSection_title\\"])'),
                  targetPage.locator(":scope >>> [data-automation-id='legalNameSection_title']"),
                  targetPage.locator('::-p-aria(Prefix select one required)'),
                  targetPage.locator('::-p-text(select one)')
              ])
                  .setTimeout(timeout)
                  .click({
                    offset: {
                      x: 170,
                      y: 14.109375,
                    },
                  });
              console.log('7 finished');    
            }

        //   {
        //       const targetPage = page;
        //       await puppeteer.Locator.race([
        //           targetPage.locator('#d0c149m > div'),
        //           targetPage.locator('::-p-xpath(//*[@id=\\"d0c149m\\"]/div)'),
        //           targetPage.locator(':scope >>> #d0c149m > div'),
        //           targetPage.locator('::-p-aria(Mr.) >>>> ::-p-aria([role=\\"generic\\"])'),
        //           targetPage.locator('::-p-text(Mr.)')
        //       ])
        //           .setTimeout(timeout)
        //           .click({
        //             offset: {
        //               x: 65,
        //               y: 10,
        //             },
        //           });
        //       console.log('8 finished');    
        //   }
          {
              const targetPage = page;
              await puppeteer.Locator.race([
                  targetPage.locator("[data-automation-id='legalNameSection_title']"),
                  targetPage.locator('::-p-xpath(//*[@data-automation-id=\\"legalNameSection_title\\"])'),
                  targetPage.locator(":scope >>> [data-automation-id='legalNameSection_title']"),
                  targetPage.locator('::-p-aria(Prefix Mr. required)'),
                  targetPage.locator('::-p-text(Mr.)')
              ])
                  .setTimeout(timeout)
                  .click({
                    offset: {
                      x: 253,
                      y: 25.109375,
                    },
                  });
                  console.log('9 finished');
          }
          
        }
        else if (userConfirmed === "4"){
              
              {    const targetPage = page;
                   debugger;
                  await puppeteer.Locator.race([
                      targetPage.locator('#input-2'),
                      targetPage.locator('::-p-xpath(//*[@id=\\"input-2\\"])'),
                      targetPage.locator(':scope >>> #input-2'),
                      targetPage.locator('::-p-aria(How Did You Hear About Us?)')
                  ])
                      .setTimeout(timeout)
                      .click({
                        offset: {
                          x: 165,
                          y: 8.8359375,
                        },
                      });
                   console.log('10 finished');   
              }
              {
                  const targetPage = page;
                  const loc= await puppeteer.Locator.race([
                      targetPage.locator("[data-automation-id='searchBox']"),
                      targetPage.locator('::-p-xpath(//*[@data-automation-id=\\"searchBox\\"])'),
                      targetPage.locator(":scope >>> [data-automation-id='searchBox']"),
                      targetPage.locator('::-p-aria(How Did You Hear About Us?)')
                  ])
                      .setTimeout(timeout);
                      await loc.fill('Other Options');

                      // Click if necessary
                      await loc.click();
                      console.log('11 finished');
          
              }
              {
                  const targetPage = page;
                  await targetPage.keyboard.down('Enter');
              }
              {
                  const targetPage = page;
                  await targetPage.keyboard.up('Enter');
              }
              {
                  const targetPage = page;
                  await targetPage.keyboard.down('Enter');
              }
              {
                  const targetPage = page;
                  await targetPage.keyboard.up('Enter');
              
              } 
          
        }
        else{
            break;
        }
    }
      
      
        
        
       
        {
            const targetPage = page;
            console.log('4dhh finished');
            debugger;
            await puppeteer.Locator.race([
                targetPage.locator("[data-automation-id='bottom-navigation-next-button']"),
                targetPage.locator('::-p-xpath(//*[@data-automation-id=\\"bottom-navigation-next-button\\"])'),
                targetPage.locator(":scope >>> [data-automation-id='bottom-navigation-next-button']"),
                targetPage.locator('::-p-aria(Save and Continue)'),
                targetPage.locator('::-p-text(Save and Continue)')
            ])
                .setTimeout(timeout)
                .click({
                    offset: {
                    x: 28.9749755859375,
                    y: 22.79998779296875,
                    },
                });
                console.log('5 asjkdjkafinished');
        }

        
           
        const reqFields = await targetPage.evaluate(() => {
            return Array.from(document.querySelectorAll("p.css-gospiw"))
            .map(errorElement => {
                const errorText = errorElement.textContent;
                if (errorText.includes("is required") && errorText.includes("must have a value")) {
                const container = errorElement.closest("div[data-automation-id]");
                const inputEl = container.querySelector("input, select, textarea, button[aria-haspopup='listbox']");
                return {
                    label: container.querySelector("label") ? container.querySelector("label").textContent.trim() : "Unnamed field",
                    id: inputEl ? inputEl.id : null,
                    dataAutomation: inputEl ? inputEl.getAttribute("data-automation-id") : null,
                    ariaLabel: inputEl ? inputEl.getAttribute("aria-label") : null,
                    tagName: inputEl ? inputEl.tagName.toLowerCase() : null,
                    hasPopup: inputEl ? inputEl.getAttribute("aria-haspopup") : null,
                    value: inputEl ? (inputEl.value || inputEl.innerText) : null
                };
                }
                return null;
            })
            .filter(field => field !== null);
        });
       

        
            // Loop over each required field
        for (const field of reqFields) {
                const key = field.label;
                debugger;
                // Skip fields that already have a value
                if (field.value !== null && field.value !== undefined && field.value.trim() !== "" && !(field.value.toLowerCase().includes('select'))) {
                    continue;
                }
        
                // Fetch the value dynamically
               
                
                // Build an array of locators in order of priority
                const locators = [];
                if (field.dataAutomation) {
                    locators.push(targetPage.locator(`[data-automation-id="${field.dataAutomation}"]`));
                }
                if (field.id) {
                    locators.push(targetPage.locator(`#${field.id}`));
                }
                if (field.label) {
                    locators.push(targetPage.locator(`::-p-aria(${field.label})`));
                }
                
                if (locators.length === 0) {
                    console.error(`No selector available for field "${key}"`);
                    continue;
                }
                await  puppeteer.Locator.race(locators).setTimeout(timeout).click();
                
                const value = await getIndexValue(targetPage,key);
                
                if (field.value.toLowerCase().includes('select')) {
                

                    const locators1 = [
                        targetPage.locator(`aria/${value}`),  // Find by ARIA text
                        targetPage.locator('[role="generic"]') // Find by role attribute
                    ];
                    
                    locators1.push(targetPage.locator(`::-p-aria(${value}) >>>> ::-p-aria([role=\\"generic\\"])`));

                    await puppeteer.Locator.race(locators1).setTimeout(timeout).click();
                
                }

                try {
                    // Use locator.race() to select the first available locator
                    
                    // Handle field types
                    if (field.tagName === "input" || field.tagName === "textarea") {
                        await  puppeteer.Locator.race(locators).setTimeout(timeout).fill(value);
                        console.log(`Filled "${key}" with value "${value}"`);
                        {
                            const targetPage = page;
                            await targetPage.keyboard.down('Enter');
                        }
                        {
                            const targetPage = page;
                            await targetPage.keyboard.up('Enter');
                        }
                        {
                            const targetPage = page;
                            await targetPage.keyboard.down('Enter');
                        }
                        {
                            const targetPage = page;
                            await targetPage.keyboard.up('Enter');
                        
                        } 
                    } else if (field.tagName === "select") {
                        await puppeteer.Locator.race(locators).setTimeout(timeout).select(value);
                        console.log(`Selected option "${value}" for "${key}"`);
                    } else if (field.tagName === "button" || field.hasPopup === "listbox") {
                        await puppeteer.Locator.race(locators).setTimeout(timeout).click();
                        console.log(`Clicked dropdown button for "${key}"`);
        
                        // Wait and select option
                        await puppeteer.Locator.race(`::-p-aria(${value})`).setTimeout(timeout).click();
                        {
                            const targetPage = page;
                            await targetPage.keyboard.down('Enter');
                        }
                        {
                            const targetPage = page;
                            await targetPage.keyboard.up('Enter');
                        }
                        {
                            const targetPage = page;
                            await targetPage.keyboard.down('Enter');
                        }
                        {
                            const targetPage = page;
                            await targetPage.keyboard.up('Enter');
                        
                        } 
                        console.log(`Selected "${value}" from dropdown for "${key}"`);
                    } else {
                        console.warn(`Unsupported field type for "${key}"`);
                    }
                } catch (error) {
                    console.error(`Error processing field "${key}" using locators:`, error);
                }
            }
        
        const userConfirmed3 =  await getUserInput(targetPage,'final check 1 confirm ');
        if (reqFields.length!==0 ){
        {   
            const timeout23=20000;
            const targetPage = page;
            await puppeteer.Locator.race([
                targetPage.locator("[data-automation-id='bottom-navigation-next-button']"),
                targetPage.locator('::-p-xpath(//*[@data-automation-id=\\"bottom-navigation-next-button\\"])'),
                targetPage.locator(":scope >>> [data-automation-id='bottom-navigation-next-button']"),
                targetPage.locator('::-p-aria(Save and Continue)'),
                targetPage.locator('::-p-text(Save and Continue)')
            ])
                .setTimeout(timeout23)
                .click({
                    offset: {
                    x: 28.9749755859375,
                    y: 22.79998779296875,
                    },
                });
                console.log('2 finished');
        }
        }

   
}

        
        while(true) {
            
            try{

            const userConfirmed212 = await getUserInput(targetPage,'Navigation waiting');
            
            {
                    const targetPage = page;
                    
                    const timeout1=90000;
                    console.log('12');
                      await puppeteer.Locator.race([
                          targetPage.locator('#simplify-jobs-container > div >>>> #fill-button'),
                          targetPage.locator(':scope >>> #fill-button')
                      ])
                          .setTimeout(timeout1)
                          .click({
                            offset: {
                              x: 204,
                              y: 20.800003051757812,
                            },
                          });
                          
                          console.log('13434 finished');      
            }
            
            const userConfirmed2 = await getUserInput(targetPage,'volu page');
            if (userConfirmed2 === 'a') {
                    break;
                }
                
                

                {
                    const targetPage = page;
                    const timeou=45000;
                    await puppeteer.Locator.race([
                        targetPage.locator("[data-automation-id='bottom-navigation-next-button']"),
                        targetPage.locator('::-p-xpath(//*[@data-automation-id=\\"bottom-navigation-next-button\\"])'),
                        targetPage.locator(":scope >>> [data-automation-id='bottom-navigation-next-button']"),
                        targetPage.locator('::-p-aria(Save and Continue)'),
                        targetPage.locator('::-p-text(Save and Continue)')
                    ])
                        .setTimeout(timeou)
                        .click({
                            offset: {
                            x: 28.9749755859375,
                            y: 22.79998779296875,
                            },
                        });
                        console.log('2 djjdjdjajdad finished');
                }

                const requiredFields1 = await targetPage.evaluate(() => {
                    return Array.from(document.querySelectorAll("p.css-gospiw"))
                    .map(errorElement => {
                        const errorText = errorElement.textContent;
                        if (errorText.includes("is required") && errorText.includes("must have a value")) {
                        const container = errorElement.closest("div[data-automation-id]");
                        const inputEl = container.querySelector("input, select, textarea, button[aria-haspopup='listbox']");
                        return {
                            label: container.querySelector("label") ? container.querySelector("label").textContent.trim() : "Unnamed field",
                            id: inputEl ? inputEl.id : null,
                            dataAutomation: inputEl ? inputEl.getAttribute("data-automation-id") : null,
                            ariaLabel: inputEl ? inputEl.getAttribute("aria-label") : null,
                            tagName: inputEl ? inputEl.tagName.toLowerCase() : null,
                            hasPopup: inputEl ? inputEl.getAttribute("aria-haspopup") : null,
                            value: inputEl ? (inputEl.value || inputEl.innerText) : null
                        };
                        }
                        return null;
                    })
                    .filter(field => field !== null);
                });
               
                const requiredFields = await targetPage.evaluate(() => {
                    return Array.from(document.querySelectorAll("p[data-automation-id='inputError']"))
                        .map(errorElement => {
                            const errorText = errorElement.textContent;
                            if (errorText.includes("is required") && errorText.includes("must have a value")) {
                                const container = errorElement.closest("div[data-automation-id]");
                                const inputEl = container.querySelector("input, select, textarea, button[aria-haspopup='listbox']");
                                return {

                                    label: container.querySelector("label") ? container.querySelector("label").textContent.trim() || container.innerText.trim() : "Unnamed field",
                                    id: inputEl ? inputEl.id : null,
                                    dataAutomation: inputEl ? inputEl.getAttribute("data-automation-id") : null,
                                    ariaLabel: inputEl ? inputEl.getAttribute("aria-label") : null,
                                    tagName: inputEl ? inputEl.tagName.toLowerCase() : null,
                                    hasPopup: inputEl ? inputEl.getAttribute("aria-haspopup") : null,
                                    value: inputEl ? (inputEl.value || inputEl.innerText) : null,
                                };
                            }
                            return null;
                        })
                        .filter(field => field !== null);
                });
                
                
                    // Loop over each required field
                for (const field of requiredFields) {

                    try{
                    
                        var key = field.label;
                        
                        debugger;
                        // Skip finaelds that already have a value
                        
                        if (field.value !== null && field.value !== undefined && field.value.trim() !== "" && !(field.value.toLowerCase().includes('select'))){
                            continue;
                        }

                        // const userConfirmed31 = await getUserInput(targetPage,'error check page');
                
                        const locators = [];
                        if (field.dataAutomation) {
                            locators.push(targetPage.locator(`[data-automation-id="${field.dataAutomation}"]`));
                        }
                        if (field.id) {
                            locators.push(targetPage.locator(`#${field.id}`));
                        }
                        if (field.label) {
                            locators.push(targetPage.locator(`::-p-aria(${field.label})`));
                        }
                        
                        if (locators.length === 0) {
                            console.error(`No selector available for field "${key}"`);
                            continue;
                        }

                        await puppeteer.Locator.race(locators).setTimeout(timeout).click();

                        

                        
                        


                        // Select the error element
                        
                        await page.setViewport({ width: 1680, height: 1050 }); // Increase viewport size

                        
                        // const errorHandle = await targetPage.$("p[data-automation-id='inputError']");
                        const elements = await page.waitForSelector(`#${field.id}`);
                        const parentSelector = await page.evaluate(el => {
                            const parent = el.closest('div[data-automation-id]');
                            return parent ? 'div[data-automation-id="' + parent.getAttribute('data-automation-id') + '"]' : null;
                        }, elements);
                        

                        // const parentElement = await page.$('div[data-automation-id]');
                        
                        const element = await page.waitForSelector(parentSelector);
                        // await element.click(); // Simulates a user click


                        if (key.includes('Unnamed')) {
                            locators.push(targetPage.locator(parentSelector));
                            key = await element.evaluate(el => el.innerText.trim()) || "Unnamed field";
                            // key = await element.evaluate(el => el.getAttribute("label") ? el.getAttribute("label").trim() || el.innerText.trim() : "Unnamed field");
                        }
                          
                          await page.evaluate(el => {
                            const rect = el.getBoundingClientRect();
                            // Calculate desired position so that the element's center is at the viewport's center
                            const desiredTop = window.innerHeight * 0.3 - rect.height / 2;
                            const currentTop = rect.top;
                            window.scrollBy(0, currentTop - desiredTop);
                          }, element);


                          await page.evaluate(el => {
                            const rect = el.getBoundingClientRect();
                            // Calculate the desired offset from the top of the viewport, e.g., 30% of viewport height
                            const desiredTop = window.innerHeight * 0.2;
                            // Determine the current position of the element relative to the viewport
                            const currentTop = rect.top;
                            // Scroll by the difference so that the element's top aligns to desiredTop
                            window.scrollBy(0, currentTop - desiredTop);
                          }, element);
                          
                          await element.focus();  
  
                        const userConfirmed3443 = await getUserInput(targetPage,'Click Appear');

                        
                        if (userConfirmed3443 === '') {
                            
                            await puppeteer.Locator.race(locators).setTimeout(timeout).click();
                            // await sleep(2000);
                        }

                       
                        if (field.value.toLowerCase().includes('select')) {

                                // Wait for the button that triggers the popup using its unique data-automation-id
                                    const buttonElement = await page.waitForSelector(parentSelector);    
                                    // Click the button to open the listbox popup
                                    // Try to get the 'aria-controls' attribute from the button
                                    const ariaControls = await buttonElement.evaluate(el => el.getAttribute('aria-controls'));
        
                                    // Build the listbox selector
                                    let listboxSelector;
                                    if (ariaControls && ariaControls.trim() !== "") {
                                    listboxSelector = `#${ariaControls}`;
                                    } else {
                                    // Fallback: use the generic role selector for the listbox
                                    listboxSelector = 'ul[role="listbox"]';
                                    }
        
                                    // Wait for the listbox popup to appear and be visible
        
                                    // Get bounding box for the original element
                                    
                                    // Wait for the listbox and get its bounding box
                                    const listbox = await page.waitForSelector(listboxSelector, { visible: true });
                                    const listboxBox = await listbox.boundingBox();
        
                                    // Compute the minimal bounding rectangle that covers both


                                    const rectangle = await element.evaluate(el => {
                                        const rect = el.getBoundingClientRect();
                                        return {
                                          left: rect.left + window.scrollX, // adjust for scrolling if necessary
                                          top: rect.top + window.scrollY,
                                          width: rect.width,
                                          height: rect.height
                                        };
                                      });
                                      
                                      // Validate using the rectangle object instead of undefined "boundingBo

                                      const recta = await listbox.evaluate(el => {
                                        const rect = el.getBoundingClientRect();
                                        return {
                                          left: rect.left + window.scrollX, // adjust for scrolling if necessary
                                          top: rect.top + window.scrollY,
                                          height: rect.height
                                        };
                                      });
                                      
                                      // Validate using the rectangle object instead of undefined "boundingBox"
                                      if (rectangle && rectangle.width > 0 && rectangle.height > 0) {
                                        const x = Number(rectangle.left);
                                        const y = Number(rectangle.top);
                                        const w = Number(rectangle.width);
                                        const h = Number(rectangle.height+recta.height) ; // double the height downward
                                        
                                        await page.screenshot({
                                          path: 's1.png',
                                          clip: { x, y, width: w, height: h }
                                        });
                                      } else {
                                        console.log('Element is either hidden or collapsed.');
                                      }  

                                   
        
                                    await page.waitForSelector(listboxSelector, { visible: true });
        
                                    
        
        
                                    // Extract the options from the listbox using the role attribute for the options
                                    const options = await page.evaluate(selector => {
                                    const listbox = document.querySelector(selector);
                                    if (!listbox) return [];
        
                                    // Get all <li> elements that are marked as options
                                    const liElements = listbox.querySelectorAll('li[role="option"]');
        
                                    return Array.from(liElements).map(li => ({
                                        id: li.id,
                                        text: li.innerText.trim(),
                                        dataValue: li.getAttribute('data-value'),
                                        ariaDisabled: li.getAttribute('aria-disabled'),
                                        ariaSelected: li.getAttribute('aria-selected')
                                    }));
                                    }, listboxSelector);
        
                                    console.log('Options:', options);


                                    var textIdDictionary = options.reduce((acc, option) => {
                                        acc[option.text] = option.id;
                                        return acc;
                                    }, {});
                                    
                                    // Create an array containing all the text values
                                    const textArray = options.map(option => option.text);

                                    if (!indexValues[key]) {
            
                        
                                        const imagePart = {
                                        inlineData: {
                                            data: Buffer.from(fs.readFileSync('s1.png')).toString("base64"),
                                            mimeType: "image/png"
                                        }
                                        };
                            
                                        
                                        
                                        try {
                            
                                                    const model5 = genAI.getGenerativeModel({
                                                        model: "gemini-1.5-pro",
                                                        generationConfig: {
                                                        responseMimeType: "application/json",
                                                        responseSchema:  {
                                                            description: "Single word response",
                                                            type: "string",
                                                            enum: textArray,
                                                        },
                                                        temperature:0.0,
                                                        },
                                                        systemInstruction: `Provide a single word answer from the available options. Your response must be one of these options: ${textArray.join(', ')}.`
                                                        });
                            
                                                        let prompt = `
                                                        Question: "${key}"
                                                        Image Context: (The image shows the question and its options.)
                                                        JSON Data: ${JSON.stringify(indexValues)}
                                                        Options: ${textArray.join(', ')}.
                                                        Answer the Question from the otpions.
                                                        `;
                                                    
                            
                                                    var result = await model5.generateContent([prompt, imagePart]);
                            
                                               
                                        } catch (error) {
                                            console.error(`Error processing field "${key}" using locators:`, error);
                                        }
                                    
                                        // const prompt = `Answer the question, "${key}". question and options is given in the image. If the job application question is too generic and irrelevant to a specific candidature than answer the question apporpirately yourself strictly from the options(if provided) given in the image. Use ${JSON.stringify(indexValues)} for reference to answer. Some irrelavant questions are "Is there any conflict of interest?","Have you previously worked for any company?","Are you contractor of any company?" obviously appropriate answer to thsee question should be No. Most of the time such question have options in the image, so choose from them or Consisder yourself a job applicant and answer the appropirate answer using your intellegence`;
                                        let prompt = `Question: "${key}"
                                                     Image Context: (The image shows the question and any answer options.)
                                                     JSON Data: ${JSON.stringify(indexValues)}
                                                     Answer (from option only if provided):
                                                    `;
                            
                                        
                                        // Call the generative model (e.g., Gemini)
                                        
                                        if (result == undefined) {
                                        var result = await model.generateContent([prompt, imagePart]);
                                        }
                                       
                                        const an= result.response.text();
                                        const ad=JSON.parse(an);
                                        var bn=ad.trim();
                                        if (bn === "99") {
                                            const answer =  await getUserInput(targetPage,key);    
                                            bn = answer;
                                                
                                        }
                                        
                                        if  (!key.includes("Unnamed") && (!bn.toLowerCase().includes("select"))) {
                                        indexValues[key] = bn;
                                        fs.writeFileSync(filePath, JSON.stringify(indexValues, null, 2));
                                        } 
                                        
                                        var value =bn;
                                    }
                                    else{
                                        var value =indexValues[key];
                                    }
        
                                 


                        }

                        else{


                            const rectangle = await element.evaluate(el => {
                                const rect = el.getBoundingClientRect();
                                return {
                                  left: rect.left + window.scrollX, // adjust for scrolling if necessary
                                  top: rect.top + window.scrollY,
                                  width: rect.width,
                                  height: rect.height
                                };
                              });
                              
                              // Validate using the rectangle object instead of undefined "boundingBo

                    
                              
                              // Validate using the rectangle object instead of undefined "boundingBox"
                              if (rectangle && rectangle.width > 0 && rectangle.height > 0) {
                                const x = Number(rectangle.left);
                                const y = Number(rectangle.top);
                                const w = Number(rectangle.width);
                                const h = Number(rectangle.height) ; // double the height downward
                                
                                await page.screenshot({
                                  path: 's1.png',
                                  clip: { x, y, width: w, height: h }
                                });
                              } else {
                                console.log('Element is either hidden or collapsed.');
                              }  

                        const imagePart = {
                            inlineData: {
                                data: Buffer.from(fs.readFileSync('s1.png')).toString("base64"),
                                mimeType: "image/png"
                            }
                            };

                        let prompt1 = `Analyze the image. Is the red highlighted question ${key} in the image a multiple choice question with options? Respond with true if it's a multiple choice question or false if it's not.`;
                        const result1 = await model1.generateContent([prompt1, imagePart]);   
                        
                        


                        if (result1.response.text().includes('true')){
                        // Wait for the button that triggers the popup using its unique data-automation-id
                            const buttonElement = await page.waitForSelector(parentSelector);    
                            // Click the button to open the listbox popup
                            // Try to get the 'aria-controls' attribute from the button
                            const ariaControls = await buttonElement.evaluate(el => el.getAttribute('aria-controls'));

                            // Build the listbox selector
                            let listboxSelector;
                            if (ariaControls && ariaControls.trim() !== "") {
                            listboxSelector = `#${ariaControls}`;
                            } else {
                            // Fallback: use the generic role selector for the listbox
                            listboxSelector = 'ul[role="listbox"]';
                            }

                            // Wait for the listbox popup to appear and be visible

                            // Get bounding box for the original element
                            
                            // Wait for the listbox and get its bounding 
                            
                            

                            await page.waitForSelector(listboxSelector, { visible: true });




                            // Extract the options from the listbox using the role attribute for the options
                            const options = await page.evaluate(selector => {
                            const listbox = document.querySelector(selector);
                            if (!listbox) return [];

                            // Get all <li> elements that are marked as options
                            const liElements = listbox.querySelectorAll('li[role="option"]');

                            return Array.from(liElements).map(li => ({
                                id: li.id,
                                text: li.innerText.trim(),
                                dataValue: li.getAttribute('data-value'),
                                ariaDisabled: li.getAttribute('aria-disabled'),
                                ariaSelected: li.getAttribute('aria-selected')
                            }));
                            }, listboxSelector);

                            console.log('Options:', options);

                        } 

                        var value = await getIndexValue(targetPage,key);

                    }
                        
                        try {


                            if (field.value.toLowerCase().includes('select')) {
                                const locators1 = [
                                    targetPage.locator(`aria/${value}`),  // Find by ARIA text
                                    targetPage.locator('[role="generic"]')
                                     // Find by role attribute
                                ];
                                
                                locators1.push(targetPage.locator(`::-p-aria(${value}) >>>> ::-p-aria([role=\\"generic\\"])`));
                                locators1.push(targetPage.locator(`#${textIdDictionary[value]}`));
                                
                                await puppeteer.Locator.race(locators1).setTimeout(timeout).click();
                                continue;
                            }
                       
                        
                    
                            else if (field.tagName === "input" || field.tagName === "textarea") {
                                await  puppeteer.Locator.race(locators).setTimeout(timeout).fill(value);
                                console.log(`Filled "${key}" with value "${value}"`);
                                {
                                    const targetPage = page;
                                    await targetPage.keyboard.down('Enter');
                                }
                                {
                                    const targetPage = page;
                                    await targetPage.keyboard.up('Enter');
                                }
                                {
                                    const targetPage = page;
                                    await targetPage.keyboard.down('Enter');
                                }
                                {
                                    const targetPage = page;
                                    await targetPage.keyboard.up('Enter');
                                
                                } 
                            } else if (field.tagName === "select") {
                                await puppeteer.Locator.race(locators).setTimeout(timeout).select(value);
                                console.log(`Selected option "${value}" for "${key}"`);
                            } else if (field.tagName === "button" || field.hasPopup === "listbox") {
                                await puppeteer.Locator.race(locators).setTimeout(timeout).click();
                                console.log(`Clicked dropdown button for "${key}"`);
                
                                // Wait and select option
                                await puppeteer.Locator.race(`::-p-aria(${value})`).setTimeout(timeout).click();
                                {
                                    const targetPage = page;
                                    await targetPage.keyboard.down('Enter');
                                }
                                {
                                    const targetPage = page;
                                    await targetPage.keyboard.up('Enter');
                                }
                                {
                                    const targetPage = page;
                                    await targetPage.keyboard.down('Enter');
                                }
                                {
                                    const targetPage = page;
                                    await targetPage.keyboard.up('Enter');
                                
                                } 
                                console.log(`Selected "${value}" from dropdown for "${key}"`);
                            } else {
                                console.warn(`Unsupported field type for "${key}"`);
                            }
                        } catch (error) {
                            console.error(`Error processing field "${key}" using locators:`, error);
                        }

                    }
                    catch(error){
            
                        console.error(`Error processing field "${key}" using locators:`, error);
            
                    }
                    }
                   

                   const userConfirmed21 = await getUserInput(targetPage,'Final check page');
                   
                   if (requiredFields.length !== 0 && userConfirmed21 === '') {

                    {
                        const targetPage = page;
                        const timeou=20000;
                        await puppeteer.Locator.race([
                            targetPage.locator("[data-automation-id='bottom-navigation-next-button']"),
                            targetPage.locator('::-p-xpath(//*[@data-automation-id=\\"bottom-navigation-next-button\\"])'),
                            targetPage.locator(":scope >>> [data-automation-id='bottom-navigation-next-button']"),
                            targetPage.locator('::-p-aria(Save and Continue)'),
                            targetPage.locator('::-p-text(Save and Continue)')
                        ])
                            .setTimeout(timeou)
                            .click({
                                offset: {
                                x: 28.9749755859375,
                                y: 22.79998779296875,
                                },
                            });
                            console.log('2 djjdjdjajdad finished');
                    }

                    
                }
                    
               
               
        }
        catch(error){

            console.error(`Error processing field "${key}" using locators:`, error);

        }
    }
    await targetPage.setViewport({
        width: 893,
        height: 676
    })    
        var att=1;
        
        while(true) {


            try{

            const timeout=15000;

            {
                const targetPage = page;
                await puppeteer.Locator.race([
                    targetPage.locator("[data-automation-id='agreementCheckbox']"),
                    targetPage.locator('::-p-xpath(//*[@data-automation-id=\\"agreementCheckbox\\"])'),
                    targetPage.locator(":scope >>> [data-automation-id='agreementCheckbox']"),
                    
                ])
                    .setTimeout(timeout)
                    .click({
                      offset: {
                        x: 11.399993896484375,
                        y: 10.324981689453125,
                      },
                    });
            }
            {
                const targetPage = page;
                await puppeteer.Locator.race([
                    targetPage.locator("[data-automation-id='bottom-navigation-next-button']"),
                    targetPage.locator('::-p-xpath(//*[@data-automation-id=\\"bottom-navigation-next-button\\"])'),
                    targetPage.locator(":scope >>> [data-automation-id='bottom-navigation-next-button']"),
                    targetPage.locator('::-p-aria(Save and Continue)'),
                    targetPage.locator('::-p-text(Save and Continue)')
                ])
                    .setTimeout(timeout)
                    .click({
                      offset: {
                        x: 41.9749755859375,
                        y: 17.79998779296875,
                      },
                    });
            }
            const user3Confirmed5 = await getUserInput(targetPage,'Are you sure you want to continue? (yes/no): ');
            {
                const targetPage = page;
                const timeout1=60000;
                
                
                await puppeteer.Locator.race([
                    targetPage.locator("[data-automation-id='bottom-navigation-next-button']"),
                    targetPage.locator('::-p-xpath(//*[@data-automation-id=\\"bottom-navigation-next-button\\"])'),
                    targetPage.locator(":scope >>> [data-automation-id='bottom-navigation-next-button']"),
                    targetPage.locator('::-p-aria(Submit)'),
                    targetPage.locator('::-p-text(Submit)')
                ])
                    .setTimeout(timeout1)
                    .click({
                      offset: {
                        x: 33.4000244140625,
                        y: 25.79998779296875,
                      },
                    });
                    console.log('sakahda');
            }
            
        }catch(error){

            console.log(error);
        }



        }


        await browser.disconnect();
    }

)().catch((err) => {
    console.error(err);
    process.exit(1);
});