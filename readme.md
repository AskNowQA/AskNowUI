# AskNow UI

Front end for question-answer system "AskNow"

## Getting Started

To run it (python 2.7 is required):
```
python app.py
```


### Work flow

```
1. In index page, get the question from user input.

2. Backend gets the question, and returns the type of answer with the answer itself to the frontend.

3. The front end received the json data of the input question from backend, then rendering it to the type-specific (resource, list, literal, boolean) page.

```

## Built With

* [Flask](http://flask.pocoo.org) - web microframework for Python
* [Bootstrap](https://getbootstrap.com) - Bootstrap is a free and open-source front-end web framework for designing websites and web applications
* [Jquery](https://jquery.com) - JavaScript library designed to simplify the client-side scripting of HTML


See requirements.txt file for python dependencies.

### File structure

* static folder: including css, js and img files for the frond end.
```
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
-----recorder.js, recorderWorker.js, dictate.js, mob.js are for recording audio function. See [Dictate.js](https://kaljurand.github.io/dictate.js/)

--fonts: folder containing fonts style
--img: logos, example images
```

* template folder: including resource, boolean, literal, list and 404 page templates

* data folder: including example json files for this front end.
```
qa.json: the example json file for autocomplete
resource.json: the example json file containing differernt kinds of questions.
There are four kinds of question in the json file. 
```
* app.py:
```
using /_getJSON point to get question type and question content
using /_autocomplete to autocomplete the input field
``` 


