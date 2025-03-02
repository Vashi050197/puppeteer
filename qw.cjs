const path = require('path');
const fs = require('fs');
const readline = require('readline');
// import puppeteer from 'puppeteer'; // v23.0.0 or later
// puppeteer.Locator
// .race()
// console.log("Puppeteer script started...");
// console.log("Puppeteer script started...");

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyDEl4vJaneM22pSs67ygDmi9nUTZ87I0xY");

const schema = {
    description: "Char",
    type: "string",
    minLength: 1,
    maxLength: 1,
  };
  
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema,
    },
    systemInstruction: "Give the output in 1 word(in Integer format) only, if no answer is found in Json than output 99 and RESPONSE ASAP sometime answer is not in Json So simply output 99. some of the question has same meaning like NOTICE PERIOD or NP and 'how soon you can join' these all have same meaning. similarly for current salary,  current CTC or CCTC are same. CCTC is just short form of current CTC. Same for Expected CTC and ECTC. ECTC and CCTC are obviously different. Related question which has same meaning/context may be find in the Json than answer that but if you are not sure than output 99"
                            
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
            const screen = await page.screenshot({ path: 's.jpg',type: "jpeg", fullPage: false, omitBackground: true });
            
              

            // Construct the image part object using the buffer data
            const imagePart = {
            inlineData: {
                data: Buffer.from(fs.readFileSync('s.jpg')).toString("base64"),
                mimeType: "image/jpeg"
            }
            };

            const prompt = `Answer the question, "${key}". question and options is given in the image. If the job application question is too generic and irrelevant to specific candidature than answer the question apporpirately yourself from the options given in the image. Use ${JSON.stringify(indexValues)} for reference to answer.`;

            // Call the generative model (e.g., Gemini)
            const result = await model.generateContent([prompt, imagePart]);

           
            const an= result.response.text();
            const ad=JSON.parse(an);
            const bn=ad.trim();
            if (bn === "99") {
                const answer =  await getUserInput(targetPage,key);    
                indexValues[key] = answer;
                
            }
            indexValues[key] = bn;
            fs.writeFileSync(filePath, JSON.stringify(indexValues, null, 2));    
        }
        return indexValues[key];
        }
    
    // Call function in Puppeteer
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

                    await puppeteer.Locator.race(locators).setTimeout(timeout).select(value);
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
        
        while(true) {

            const userConfirmed212 = await getUserInput(targetPage,'Navigation waiting');
            
            {
                    const targetPage = page;
                    debugger;
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
            
            const userConfirmed2 = 
            await getUserInput(targetPage,'volu page');
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

                const requiredFields = await targetPage.evaluate(() => {
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
                for (const field of requiredFields) {
                        const key = field.label;
                        debugger;
                        // Skip finaelds that already have a value
                        
                        if (field.value !== null && field.value !== undefined && field.value.trim() !== "" && !(field.value.toLowerCase().includes('select'))){
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

                        await puppeteer.Locator.race(locators).setTimeout(timeout).click();

                        const value = await getIndexValue(targetPage,key);

                        if (field.value.toLowerCase().includes('select')) {

                            await puppeteer.Locator.race(locators).setTimeout(timeout).select(value);
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
        
        
        var att=2;
        while(att!==0) {



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
            att=att-1;
            console.log('att'+att);

        }


        await browser.disconnect();
    }

)().catch((err) => {
    console.error(err);
    process.exit(1);
});
   
   
   
   