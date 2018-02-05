The AskNow UI:

The AskNow UI uses the bootstrap, Jquery for rendering HTML template. For the backend, Python with flask framework is used.

To run it: 
python3 app.py

WorkFlow:
1. In index page, get the question from user input.

2. Backend gets the question, and returns the type of answer with the answer itself to the frontend.

3. The front end received the json data of the input question from backend, then rendering it to the type-specific (resource, list, literal, boolean) page.



########################################
static folder includes css, js and img files for the frondend.
--css:
-----themes: folder containing the css files for different color styles
-----stleSwitcher.css: for switch color styles in themes folder
-----asknow.css: basic css file for all webpages
-----bootstrap.css: bootstrap css 
-----font-awesome.min.css: css file for fonts
-----youtube.css: css file in youtube module

--js:
-----asknow.js:common javascript for all pages
-----imgSearch.js: js for searching image and rendering in HTML template by using bing image search api
-----videoSearch.js: js for searching video on youtubr and rendering in HTML template
-----resource.js, list.js, litbol.js are for rendering json data in resource, list, literal, and boolean page respectively

--fonts: folder containing fonts style
--img: logos, example images


########################################
templates folder includes resource, boolean, literal, list and 404 page templates

########################################
data folder includes example json files for this UI.

qa.json: the example json file for autocomplete
resource.json: the example json file containing differernt kinds of questions.
There are four kinds of question in the json file. 

For resource question:
    {
      "question": "Who is the president of USA?",
      "answer": "Donald Trump",
      "entity": "USA",
      "type": "Politician",
      "abstract": "Trump was born in the New York City borough of Queens. He earned an economics degree from the Wharton School of the University of Pennsylvania and followed his grandmother Elizabeth and father Fred in running the family real estate company. He named it The Trump Organization, and ran it from 1971 until his 2017 inauguration. Trump's real estate career focused on building or renovating skyscrapers, hotels, casinos, and golf courses. He has also started multiple side ventures that included branding and licensing his name for real estate and various products, and he co-authored several books. Additionally, he produced and hosted The Apprentice, a reality television game show about business, from 2003 to 2015. According to Forbes, he was the world's 544th richest person as of May 2017, with an estimated net worth of $3.5 billion.", 
      "summary":"Donald Trump is a person. Donald Trump's birth places are New York City and Queens.", 
      "recommendations":"Here do not know",
      "related_entities":"Melania",
      "similar_entities":"Obama", 
      "question_type":"resource"
    }

For list question:
{
      "question": "List the people who were president of USA.",
      "answer": {
        "0":"Donald Trump", 
        "1":"Barack Obama",
        "2":"George W. Bush",
        "3":"Bill Clinton", 
        "4":"Person5", 
        "5":"Person6", 
        "6":"Person7",
        "7":"Person8", 
        "8":"Person9",
        "9":"Person10", 
        "10":"Person11",
        "11":"Person12", 
        "12":"Person13",
        "13":"Person14"
      },
      "abstract":{
        "0":"Donald John Trump is the 45th and current President of the United States, in office since January 20, 2017. Before entering politics, he was a businessman and television personality. Trump was born in the New York City borough of Queens.", 
        "1":"Barack Hussein Obama II (/bəˈrɑːk huːˈseɪn oʊˈbɑːmə/ (About this sound listen);[1] born August 4, 1961) is an American politician who served as the 44th President of the United States from 2009 to 2017. The first African American to assume the presidency, he previously served as a United States Senator, representing Illinois from 2005 to 2008. He also served in the Illinois State Senate from 1997 to 2004.",
        "2":"George Walker Bush is an American politician who served as the 43rd President of the United States from 2001 to 2009. He was also the 46th Governor of Texas from 1995 to 2000.",
        "3":"William Jefferson Clinton is an American politician who served as the 42nd President of the United States from 1993 to 2001. Prior to the presidency, he was the Governor of Arkansas from 1979 to 1981, and again from 1983 to 1992.",
        "4":"abstract5",
        "5":"abstract6", 
        "6":"abstract7", 
        "7":"abstract8",
        "8":"abstract9", 
        "9":"abstract10", 
        "10":"abstract11", 
        "11":"abstract12",  
        "12":"abstract13",
        "13":"abstract14"
      }, 
      "question_type":"list"
    }  

 For literal question:
  {
      "question": "How high is Sagarmatha Mountain?",
      "answer": "8888m", 
      "question_type":"literal"
    },
 For boolean question:
  {
      "question": "Is the Sagarmatha Mountain the highest mountain?",
      "answer": "Yes", 
      "question_type":"bol"
    }, 
