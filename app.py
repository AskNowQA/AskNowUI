# -*- coding:utf-8 -*-
from flask import Flask, request, render_template, url_for, jsonify, Response, redirect, session
from flask_bootstrap import Bootstrap
import json, sys
import requests
import os
import wikipedia

app = Flask(__name__, static_url_path='/static')
#bootstrap = Bootstrap(app)


#Autocomplete part...... 
@app.route('/_autocomplete', methods=['POST'])
def autocomplete():  
    SITE_ROOT = os.path.realpath(os.path.dirname(__file__))
    json_url = os.path.join(SITE_ROOT, "data", "qa.json")
    data = json.load(open(json_url))
    results=[]
    for item in data:
        results.append(item["question"])
    return Response(json.dumps(results), mimetype='application/json')



#get resource json
@app.route('/_getJSON', methods=['GET', 'POST'])
def getJSON():  
    #load local resource json
    SITE_ROOT = os.path.realpath(os.path.dirname(__file__))
    json_url = os.path.join(SITE_ROOT, "data", "resource.json")
    resourceJSON = json.load(open(json_url)) 
   
    #get the question
    print("#"*20)
    print(QUESTION)
    for item in resourceJSON:
        if item["question"]==QUESTION:
            returnedJSON=item

    return Response(json.dumps(returnedJSON), mimetype='application/json')   

# index part
# question name
@app.route('/', methods=['GET', 'POST'])
def index():
    '''
    if request.method == 'POST':
        question = request.form.get('question')
        data = {"question": str(question)}
        return jsonify(data)
    '''
    return render_template('index.html')



@app.route('/resource', methods=['GET', 'POST'])
def showResource(): 
    if request.method == 'GET':
        question=request.args.get('question')
        if question is None:
            question='Who is the last president of the U.S.?'
        global QUESTION
        QUESTION=question
        return render_template('resource.html') 
    return render_template('resource.html')


@app.route('/list')
def showList():
    return render_template('list.html')

@app.route('/literal')
def showLiteral():
    return render_template('literal.html')

@app.route('/bol')
def showBoolean():
    return render_template('bol.html')

@app.route('/404')
def showNothing():
    return render_template('none.html')

@app.errorhandler(404)
def not_found(error):
    return render_template('none.html')



if __name__ == '__main__':
    app.run(debug = True)

